import os
import json
import uuid
from contextlib import asynccontextmanager
from datetime import datetime
from pathlib import Path
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import (
    get_db,
    SessionLocal,
    UserModel,
    SessionModel,
    SavedReportModel,
    JournalEntryModel,
    UserProfileModel,
)
from ocr import (
    extract_pages_from_pdf_bytes,
    extract_specimen_date,
    extract_text_from_image_bytes,
    parse_report_text_python,
)
from cv_engine import analyze_image_quality, preprocess_document_cv
from ml_engine import get_ml_engine
from auth import router as auth_router, get_current_user
from seed import seed_demo_accounts
from population import age_from_dob

MAX_FILE_SIZE = 15 * 1024 * 1024
MAX_FILES_PER_UPLOAD = 10

MAGIC_SIGNATURES = [
    (b"%PDF-", "pdf"),
    (b"\x89PNG\r\n\x1a\n", "png"),
    (b"\xff\xd8\xff", "jpeg"),
    (b"BM", "bmp"),
]

IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".bmp", ".webp"}
TEXT_EXTENSIONS = {".txt", ".text", ".csv", ".md"}


def _detect_file_kind(contents: bytes, filename: str) -> Optional[str]:
    for signature, kind in MAGIC_SIGNATURES:
        if contents.startswith(signature):
            return kind
    if len(contents) > 11 and contents[:4] == b"RIFF" and contents[8:12] == b"WEBP":
        return "webp"
    ext = Path(filename or "").suffix.lower()
    if ext == ".pdf":
        return "pdf_mismatch"
    if ext in IMAGE_EXTENSIONS:
        return "image_mismatch"
    if ext in TEXT_EXTENSIONS:
        return "text"
    return None


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()
    try:
        seed_demo_accounts(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Aperio Health — Clinical Intelligence Suite",
    description="FastAPI + Computer Vision + Scikit-Learn ML Backend for Lab Report Simplification",
    version="3.0.0",
    lifespan=lifespan,
)

_origins_env = os.environ.get(
    "ALLOWED_ORIGIN",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _origins_env.split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(auth_router)


class TextParseRequest(BaseModel):
    text: str
    label: Optional[str] = "Pasted Report"
    patient_age: Optional[int] = None
    patient_gender: Optional[str] = None


class TestResultSchema(BaseModel):
    testId: str
    name: str
    category: str
    measuredValue: float
    unit: str
    referenceMin: float
    referenceMax: float
    classification: str
    urgency: str
    explanation: str
    isAutoCorrected: Optional[bool] = False
    originalValue: Optional[float] = None
    rangeOverridden: Optional[bool] = False
    rangeSource: Optional[str] = None


class SaveReportRequest(BaseModel):
    id: str
    date: str
    label: str
    results: List[TestResultSchema]


class JournalEntrySchema(BaseModel):
    id: Optional[str] = None
    entry_type: str
    name: str
    dosage: Optional[str] = None
    start_date: Optional[str] = None
    notes: Optional[str] = None


class UserProfileSchema(BaseModel):
    full_name: str
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    blood_type: Optional[str] = None
    language: Optional[str] = "en"
    measurement_units: Optional[str] = "Conventional"
    timezone: Optional[str] = "UTC"
    phone_number: Optional[str] = None
    chronic_conditions: Optional[List[str]] = []
    other_chronic_conditions: Optional[str] = None
    medications: Optional[str] = None
    allergies: Optional[str] = None
    primary_doctor_name: Optional[str] = None
    primary_doctor_contact: Optional[str] = None
    last_login: Optional[str] = None
    onboarding_completed: Optional[bool] = True


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "Aperio Health Backend",
        "authenticated": True,
        "features": [
            "Token Authentication (bcrypt)",
            "Computer Vision Preprocessing",
            "Multi-Page PDF Processing",
            "Scikit-Learn ML Anomaly Scoring",
            "Health Journal & Granular History",
            "FastAPI Static SPA Server",
        ],
    }


