import os
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db, SavedReportModel, JournalEntryModel, UserProfileModel
from ocr import extract_text_from_pdf_bytes, extract_pages_from_pdf_bytes, extract_specimen_date, extract_text_from_image_bytes, parse_report_text_python
from cv_engine import analyze_image_quality, preprocess_document_cv
from ml_engine import ml_engine

app = FastAPI(
    title="Aperio Health — Clinical Intelligence Suite",
    description="Python FastAPI + Computer Vision + Scikit-Learn ML Backend for Lab Report Simplification",
    version="2.1.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextParseRequest(BaseModel):
    text: str
    label: Optional[str] = "Pasted Report"

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

class SaveReportRequest(BaseModel):
    user_email: str
    id: str
    date: str
    label: str
    results: List[TestResultSchema]

class JournalEntrySchema(BaseModel):
    id: Optional[str] = None
    user_email: str
    entry_type: str  # 'medication' | 'supplement' | 'lifestyle'
    name: str
    dosage: Optional[str] = None
    start_date: Optional[str] = None
    notes: Optional[str] = None

class UserProfileSchema(BaseModel):
    user_email: str
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
        "features": [
            "Computer Vision Preprocessing",
            "Multi-Page PDF Processing",
            "Scikit-Learn ML Anomaly Scoring",
            "Health Journal & Granular History",
            "FastAPI Static SPA Server"
        ]
    }

@app.post("/api/analyze-text")
def analyze_text(payload: TextParseRequest):
    results = parse_report_text_python(payload.text)
    is_valid = len(results) > 0
    ml_insights = ml_engine.analyze_report_ml(results) if is_valid else None
    
    return {
        "label": payload.label,
        "is_valid_report": is_valid,
        "results": results,
        "count": len(results),
        "ml_insights": ml_insights,
        "error": None if is_valid else "No supported blood test parameters or reference ranges were detected in this text."
    }

