"""Phase 9.1 IDOR/authz matrix.

Proves, route family by route family, that identity comes ONLY from the bearer
token: account A must never read, write, hijack-by-id-collision, or destroy
account B's data, and stale/invalid sessions must die with 401.

The two ``*_write_cannot_hijack`` tests encode the primary-key collision rule:
report/journal ids are globally unique PKs, so a write carrying an id owned by
another account MUST be rejected instead of merged over their row.
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


REPORT_A = {
    "id": "mx-a-1",
    "date": "2026-08-01",
    "label": "Account A visit",
    "results": [_result("hemoglobin", 13.5, "Normal")],
}
REPORT_B = {
    "id": "mx-b-1",
    "date": "2026-08-02",
    "label": "Account B visit",
    "results": [_result("ferritin", 18.0, "Normal")],
}
JOURNAL_B = {
    "entry_type": "medication",
    "name": "Metformin",
    "dosage": "500mg",
    "start_date": "2026-08-01",
}


@pytest.fixture()
def client(tmp_path):
    engine = create_engine(
        f"sqlite:///{(tmp_path / 'test_authz.db')}",
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


# ---------------------------------------------------------------- history ---


def test_history_reads_are_token_scoped(client):
    token_a = _register(client, "mx-a@example.com")
    token_b = _register(client, "mx-b@example.com")
    client.post("/api/history/bulk", json={"reports": [REPORT_A]}, headers=_auth(token_a))
    client.post("/api/history/bulk", json={"reports": [REPORT_B]}, headers=_auth(token_b))

    seen_a = client.get("/api/history", headers=_auth(token_a)).json()
    seen_b = client.get("/api/history", headers=_auth(token_b)).json()

    assert [r["id"] for r in seen_a] == [REPORT_A["id"]]
    assert [r["id"] for r in seen_b] == [REPORT_B["id"]]


def test_cross_account_report_delete_is_noop(client):
    token_a = _register(client, "mx-del@example.com")
    token_b = _register(client, "mx-victim@example.com")
    client.post("/api/history/bulk", json={"reports": [REPORT_B]}, headers=_auth(token_b))

    resp = client.delete(f"/api/history/report/{REPORT_B['id']}", headers=_auth(token_a))

    assert resp.status_code == 404
    assert [r["id"] for r in client.get("/api/history", headers=_auth(token_b)).json()] == [
        REPORT_B["id"]
    ]


def test_cross_account_result_delete_is_noop(client):
    token_a = _register(client, "mx-resdel@example.com")
    token_b = _register(client, "mx-resvictim@example.com")
    client.post("/api/history/bulk", json={"reports": [REPORT_B]}, headers=_auth(token_b))

    url = f"/api/history/result/{REPORT_B['id']}/ferritin"
    assert client.delete(url, headers=_auth(token_a)).status_code == 404

    victim_rows = client.get("/api/history", headers=_auth(token_b)).json()
    assert [r["testId"] for r in victim_rows[0]["results"]] == ["ferritin"]


def test_clear_all_is_owner_scoped(client):
    token_a = _register(client, "mx-clear@example.com")
    token_b = _register(client, "mx-clearb@example.com")
    client.post("/api/history/bulk", json={"reports": [REPORT_A]}, headers=_auth(token_a))
    client.post("/api/history/bulk", json={"reports": [REPORT_B]}, headers=_auth(token_b))

    assert client.delete("/api/history", headers=_auth(token_a)).status_code == 200

    assert client.get("/api/history", headers=_auth(token_a)).json() == []
    assert len(client.get("/api/history", headers=_auth(token_b)).json()) == 1


def test_cross_account_report_id_write_cannot_hijack(client):
    """PK-collision guard: A re-POSTing B's report id must NOT overwrite B's row."""
    token_a = _register(client, "mx-hijack@example.com")
    token_b = _register(client, "mx-hijacked@example.com")
    client.post("/api/history/bulk", json={"reports": [REPORT_B]}, headers=_auth(token_b))

    forged = dict(REPORT_B)
    forged["label"] = "Attacker-controlled rewrite"
    forged["results"] = [_result("hemoglobin", 1.0, "Low")]
    resp = client.post("/api/history", json=forged, headers=_auth(token_a))

    assert resp.status_code in (403, 409), resp.text
    victim_rows = client.get("/api/history", headers=_auth(token_b)).json()
    assert len(victim_rows) == 1
    assert victim_rows[0]["label"] == REPORT_B["label"]
    assert [r["testId"] for r in victim_rows[0]["results"]] == ["ferritin"]

    # Bulk path carries the same rule.
    resp_bulk = client.post(
        "/api/history/bulk", json={"reports": [forged]}, headers=_auth(token_a)
    )
    assert resp_bulk.status_code in (403, 409), resp_bulk.text
    assert [r["id"] for r in client.get("/api/history", headers=_auth(token_b)).json()] == [
        REPORT_B["id"]
    ]


# ---------------------------------------------------------------- journal ---


def test_journal_reads_and_deletes_are_token_scoped(client):
    token_a = _register(client, "mx-j@example.com")
    token_b = _register(client, "mx-jb@example.com")

    saved = client.post("/api/journal", json=JOURNAL_B, headers=_auth(token_b))
    assert saved.status_code == 200
    entry_id = saved.json()["id"]

    assert client.get("/api/journal", headers=_auth(token_a)).json() == []
    entries_b = client.get("/api/journal", headers=_auth(token_b)).json()
    assert [e["id"] for e in entries_b] == [entry_id]

    resp = client.delete(f"/api/journal/{entry_id}", headers=_auth(token_a))
    assert resp.status_code == 404
    assert len(client.get("/api/journal", headers=_auth(token_b)).json()) == 1


def test_cross_account_journal_id_write_cannot_hijack(client):
    """PK-collision guard: A re-POSTing B's journal entry id must not take it over."""
    token_a = _register(client, "mx-jh@example.com")
    token_b = _register(client, "mx-jhb@example.com")

    saved = client.post("/api/journal", json=JOURNAL_B, headers=_auth(token_b))
    entry_id = saved.json()["id"]

    forged = dict(JOURNAL_B)
    forged["id"] = entry_id
    forged["name"] = "Attacker-controlled entry"
    resp = client.post("/api/journal", json=forged, headers=_auth(token_a))

    assert resp.status_code in (403, 409), resp.text
    entries = client.get("/api/journal", headers=_auth(token_b)).json()
    assert len(entries) == 1
    assert entries[0]["name"] == JOURNAL_B["name"]
    assert entries[0]["user_email"] == "mx-jhb@example.com"