@app.post("/api/analyze-text")
def analyze_text(payload: TextParseRequest):
    patient_context = {}
    if payload.patient_age is not None:
        patient_context["age"] = payload.patient_age
    if payload.patient_gender:
        patient_context["gender"] = payload.patient_gender

    results = parse_report_text_python(payload.text, patient_context=patient_context)
    is_valid = len(results) > 0
    ml_insights = get_ml_engine().analyze_report_ml(results, patient_context) if is_valid else None

    return {
        "label": payload.label,
        "is_valid_report": is_valid,
        "results": results,
        "count": len(results),
        "ml_insights": ml_insights,
        "error": None
        if is_valid
        else "No supported blood test parameters or reference ranges were detected in this text.",
    }


@app.post("/api/upload-file")
async def upload_file(
    file: Optional[UploadFile] = File(None),
    files: Optional[List[UploadFile]] = File(None),
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    patient_context: Dict[str, Any] = {}
    profile_row = (
        db.query(UserProfileModel)
        .filter(UserProfileModel.user_email == current_user)
        .first()
    )
    if profile_row:
        if profile_row.date_of_birth:
            age = age_from_dob(profile_row.date_of_birth)
            if age is not None:
                patient_context["age"] = age
        if profile_row.gender:
            patient_context["gender"] = profile_row.gender

    upload_list: List[UploadFile] = []
    if files:
        upload_list.extend(files)
    if file:
        upload_list.append(file)

    if not upload_list:
        raise HTTPException(status_code=400, detail="No file provided.")
    if len(upload_list) > MAX_FILES_PER_UPLOAD:
        raise HTTPException(
            status_code=400,
            detail=f"Too many files. Maximum {MAX_FILES_PER_UPLOAD} files per upload.",
        )

    parsed_reports: List[Dict[str, Any]] = []
    skipped_files: List[Dict[str, str]] = []

    for upload in upload_list:
        filename = upload.filename or "uploaded_report"
        contents = await upload.read(MAX_FILE_SIZE + 1)

        if len(contents) > MAX_FILE_SIZE:
            skipped_files.append({"filename": filename, "reason": "exceeds_15MB_limit"})
            continue

        kind = _detect_file_kind(contents, filename)
        if kind in ("pdf_mismatch", "image_mismatch"):
            skipped_files.append(
                {"filename": filename, "reason": f"file_content_is_not_a_valid_{kind.split('_')[0]}"}
            )
            continue
        if kind is None:
            skipped_files.append({"filename": filename, "reason": "unsupported_file_type"})
            continue

        note = ""
        cv_quality = None

        if kind in ("png", "jpeg", "webp", "bmp"):
            cv_quality = analyze_image_quality(contents)
            _, cv_meta = preprocess_document_cv(contents)
            if cv_meta.get("deskew_angle"):
                note = f"Computer Vision: Deskewed document by {cv_meta['deskew_angle']}°."

        if kind == "pdf":
            pages, pdf_note, page_count = extract_pages_from_pdf_bytes(contents)
            if pdf_note:
                note = f"{note} {pdf_note}".strip()

            date_groups: Dict[str, List[Dict[str, Any]]] = {}
            for p in pages:
                d = p.get("specimen_date") or "default"
                date_groups.setdefault(d, []).append(p)

            valid_group_reports = []
            for date_key, group_pages in date_groups.items():
                group_text = "\n\n".join(
                    [f"--- [Page {p['page_num']}] ---\n{p['text']}" for p in group_pages]
                )
                group_results = parse_report_text_python(group_text, patient_context=patient_context)
                if len(group_results) > 0:
                    spec_date = (
                        date_key if date_key != "default" else extract_specimen_date(group_text)
                    )
                    valid_group_reports.append((spec_date, group_pages, group_text, group_results))

            if len(valid_group_reports) > 1:
                for spec_date, group_pages, group_text, group_results in valid_group_reports:
                    ml_insights = get_ml_engine().analyze_report_ml(group_results, patient_context)
                    page_nums = [p["page_num"] for p in group_pages]
                    report_label = f"Uploaded: {filename}" + (
                        f" ({spec_date})" if spec_date else f" (Pages {page_nums})"
                    )
                    parsed_reports.append(
                        {
                            "id": f"rep-{uuid.uuid4().hex[:8]}",
                            "filename": filename,
                            "date": spec_date or datetime.now().strftime("%Y-%m-%d"),
                            "label": report_label,
                            "extractedText": group_text,
                            "note": f"Multi-Page Split: {len(group_pages)} page(s). {note}".strip(),
                            "page_count": len(group_pages),
                            "is_valid_report": True,
                            "results": group_results,
                            "count": len(group_results),
                            "cv_quality": None,
                            "ml_insights": ml_insights,
                            "error": None,
                        }
                    )
            else:
                full_text = (
                    "\n\n".join([f"--- [Page {p['page_num']}] ---\n{p['text']}" for p in pages])
                    if pages
                    else ""
                )
                results = parse_report_text_python(full_text, patient_context=patient_context) if full_text else []
                is_valid = len(results) > 0
                spec_date = extract_specimen_date(full_text)
                ml_insights = get_ml_engine().analyze_report_ml(results, patient_context) if is_valid else None

                parsed_reports.append(
                    {
                        "id": f"rep-{uuid.uuid4().hex[:8]}",
                        "filename": filename,
                        "date": spec_date or datetime.now().strftime("%Y-%m-%d"),
                        "label": f"Uploaded: {filename}",
                        "extractedText": full_text,
                        "note": note,
                        "page_count": page_count,
                        "is_valid_report": is_valid,
                        "results": results,
                        "count": len(results),
                        "cv_quality": None,
                        "ml_insights": ml_insights,
                        "error": None
                        if is_valid
                        else "Incorrect document uploaded. No supported blood test parameters or reference ranges were detected in this document.",
                    }
                )

        elif kind in ("png", "jpeg", "webp", "bmp"):
            extracted_text, img_note, img_meta = extract_text_from_image_bytes(
                contents, filename=filename
            )
            if img_note:
                note = f"{note} {img_note}".strip()

            results = parse_report_text_python(extracted_text, patient_context=patient_context) if extracted_text else []
            is_valid = len(results) > 0
            spec_date = extract_specimen_date(extracted_text) if extracted_text else None
            ml_insights = get_ml_engine().analyze_report_ml(results, patient_context) if is_valid else None

            err_msg = None
            if not is_valid:
                if cv_quality and not cv_quality.get("quality_passed", True):
                    err_msg = "Incorrect or poor quality image uploaded. The image appears blurry or low-contrast. Please take a clear photo in bright lighting."
                else:
                    err_msg = "Incorrect image uploaded. No supported blood test parameters or reference ranges were detected in this image. Please upload a valid laboratory blood test report."

            parsed_reports.append(
                {
                    "id": f"rep-{uuid.uuid4().hex[:8]}",
                    "filename": filename,
                    "date": spec_date or datetime.now().strftime("%Y-%m-%d"),
                    "label": f"Uploaded: {filename}",
                    "extractedText": extracted_text,
                    "note": note,
                    "page_count": 1,
                    "is_valid_report": is_valid,
                    "results": results,
                    "count": len(results),
                    "cv_quality": cv_quality,
                    "ml_insights": ml_insights,
                    "error": err_msg,
                }
            )

        else:
            try:
                extracted_text = contents.decode("utf-8")
            except Exception:
                try:
                    extracted_text = contents.decode("latin-1", errors="ignore")
                except Exception:
                    extracted_text = ""

            results = parse_report_text_python(extracted_text, patient_context=patient_context) if extracted_text else []
            is_valid = len(results) > 0
            spec_date = extract_specimen_date(extracted_text) if extracted_text else None
            ml_insights = get_ml_engine().analyze_report_ml(results, patient_context) if is_valid else None

            parsed_reports.append(
                {
                    "id": f"rep-{uuid.uuid4().hex[:8]}",
                    "filename": filename,
                    "date": spec_date or datetime.now().strftime("%Y-%m-%d"),
                    "label": f"Uploaded: {filename}",
                    "extractedText": extracted_text,
                    "note": "Text file processed.",
                    "page_count": 1,
                    "is_valid_report": is_valid,
                    "results": results,
                    "count": len(results),
                    "cv_quality": None,
                    "ml_insights": ml_insights,
                    "error": None
                    if is_valid
                    else "Incorrect document uploaded. No supported blood test parameters or reference ranges were detected in this document.",
                }
            )

    primary_report = parsed_reports[0] if parsed_reports else {}

    return {
        "filename": primary_report.get("filename", ""),
        "extractedText": primary_report.get("extractedText", ""),
        "note": primary_report.get("note", ""),
        "page_count": primary_report.get("page_count", 1),
        "is_valid_report": primary_report.get("is_valid_report", False),
        "results": primary_report.get("results", []),
        "count": primary_report.get("count", 0),
        "cv_quality": primary_report.get("cv_quality"),
        "ml_insights": primary_report.get("ml_insights"),
        "error": primary_report.get("error"),
        "reports": parsed_reports,
        "total_reports_found": len([r for r in parsed_reports if r.get("is_valid_report")]),
        "skipped_files": skipped_files,
    }


class BulkHistoryRequest(BaseModel):
    reports: List[SaveReportRequest]


@app.get("/api/history")
def get_user_history(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    records = (
        db.query(SavedReportModel)
        .filter(SavedReportModel.user_email == current_user)
        .all()
    )
    output = []
    for rec in records:
        output.append(
            {
                "id": rec.id,
                "date": rec.date,
                "label": rec.label,
                "results": json.loads(rec.results_json),
            }
        )
    output.sort(key=lambda x: x["date"], reverse=True)
    return output


@app.post("/api/history")
def save_user_report(
    payload: SaveReportRequest,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_report = SavedReportModel(
        id=payload.id,
        user_email=current_user,
        date=payload.date,
        label=payload.label,
        results_json=json.dumps([r.model_dump() for r in payload.results]),
    )
    db.merge(db_report)
    db.commit()
    return {"status": "saved", "id": payload.id}


@app.post("/api/history/bulk")
def save_reports_bulk(
    payload: BulkHistoryRequest,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    saved_ids = []
    for report in payload.reports[:50]:
        db_report = SavedReportModel(
            id=report.id,
            user_email=current_user,
            date=report.date,
            label=report.label,
            results_json=json.dumps([r.model_dump() for r in report.results]),
        )
        db.merge(db_report)
        saved_ids.append(report.id)
    db.commit()
    return {"status": "saved", "count": len(saved_ids), "ids": saved_ids}


@app.delete("/api/history/report/{report_id}")
def delete_single_report(
    report_id: str,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    deleted = (
        db.query(SavedReportModel)
        .filter(SavedReportModel.user_email == current_user, SavedReportModel.id == report_id)
        .delete()
    )
    db.commit()
    if not deleted:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"status": "deleted", "report_id": report_id}


@app.delete("/api/history/result/{report_id}/{test_id}")
def delete_single_test_result(
    report_id: str,
    test_id: str,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rec = (
        db.query(SavedReportModel)
        .filter(SavedReportModel.user_email == current_user, SavedReportModel.id == report_id)
        .first()
    )
    if not rec:
        raise HTTPException(status_code=404, detail="Report not found")

    results = json.loads(rec.results_json)
    filtered = [r for r in results if r.get("testId") != test_id]
    if len(filtered) == 0:
        db.delete(rec)
    else:
        rec.results_json = json.dumps(filtered)
    db.commit()
    return {"status": "updated", "report_id": report_id, "remaining_count": len(filtered)}


@app.delete("/api/history")
def clear_user_history(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.query(SavedReportModel).filter(SavedReportModel.user_email == current_user).delete()
    db.commit()
    return {"status": "cleared", "user_email": current_user}


@app.get("/api/journal")
def get_journal_entries(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entries = (
        db.query(JournalEntryModel)
        .filter(JournalEntryModel.user_email == current_user)
        .all()
    )
    output = []
    for e in entries:
        output.append(
            {
                "id": e.id,
                "user_email": e.user_email,
                "entry_type": e.entry_type,
                "name": e.name,
                "dosage": e.dosage,
                "start_date": e.start_date,
                "notes": e.notes,
                "created_at": e.created_at.isoformat() if e.created_at else None,
            }
        )
    output.sort(key=lambda x: x.get("start_date") or "", reverse=True)
    return output


@app.post("/api/journal")
def create_or_update_journal_entry(
    payload: JournalEntrySchema,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entry_id = payload.id or f"jrn-{uuid.uuid4().hex[:8]}"
    db_entry = JournalEntryModel(
        id=entry_id,
        user_email=current_user,
        entry_type=payload.entry_type,
        name=payload.name,
        dosage=payload.dosage,
        start_date=payload.start_date,
        notes=payload.notes,
    )
    db.merge(db_entry)
    db.commit()
    return {"status": "saved", "id": entry_id}


@app.delete("/api/journal/{entry_id}")
def delete_journal_entry(
    entry_id: str,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    deleted = (
        db.query(JournalEntryModel)
        .filter(JournalEntryModel.id == entry_id, JournalEntryModel.user_email == current_user)
        .delete()
    )
    db.commit()
    if not deleted:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    return {"status": "deleted", "id": entry_id}


@app.get("/api/profile")
def get_user_profile(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = (
        db.query(UserProfileModel)
        .filter(UserProfileModel.user_email == current_user)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {
        "user_email": profile.user_email,
        "full_name": profile.full_name,
        "date_of_birth": profile.date_of_birth,
        "gender": profile.gender,
        "blood_type": profile.blood_type,
        "language": profile.language,
        "measurement_units": profile.measurement_units,
        "timezone": profile.timezone,
        "phone_number": profile.phone_number,
        "chronic_conditions": json.loads(profile.chronic_conditions_json or "[]"),
        "other_chronic_conditions": profile.other_chronic_conditions,
        "medications": profile.medications,
        "allergies": profile.allergies,
        "primary_doctor_name": profile.primary_doctor_name,
        "primary_doctor_contact": profile.primary_doctor_contact,
        "last_login": profile.last_login,
        "onboarding_completed": bool(profile.onboarding_completed),
    }


@app.post("/api/profile")
def save_user_profile(
    payload: UserProfileSchema,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_profile = UserProfileModel(
        user_email=current_user,
        full_name=payload.full_name,
        date_of_birth=payload.date_of_birth,
        gender=payload.gender,
        blood_type=payload.blood_type,
        language=payload.language or "en",
        measurement_units=payload.measurement_units or "Conventional",
        timezone=payload.timezone or "UTC",
        phone_number=payload.phone_number,
        chronic_conditions_json=json.dumps(payload.chronic_conditions or []),
        other_chronic_conditions=payload.other_chronic_conditions,
        medications=payload.medications,
        allergies=payload.allergies,
        primary_doctor_name=payload.primary_doctor_name,
        primary_doctor_contact=payload.primary_doctor_contact,
        last_login=payload.last_login,
        onboarding_completed=1 if payload.onboarding_completed else 0,
    )
    db.merge(db_profile)
    db.commit()
    return {"status": "saved", "user_email": current_user}


@app.delete("/api/profile/delete")
def delete_user_account_vault(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.query(SavedReportModel).filter(SavedReportModel.user_email == current_user).delete()
    db.query(JournalEntryModel).filter(JournalEntryModel.user_email == current_user).delete()
    db.query(UserProfileModel).filter(UserProfileModel.user_email == current_user).delete()
    db.query(SessionModel).filter(SessionModel.user_email == current_user).delete()
    user = db.query(UserModel).filter(UserModel.email == current_user).first()
    if user:
        db.delete(user)
    db.commit()
    return {"status": "deleted", "user_email": current_user}


BASE_DIR = Path(__file__).resolve().parent.parent
DIST_DIR = BASE_DIR / "dist"

if DIST_DIR.exists():
    assets_dir = DIST_DIR / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="Not found")

        dist_real = os.path.realpath(str(DIST_DIR))
        candidate = os.path.realpath(os.path.join(dist_real, full_path)) if full_path else ""
        if full_path and candidate.startswith(dist_real + os.sep) and os.path.isfile(candidate):
            return FileResponse(candidate)
        return FileResponse(os.path.join(dist_real, "index.html"))