@app.post("/api/upload-file")
async def upload_file(
    file: Optional[UploadFile] = File(None),
    files: Optional[List[UploadFile]] = File(None)
):
    upload_list: List[UploadFile] = []
    if files:
        upload_list.extend(files)
    if file:
        if file not in upload_list:
            upload_list.append(file)

    if not upload_list:
        raise HTTPException(status_code=400, detail="No file provided.")

    parsed_reports: List[Dict[str, Any]] = []

    for upload in upload_list:
        contents = await upload.read()
        if len(contents) > 15 * 1024 * 1024:
            continue

        filename = upload.filename or "uploaded_report"
        is_pdf = filename.lower().endswith(".pdf")
        is_image = any(filename.lower().endswith(ext) for ext in [".png", ".jpg", ".jpeg", ".bmp", ".webp"])

        note = ""
        cv_quality = None

        if is_image:
            cv_quality = analyze_image_quality(contents)
            _, cv_meta = preprocess_document_cv(contents)
            if cv_meta.get("deskew_angle"):
                note = f"Computer Vision: Deskewed document by {cv_meta['deskew_angle']}°."

        if is_pdf:
            pages, pdf_note, page_count = extract_pages_from_pdf_bytes(contents)
            if pdf_note:
                note = f"{note} {pdf_note}".strip()

            # Group pages by specimen_date if distinct specimen dates exist
            date_groups: Dict[str, List[Dict[str, Any]]] = {}
            for p in pages:
                d = p.get("specimen_date") or "default"
                if d not in date_groups:
                    date_groups[d] = []
                date_groups[d].append(p)

            # Filter date_groups that contain valid test parameters
            valid_group_reports = []
            for date_key, group_pages in date_groups.items():
                group_text = "\n\n".join([f"--- [Page {p['page_num']}] ---\n{p['text']}" for p in group_pages])
                group_results = parse_report_text_python(group_text)
                if len(group_results) > 0:
                    spec_date = date_key if date_key != "default" else extract_specimen_date(group_text)
                    valid_group_reports.append((spec_date, group_pages, group_text, group_results))

            if len(valid_group_reports) > 1:
                # Multiple distinct specimen dates found in multi-page PDF
                for spec_date, group_pages, group_text, group_results in valid_group_reports:
                    ml_insights = ml_engine.analyze_report_ml(group_results)
                    report_label = f"Uploaded: {filename}" + (f" ({spec_date})" if spec_date else f" (Pages {[p['page_num'] for p in group_pages]})")
                    parsed_reports.append({
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
                        "error": None
                    })
            else:
                # Single report for the entire PDF
                full_text = "\n\n".join([f"--- [Page {p['page_num']}] ---\n{p['text']}" for p in pages]) if pages else ""
                results = parse_report_text_python(full_text) if full_text else []
                is_valid = len(results) > 0
                spec_date = extract_specimen_date(full_text)
                ml_insights = ml_engine.analyze_report_ml(results) if is_valid else None

                parsed_reports.append({
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
                    "error": None if is_valid else "Incorrect document uploaded. No supported blood test parameters or reference ranges were detected in this document."
                })

        elif is_image:
            extracted_text, img_note, img_meta = extract_text_from_image_bytes(contents, filename=filename)
            if img_note:
                note = f"{note} {img_note}".strip()

            results = parse_report_text_python(extracted_text) if extracted_text else []
            is_valid = len(results) > 0
            spec_date = extract_specimen_date(extracted_text) if extracted_text else None
            ml_insights = ml_engine.analyze_report_ml(results) if is_valid else None

            err_msg = None
            if not is_valid:
                if cv_quality and not cv_quality.get("quality_passed", True):
                    err_msg = "Incorrect or poor quality image uploaded. The image appears blurry or low-contrast. Please take a clear photo in bright lighting."
                else:
                    err_msg = "Incorrect image uploaded. No supported blood test parameters or reference ranges were detected in this image. Please upload a valid laboratory blood test report."

            parsed_reports.append({
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
                "error": err_msg
            })

        else:
            # Plain text file (.txt)
            try:
                extracted_text = contents.decode("utf-8")
            except Exception:
                try:
                    extracted_text = contents.decode("latin-1", errors="ignore")
                except Exception:
                    extracted_text = ""

            results = parse_report_text_python(extracted_text) if extracted_text else []
            is_valid = len(results) > 0
            spec_date = extract_specimen_date(extracted_text) if extracted_text else None
            ml_insights = ml_engine.analyze_report_ml(results) if is_valid else None

            parsed_reports.append({
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
                "error": None if is_valid else "Incorrect document uploaded. No supported blood test parameters or reference ranges were detected in this document."
            })

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
        "total_reports_found": len([r for r in parsed_reports if r.get("is_valid_report")])
    }

# History Endpoints
@app.get("/api/history/{user_email}")
def get_user_history(user_email: str, db: Session = Depends(get_db)):
    records = db.query(SavedReportModel).filter(SavedReportModel.user_email == user_email.lower()).all()
    output = []
    for rec in records:
        output.append({
            "id": rec.id,
            "date": rec.date,
            "label": rec.label,
            "results": json.loads(rec.results_json)
        })
    output.sort(key=lambda x: x["date"], reverse=True)
    return output

@app.post("/api/history")
def save_user_report(payload: SaveReportRequest, db: Session = Depends(get_db)):
    db_report = SavedReportModel(
        id=payload.id,
        user_email=payload.user_email.lower(),
        date=payload.date,
        label=payload.label,
        results_json=json.dumps([r.model_dump() for r in payload.results])
    )
    db.merge(db_report)
    db.commit()
    return {"status": "saved", "id": payload.id}

@app.delete("/api/history/{user_email}/report/{report_id}")
def delete_single_report(user_email: str, report_id: str, db: Session = Depends(get_db)):
    db.query(SavedReportModel).filter(
        SavedReportModel.user_email == user_email.lower(),
        SavedReportModel.id == report_id
    ).delete()
    db.commit()
    return {"status": "deleted", "report_id": report_id}