# ---------------------------------------------------------------- profile ---


def test_profile_reads_and_writes_are_token_scoped(client):
    token_a = _register(client, "mx-pa@example.com")
    token_b = _register(client, "mx-pb@example.com")

    assert client.post("/api/profile", json={"full_name": "B Profile"}, headers=_auth(token_b)).status_code == 200
    assert client.post("/api/profile", json={"full_name": "A Profile"}, headers=_auth(token_a)).status_code == 200

    prof_a = client.get("/api/profile", headers=_auth(token_a)).json()
    prof_b = client.get("/api/profile", headers=_auth(token_b)).json()

    assert prof_a["full_name"] == "A Profile"
    assert prof_b["full_name"] == "B Profile"
    assert prof_b["user_email"] == "mx-pb@example.com"


# ----------------------------------------------------------- vault delete ---


def test_vault_delete_only_destroys_own_account(client):
    token_a = _register(client, "mx-va@example.com")
    token_b = _register(client, "mx-vb@example.com")
    client.post("/api/history/bulk", json={"reports": [REPORT_B]}, headers=_auth(token_b))
    client.post("/api/journal", json=JOURNAL_B, headers=_auth(token_b))
    client.post("/api/profile", json={"full_name": "B Profile"}, headers=_auth(token_b))

    assert client.delete("/api/profile/delete", headers=_auth(token_a)).status_code == 200

    # A's session died with the vault wipe...
    assert client.get("/api/history", headers=_auth(token_a)).status_code == 401
    # ...and B's data survived untouched across every family.
    assert len(client.get("/api/history", headers=_auth(token_b)).json()) == 1
    assert len(client.get("/api/journal", headers=_auth(token_b)).json()) == 1
    assert client.get("/api/profile", headers=_auth(token_b)).json()["full_name"] == "B Profile"


# --------------------------------------------------------------- sessions ---


def test_stale_and_invalid_sessions_rejected(client):
    token = _register(client, "mx-s@example.com")
    assert client.post("/api/auth/logout", headers=_auth(token)).status_code == 200

    assert client.get("/api/history", headers=_auth(token)).status_code == 401
    assert client.get("/api/history", headers=_auth("not-a-real-token")).status_code == 401
    assert client.get("/api/history").status_code == 401


def test_logout_all_kills_every_session(client):
    email = "mx-all@example.com"
    token_1 = _register(client, email)
    login = client.post("/api/auth/login", json={"email": email, "password": "Str0ngPass!x"})
    assert login.status_code == 200
    token_2 = login.json()["token"]

    assert client.post("/api/auth/logout-all", headers=_auth(token_1)).status_code == 200

    assert client.get("/api/history", headers=_auth(token_1)).status_code == 401
    assert client.get("/api/history", headers=_auth(token_2)).status_code == 401
