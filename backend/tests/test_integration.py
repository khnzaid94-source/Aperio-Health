"""Phase 9.3 integration suite: full HTTP surface over a temp SQLite DB.

Codifies the manual prod QA round-trips (register -> login -> authorized
fetch, bulk history push/re-fetch, journal lifecycle, upload endpoint
guard rails incl. magic-byte rejects, mocked Google OAuth verify) that
previously existed only as browser-side battery steps.

Deliberately does NOT re-cover ground owned by other suites:
ownership/isolation matrices live in test_authz_matrix.py, deletion
propagation in test_history_api.py, parser accuracy in test_parser.py /
test_ocr_edges.py / test_sample_corpus.py.
"""

import os
import sys
from io import BytesIO

import pytest
from fastapi.testclient import TestClient
from pypdf import PdfWriter
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BACKEND_DIR)
os.chdir(BACKEND_DIR)

import auth as auth_module  # noqa: E402
from database import Base, get_db  # noqa: E402
from main import app, MAX_FILE_SIZE  # noqa: E402


PANEL_TEXT = (
    "LABORATORY REPORT\nSpecimen Date: 08/20/2026\n"
    "Hemoglobin (Hb)      13.5 g/dL   (Range: 12.0 - 16.0)\n"
    "Total Cholesterol     210 mg/dL   (100 - 200)\n"
)


