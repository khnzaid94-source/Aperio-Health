"""History API round-trip + ownership regression suite.

Guards the deletion-propagation contract: whatever the client deletes must be
gone from the server on next fetch (single report, single biomarker, clear-all),
and users must never be able to touch another account's rows.
"""

import os
import sys

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BACKEND_DIR)
os.chdir(BACKEND_DIR)

from database import Base, get_db  # noqa: E402
from main import app  # noqa: E402


def _result(test_id: str, value: float, classification: str) -> dict:
    return {
        "testId": test_id,
        "name": test_id.title(),
        "category": "QA",
        "measuredValue": value,
        "unit": "mg/dL",
        "referenceMin": 10.0,
        "referenceMax": 20.0,
        "classification": classification,
        "urgency": "Routine",
        "explanation": "",
    }


REPORT_A1 = {
    "id": "qa-a-1",
    "date": "2026-08-01",
    "label": "Account A visit 1",
    "results": [_result("hemoglobin", 13.5, "Normal"), _result("cholesterol", 230.0, "High")],
}
REPORT_A2 = {
    "id": "qa-a-2",
    "date": "2026-08-20",
    "label": "Account A visit 2",
    "results": [_result("hemoglobin", 14.1, "Normal")],
}
REPORT_B1 = {
    "id": "qa-b-1",
    "date": "2026-08-15",
    "label": "Account B visit 1",
    "results": [_result("ferritin", 18.0, "Normal")],
}


@pytest.fixture()
def client(tmp_path):
    engine = create_engine(
        f"sqlite:///{(tmp_path / 'test_history.db')}",
        connect_args={"check_same_thread": False},
    )
    Base.metadata.create_all(bind=engine)
    TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    def override_get_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.pop(get_db, None)


def _register(client: TestClient, email: str) -> str:
    resp = client.post(
        "/api/auth/register",
        json={"email": email, "password": "Str0ngPass!x", "full_name": "QA Bot"},
    )
    assert resp.status_code == 200, resp.text
    return resp.json()["token"]


def _auth(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def test_clear_history_round_trip(client):
    token = _register(client, "clear@example.com")
    headers = _auth(token)
    assert (
        client.post("/api/history/bulk", json={"reports": [REPORT_A1, REPORT_A2]}, headers=headers).status_code
        == 200
    )
    assert len(client.get("/api/history", headers=headers).json()) == 2

    assert client.delete("/api/history", headers=headers).status_code == 200
    assert client.get("/api/history", headers=headers).json() == []


def test_single_report_delete_round_trip(client):
    token = _register(client, "single@example.com")
    headers = _auth(token)
    client.post("/api/history/bulk", json={"reports": [REPORT_A1, REPORT_A2]}, headers=headers)

    assert client.delete(f"/api/history/report/{REPORT_A1['id']}", headers=headers).status_code == 200
    remaining = client.get("/api/history", headers=headers).json()
    assert [r["id"] for r in remaining] == [REPORT_A2["id"]]


def test_single_test_delete_round_trip(client):
    token = _register(client, "testdel@example.com")
    headers = _auth(token)
    client.post("/api/history/bulk", json={"reports": [REPORT_A1]}, headers=headers)

    url = f"/api/history/result/{REPORT_A1['id']}/cholesterol"
    assert client.delete(url, headers=headers).status_code == 200
    reports = client.get("/api/history", headers=headers).json()
    assert len(reports) == 1
    assert [r["testId"] for r in reports[0]["results"]] == ["hemoglobin"]


def test_user_cannot_delete_other_users_reports(client):
    """IDOR regression guard: cross-account deletes must be a no-op."""
    token_a = _register(client, "owner@example.com")
    token_b = _register(client, "bystander@example.com")
    client.post("/api/history/bulk", json={"reports": [REPORT_A1]}, headers=_auth(token_a))
    client.post("/api/history/bulk", json={"reports": [REPORT_B1]}, headers=_auth(token_b))

    client.delete(f"/api/history/report/{REPORT_B1['id']}", headers=_auth(token_a))
    client.delete(
        f"/api/history/result/{REPORT_B1['id']}/ferritin",
        headers=_auth(token_a),
    )

    bystander_rows = client.get("/api/history", headers=_auth(token_b)).json()
    assert [r["id"] for r in bystander_rows] == [REPORT_B1["id"]]
    assert [r["testId"] for r in bystander_rows[0]["results"]] == ["ferritin"]

    owner_rows = client.get("/api/history", headers=_auth(token_a)).json()
    assert [r["id"] for r in owner_rows] == [REPORT_A1["id"]]


def test_delete_requires_auth(client):
    assert client.delete("/api/history").status_code in (401, 403)
    assert client.delete("/api/history/report/whatever").status_code in (401, 403)