@app.delete("/api/history/{user_email}/result/{report_id}/{test_id}")
def delete_single_test_result(user_email: str, report_id: str, test_id: str, db: Session = Depends(get_db)):
    rec = db.query(SavedReportModel).filter(
        SavedReportModel.user_email == user_email.lower(),
        SavedReportModel.id == report_id
    ).first()
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

@app.delete("/api/history/{user_email}")
def clear_user_history(user_email: str, db: Session = Depends(get_db)):
    db.query(SavedReportModel).filter(SavedReportModel.user_email == user_email.lower()).delete()
    db.commit()
    return {"status": "cleared", "user_email": user_email}

# Health Journal Endpoints
@app.get("/api/journal/{user_email}")
def get_journal_entries(user_email: str, db: Session = Depends(get_db)):
    entries = db.query(JournalEntryModel).filter(JournalEntryModel.user_email == user_email.lower()).all()
    output = []
    for e in entries:
        output.append({
            "id": e.id,
            "user_email": e.user_email,
            "entry_type": e.entry_type,
            "name": e.name,
            "dosage": e.dosage,
            "start_date": e.start_date,
            "notes": e.notes,
            "created_at": e.created_at.isoformat() if e.created_at else None
        })
    output.sort(key=lambda x: x.get("start_date") or "", reverse=True)
    return output

@app.post("/api/journal")
def create_or_update_journal_entry(payload: JournalEntrySchema, db: Session = Depends(get_db)):
    entry_id = payload.id or f"jrn-{uuid.uuid4().hex[:8]}"
    db_entry = JournalEntryModel(
        id=entry_id,
        user_email=payload.user_email.lower(),
        entry_type=payload.entry_type,
        name=payload.name,
        dosage=payload.dosage,
        start_date=payload.start_date,
        notes=payload.notes
    )
    db.merge(db_entry)
    db.commit()
    return {"status": "saved", "id": entry_id}

@app.delete("/api/journal/{entry_id}")
def delete_journal_entry(entry_id: str, db: Session = Depends(get_db)):
    db.query(JournalEntryModel).filter(JournalEntryModel.id == entry_id).delete()
    db.commit()
    return {"status": "deleted", "id": entry_id}

# User Profile Endpoints
@app.get("/api/profile/{user_email}")
def get_user_profile(user_email: str, db: Session = Depends(get_db)):
    profile = db.query(UserProfileModel).filter(UserProfileModel.user_email == user_email.lower()).first()
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
        "onboarding_completed": bool(profile.onboarding_completed)
    }

@app.post("/api/profile")
def save_user_profile(payload: UserProfileSchema, db: Session = Depends(get_db)):
    db_profile = UserProfileModel(
        user_email=payload.user_email.lower(),
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
        onboarding_completed=1 if payload.onboarding_completed else 0
    )
    db.merge(db_profile)
    db.commit()
    return {"status": "saved", "user_email": payload.user_email.lower()}

@app.delete("/api/profile/delete/{user_email}")
def delete_user_account_vault(user_email: str, db: Session = Depends(get_db)):
    email = user_email.lower()
    db.query(SavedReportModel).filter(SavedReportModel.user_email == email).delete()
    db.query(JournalEntryModel).filter(JournalEntryModel.user_email == email).delete()
    db.query(UserProfileModel).filter(UserProfileModel.user_email == email).delete()
    db.commit()
    return {"status": "deleted", "user_email": email}

# Serve compiled Single Page Application (React) from dist folder if built
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST_DIR = os.path.join(BASE_DIR, "dist")

if os.path.exists(DIST_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST_DIR, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(request: Request, full_path: str):
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API endpoint not found")

        file_path = os.path.join(DIST_DIR, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(DIST_DIR, "index.html"))