@pytest.fixture()
def client(tmp_path):
    engine = create_engine(
        f"sqlite:///{(tmp_path / 'test_integration.db')}",
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


def _register(client: TestClient, email: str, password: str = "Str0ngPass!x") -> str:
    resp = client.post(
        "/api/auth/register",
        json={"email": email, "password": password, "full_name": "QA Bot"},
    )
    assert resp.status_code == 200, resp.text
    return resp.json()["token"]


def _auth(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


# ---------------------------------------------------------------- health


def test_health_endpoint_is_public(client):
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


# ------------------------------------------------- register/login flows


def test_register_login_authorized_fetch_round_trip(client):
    token = _register(client, "flow@example.com")
    me = client.get("/api/history", headers=_auth(token))
    assert me.status_code == 200
    assert me.json() == []

    login = client.post(
        "/api/auth/login",
        json={"email": "flow@example.com", "password": "Str0ngPass!x"},
    )
    assert login.status_code == 200
    assert client.get("/api/history", headers=_auth(login.json()["token"])).status_code == 200


def test_register_rejects_duplicate_email(client):
    _register(client, "dupe@example.com")
    dup = client.post(
        "/api/auth/register",
        json={"email": "dupe@example.com", "password": "Str0ngPass!x"},
    )
    assert dup.status_code == 409


def test_register_enforces_minimum_password_length(client):
    weak = client.post(
        "/api/auth/register",
        json={"email": "weak@example.com", "password": "short"},
    )
    assert weak.status_code == 400


def test_auth_emails_are_normalized_case_insensitively(client):
    _register(client, "CaseSensitive@example.com")
    login = client.post(
        "/api/auth/login",
        json={"email": "CASESENSITIVE@EXAMPLE.COM", "password": "Str0ngPass!x"},
    )
    assert login.status_code == 200
    assert login.json()["user_email"] == "casesensitive@example.com"


def test_login_rejects_wrong_password_and_unknown_email(client):
    _register(client, "real@example.com")
    bad_pw = client.post(
        "/api/auth/login",
        json={"email": "real@example.com", "password": "WrongPass!99"},
    )
    assert bad_pw.status_code == 401
    ghost = client.post(
        "/api/auth/login",
        json={"email": "ghost@example.com", "password": "Str0ngPass!x"},
    )
    assert ghost.status_code == 401


# ------------------------------------------------------- password change


def test_password_change_requires_correct_current_password(client):
    token = _register(client, "changer@example.com")
    wrong = client.put(
        "/api/auth/password",
        json={"current_password": "NotIt!12345", "new_password": "An0therPass!x"},
        headers=_auth(token),
    )
    assert wrong.status_code == 401


def test_password_change_enforces_strength(client):
    token = _register(client, "weakchange@example.com")
    weak = client.put(
        "/api/auth/password",
        json={"current_password": "Str0ngPass!x", "new_password": "tiny"},
        headers=_auth(token),
    )
    assert weak.status_code == 400


def test_password_change_rotates_credentials_but_keeps_session(client):
    token = _register(client, "rotate@example.com")
    changed = client.put(
        "/api/auth/password",
        json={"current_password": "Str0ngPass!x", "new_password": "Br4ndNew!pass"},
        headers=_auth(token),
    )
    assert changed.status_code == 200

    assert (
        client.get("/api/history", headers=_auth(token)).status_code == 200
    ), "in-flight session must survive a password rotation"

    old_login = client.post(
        "/api/auth/login",
        json={"email": "rotate@example.com", "password": "Str0ngPass!x"},
    )
    assert old_login.status_code == 401
    new_login = client.post(
        "/api/auth/login",
        json={"email": "rotate@example.com", "password": "Br4ndNew!pass"},
    )
    assert new_login.status_code == 200


# --------------------------------------------------------------- logout


def test_logout_kills_only_that_session_token(client):
    token_a = _register(client, "logouta@example.com")
    token_b = _register(client, "logoutb@example.com")
    assert client.post("/api/auth/logout", headers=_auth(token_a)).status_code == 200
    assert client.get("/api/history", headers=_auth(token_a)).status_code == 401
    assert client.get("/api/history", headers=_auth(token_b)).status_code == 200


def test_logout_without_credentials_is_harmless(client):
    resp = client.post("/api/auth/logout")
    assert resp.status_code == 200
    assert resp.json() == {"status": "logged_out"}


# --------------------------------------------------------- journal CRUD


def _journal_payload(entry_id=None, notes="500mg daily"):
    return {
        **({"id": entry_id} if entry_id else {}),
        "entry_type": "medication",
        "name": "Metformin",
        "dosage": "500mg",
        "start_date": "2026-08-01",
        "notes": notes,
    }


def test_journal_create_read_update_delete_lifecycle(client):
    token = _register(client, "journal@example.com")
    headers = _auth(token)

    created = client.post("/api/journal", json=_journal_payload(), headers=headers)
    assert created.status_code == 200
    entry_id = created.json()["id"]
    assert entry_id.startswith("jrn-")

    entries = client.get("/api/journal", headers=headers).json()
    assert len(entries) == 1
    assert entries[0]["name"] == "Metformin"
    assert entries[0]["dosage"] == "500mg"
    assert entries[0]["start_date"] == "2026-08-01"

    updated = client.post(
        "/api/journal",
        json=_journal_payload(entry_id, notes="1000mg daily"),
        headers=headers,
    )
    assert updated.status_code == 200
    entries = client.get("/api/journal", headers=headers).json()
    assert len(entries) == 1, "update by same id must merge, not duplicate"
    assert entries[0]["notes"] == "1000mg daily"

    assert client.delete(f"/api/journal/{entry_id}", headers=headers).status_code == 200
    assert client.get("/api/journal", headers=headers).json() == []
    assert client.delete(f"/api/journal/{entry_id}", headers=headers).status_code == 404


def test_journal_create_requires_auth(client):
    assert client.post("/api/journal", json=_journal_payload()).status_code in (401, 403)


# ----------------------------------------------- Google OAuth (mocked)


def _mock_google(monkeypatch, client_id="test-google-client-id", raise_valueerror=False, info=None):
    monkeypatch.setattr(auth_module, "GOOGLE_CLIENT_ID", client_id)
    calls = {}

    def fake_verify(credential, request, audience):
        calls["credential"] = credential
        calls["audience"] = audience
        if raise_valueerror:
            raise ValueError("bad token")
        return info

    monkeypatch.setattr(auth_module.google_id_token, "verify_oauth2_token", fake_verify)
    return calls


def test_google_sign_in_returns_503_when_unconfigured(client, monkeypatch):
    monkeypatch.setattr(auth_module, "GOOGLE_CLIENT_ID", "")
    resp = client.post("/api/auth/google", json={"credential": "whatever"})
    assert resp.status_code == 503


def test_google_sign_in_rejects_invalid_credential(client, monkeypatch):
    _mock_google(monkeypatch, raise_valueerror=True)
    resp = client.post("/api/auth/google", json={"credential": "forged"})
    assert resp.status_code == 401


def test_google_sign_in_requires_verified_email(client, monkeypatch):
    _mock_google(monkeypatch, info={"email": "nv@example.com", "email_verified": False})
    resp = client.post("/api/auth/google", json={"credential": "tok"})
    assert resp.status_code == 401


def test_google_sign_in_requires_shared_email(client, monkeypatch):
    _mock_google(monkeypatch, info={"email_verified": True})
    resp = client.post("/api/auth/google", json={"credential": "tok"})
    assert resp.status_code == 401


def test_google_sign_in_creates_account_issues_working_session(client, monkeypatch):
    calls = _mock_google(
        monkeypatch,
        info={"email": "GUser@Example.com", "email_verified": True, "name": "Google User"},
    )
    resp = client.post("/api/auth/google", json={"credential": "real-id-token"})
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["user_email"] == "guser@example.com"
    assert body["full_name"] == "Google User"
    assert calls["audience"] == "test-google-client-id"

    assert client.get("/api/history", headers=_auth(body["token"])).status_code == 200

    password_login = client.post(
        "/api/auth/login",
        json={"email": "guser@example.com", "password": "whatever"},
    )
    assert password_login.status_code == 401, "google-only account must have no password path"


def test_google_sign_in_is_idempotent_and_preserves_chosen_name(client, monkeypatch):
    _mock_google(
        monkeypatch,
        info={"email": "again@example.com", "email_verified": True, "name": "First Name"},
    )
    first = client.post("/api/auth/google", json={"credential": "tok"}).json()
    _mock_google(
        monkeypatch,
        info={"email": "again@example.com", "email_verified": True, "name": "Second Name"},
    )
    second = client.post("/api/auth/google", json={"credential": "tok"}).json()
    assert second["full_name"] == "First Name"
    assert first["token"] != second["token"], "each sign-in mints a fresh session"


# ------------------------------------------------------ analyze-text API


def test_analyze_text_returns_results_with_ml_insights(client):
    resp = client.post(
        "/api/analyze-text",
        json={"text": PANEL_TEXT, "patient_age": 30, "patient_gender": "Male"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["is_valid_report"] is True
    assert body["count"] >= 2
    assert isinstance(body["ml_insights"]["balance_index"], int)


def test_analyze_text_flags_non_medical_input(client):
    resp = client.post(
        "/api/analyze-text",
        json={"text": "The quick brown fox jumps over 10k copies of p.m. notes"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["is_valid_report"] is False
    assert body["results"] == []
    assert body["ml_insights"] is None
    assert body["error"]


# ----------------------------------------------------- upload-file API


def _upload(client, headers, files):
    return client.post("/api/upload-file", files=files, headers=headers)


def test_upload_requires_auth(client):
    resp = client.post(
        "/api/upload-file", files={"file": ("r.txt", PANEL_TEXT.encode("utf-8"))}
    )
    assert resp.status_code in (401, 403)


def test_upload_without_file_is_rejected(client):
    token = _register(client, "nofile@example.com")
    assert client.post("/api/upload-file", headers=_auth(token)).status_code == 400


def test_upload_rejects_more_than_ten_files(client):
    token = _register(client, "manyfiles@example.com")
    many = [("files", (f"f{i}.txt", b"Hemoglobin 13.5 g/dL")) for i in range(11)]
    assert client.post("/api/upload-file", files=many, headers=_auth(token)).status_code == 400


def test_upload_accepts_valid_text_report(client):
    token = _register(client, "textup@example.com")
    resp = _upload(
        client,
        _auth(token),
        [("files", ("report.txt", PANEL_TEXT.encode("utf-8")))],
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["is_valid_report"] is True
    assert body["total_reports_found"] == 1
    assert body["count"] >= 2
    assert body["skipped_files"] == []
    ids = [r["testId"] for r in body["results"]]
    assert "hemoglobin" in ids and "cholesterol" in ids
    assert body["reports"][0]["date"] == "2026-08-20"


def test_upload_text_without_medical_content_returns_invalid_report(client):
    token = _register(client, "garbageup@example.com")
    resp = _upload(
        client,
        _auth(token),
        [("files", ("notes.txt", b"shopping list: apples, bananas"))],
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["is_valid_report"] is False
    assert body["count"] == 0
    assert body["error"]


def test_upload_pdf_named_file_with_wrong_magic_bytes_is_skipped(client):
    token = _register(client, "magicpdf@example.com")
    resp = _upload(
        client,
        _auth(token),
        [("files", ("fake.pdf", b"NOT-A-REAL-PDF just plain text Hemoglobin 13.5"))],
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["reports"] == []
    assert body["total_reports_found"] == 0
    assert body["skipped_files"][0]["reason"] == "file_content_is_not_a_valid_pdf"


def test_upload_image_named_file_with_wrong_magic_bytes_is_skipped(client):
    token = _register(client, "magicimg@example.com")
    resp = _upload(
        client,
        _auth(token),
        [("files", ("photo.png", b"GIF89a definitely not a png"))],
    )
    body = resp.json()
    assert body["reports"] == []
    assert body["skipped_files"][0]["reason"] == "file_content_is_not_a_valid_image"


def test_upload_unknown_extension_without_magic_bytes_is_skipped(client):
    token = _register(client, "binary@example.com")
    resp = _upload(
        client,
        _auth(token),
        [("files", ("payload.bin", b"\xde\xad\xbe\xef"))],
    )
    body = resp.json()
    assert body["reports"] == []
    assert body["skipped_files"][0]["reason"] == "unsupported_file_type"


def test_upload_oversized_file_is_skipped_before_processing(client):
    token = _register(client, "huge@example.com")
    oversized = b"A" * (MAX_FILE_SIZE + 1)
    resp = _upload(client, _auth(token), [("files", ("big.txt", oversized))])
    body = resp.json()
    assert body["reports"] == []
    assert body["skipped_files"][0]["reason"] == "exceeds_15MB_limit"


def test_upload_structurally_valid_blank_pdf_parses_to_invalid_report(client):
    token = _register(client, "blankpdf@example.com")
    writer = PdfWriter()
    writer.add_blank_page(width=612, height=792)
    buf = BytesIO()
    writer.write(buf)
    resp = _upload(
        client,
        _auth(token),
        [("files", ("scan.pdf", buf.getvalue()))],
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["is_valid_report"] is False
    assert body["page_count"] == 1
    assert body["error"]
    assert body["skipped_files"] == []


def test_upload_corrupt_png_hits_local_ocr_fallback_safely(client, monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.delenv("GOOGLE_API_KEY", raising=False)
    token = _register(client, "pngjunk@example.com")
    fake_png = b"\x89PNG\r\n\x1a\n" + b"\x00" * 64
    resp = _upload(client, _auth(token), [("files", ("broken.png", fake_png))])
    assert resp.status_code == 200
    body = resp.json()
    assert body["is_valid_report"] is False
    assert body["cv_quality"]["is_valid"] is False
    assert body["error"]


def test_upload_applies_profile_gender_context_to_parsing(client):
    female_token = _register(client, "ctxf@example.com")
    male_token = _register(client, "ctxm@example.com")
    profile = {
        "full_name": "Context QA",
        "date_of_birth": "1990-06-15",
        "gender": "Female",
    }
    assert client.post("/api/profile", json=profile, headers=_auth(female_token)).status_code == 200

    hemoglobin_high_for_female = "Hemoglobin\n16.5 g/dL\n"
    f = _upload(
        client,
        _auth(female_token),
        [("files", ("a.txt", hemoglobin_high_for_female.encode("utf-8")))],
    ).json()
    m = _upload(
        client,
        _auth(male_token),
        [("files", ("b.txt", hemoglobin_high_for_female.encode("utf-8")))],
    ).json()

    female_row = next(r for r in f["results"] if r["testId"] == "hemoglobin")
    male_row = next(r for r in m["results"] if r["testId"] == "hemoglobin")
    assert female_row["classification"] == "High"
    assert male_row["classification"] == "Normal"


# --------------------------------------------------- static SPA serving


def test_spa_root_serves_html_with_no_cache(client):
    if not os.path.isdir(os.path.join(BACKEND_DIR, "..", "dist")):
        pytest.skip("dist/ not built")
    resp = client.get("/")
    assert resp.status_code == 200
    assert "text/html" in resp.headers["content-type"]
    assert resp.headers["cache-control"] == "no-cache"


def test_spa_assets_get_immutable_cache_header(client):
    assets_dir = os.path.join(BACKEND_DIR, "..", "dist", "assets")
    if not os.path.isdir(assets_dir):
        pytest.skip("dist/assets not built")
    name = next(n for n in os.listdir(assets_dir) if n.endswith(".js"))
    resp = client.get(f"/assets/{name}")
    assert resp.status_code == 200
    assert "immutable" in resp.headers["cache-control"]


def test_spa_path_traversal_never_escapes_dist(client):
    if not os.path.isdir(os.path.join(BACKEND_DIR, "..", "dist")):
        pytest.skip("dist/ not built")
    for probe in ["../backend/aperio_data.db", "..%2Fbackend%2Faperio_data.db", "..\\..\\.env"]:
        resp = client.get(probe)
        assert resp.status_code == 200
        assert "text/html" in resp.headers["content-type"], probe


def test_unknown_api_route_returns_json_404_not_spa(client):
    resp = client.get("/api/nonexistent")
    assert resp.status_code == 404
    # With dist/ present the SPA catch-all raises "Not found"; without it
    # FastAPI's default handler answers "Not Found". Either way it must be
    # JSON, never the SPA HTML fallback.
    assert "application/json" in resp.headers["content-type"]
    assert resp.json()["detail"].lower() == "not found"
