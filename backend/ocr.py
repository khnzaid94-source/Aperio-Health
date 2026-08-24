import os
import re
import io
from typing import List, Dict, Any, Tuple, Optional
from pypdf import PdfReader
import cv2
import numpy as np
from PIL import Image
import pytesseract

from catalog import CATALOG, get_catalog_entry, CatalogEntry

TEST_SYNONYMS: Dict[str, List[str]] = {
    # Complete Blood Count
    "hemoglobin": ["hemoglobin", "haemoglobin", "hb", "hgb", "total hemoglobin"],
    "wbc": ["total leukocyte count", "total leucocyte count", "white blood cell count", "white blood cell", "wbc", "tlc", "leukocyte count", "leukocytes"],
    "platelets": ["platelet count", "platelets", "plt", "platelet", "total platelet count"],
    "rbc": ["total rbc count", "red blood cell count", "red blood cell", "rbc", "erythrocyte count", "erythrocytes", "red blood cells"],
    "hematocrit": ["hematocrit value, hct", "hematocrit", "hct", "pcv", "packed cell volume"],
    "mcv": ["mean corpuscular volume", "mcv"],
    "mch": ["mean corpuscular hemoglobin", "mch"],
    "mchc": ["mean corpuscular hemoglobin concentration", "mchc"],
    "rdw": ["red cell distribution width", "rdw", "rdw-cv", "rdw-sd"],
    "neutrophils": ["neutrophils", "neutrophil percentage", "absolute neutrophil count", "anc", "neutrophil"],

    # Lipid Profile
    "cholesterol": ["total cholesterol", "serum cholesterol", "cholesterol", "tc"],
    "ldl": ["ldl cholesterol", "serum ldl", "ldl-c", "ldl"],
    "hdl": ["hdl cholesterol", "serum hdl", "hdl-c", "hdl"],
    "triglycerides": ["serum triglycerides", "triglycerides", "tg", "trig"],
    "vldl": ["vldl cholesterol", "serum vldl", "vldl-c", "vldl"],
    "non_hdl": ["non-hdl cholesterol", "non hdl cholesterol", "non-hdl"],
    "chol_hdl_ratio": ["total cholesterol / hdl ratio", "cholesterol/hdl ratio", "chol/hdl ratio", "tc/hdl"],

    # Thyroid Panel
    "tsh": ["thyroid stimulating hormone", "s.tsh", "serum tsh", "tsh"],
    "t3": ["triiodothyronine", "total t3", "t3"],
    "t4": ["thyroxine", "total t4", "t4"],
    "ft3": ["free triiodothyronine", "free t3", "ft3"],
    "ft4": ["free thyroxine", "free t4", "ft4"],
    "anti_tpo": ["anti-thyroid peroxidase", "anti-tpo", "tpo antibodies", "anti tpo"],

    # Liver Function
    "alt": ["sgpt (alt)", "alanine transaminase", "alanine aminotransferase", "alt", "sgpt", "s.g.p.t"],
    "ast": ["sgot (ast)", "aspartate transaminase", "aspartate aminotransferase", "ast", "sgot", "s.g.o.t"],
    "bilirubin": ["serum bilirubin (total)", "total bilirubin", "bilirubin (total)", "bilirubin", "tbil", "s.bilirubin"],
    "alp": ["serum alkaline phosphatase", "alkaline phosphatase", "alp", "alk phos", "s.alkaline phosphatase"],
    "direct_bilirubin": ["direct bilirubin", "conjugated bilirubin", "dbil"],
    "ggt": ["gamma-glutamyl transferase", "gamma gt", "ggt", "ggtp"],
    "total_protein": ["total serum protein", "total protein", "s.protein"],
    "albumin": ["serum albumin", "albumin", "alb"],

    # Kidney Function
    "creatinine": ["serum creatinine", "creatinine", "cre", "creat", "s.creatinine"],
    "bun": ["blood urea nitrogen", "bun", "serum urea", "blood urea", "urea", "s.urea"],
    "uricacid": ["serum uric acid", "uric acid", "ua", "s.uric acid"],
    "egfr": ["estimated gfr", "estimated glomerular filtration rate", "egfr", "gfr"],

    # Blood Sugar
    "hba1c": ["hba1c", "glycated hemoglobin", "glycohemoglobin", "a1c"],
    "fbs": ["fasting blood sugar", "fbs", "fasting glucose", "fpg", "fasting blood glucose"],
    "ppbs": ["postprandial blood sugar", "ppbs", "post prandial glucose", "post-prandial blood sugar", "ppg", "rbs", "random blood sugar"],
    "insulin": ["fasting insulin", "serum insulin", "insulin"],

    # Vitamins & Iron Studies
    "vitamind": ["vitamin d", "25-oh vitamin d", "vit d", "25-hydroxy vitamin d"],
    "vitaminb12": ["vitamin b12", "cobalamin", "vit b12", "b12"],
    "ferritin": ["serum ferritin", "ferritin", "fer", "s.ferritin"],
    "iron": ["serum iron", "total iron", "fe", "s.iron"],
    "tibc": ["total iron binding capacity", "tibc"],
    "transferrin_sat": ["transferrin saturation", "iron saturation", "transferrin sat", "% saturation"],
    "folate": ["serum folate", "folic acid", "folate", "vitamin b9"],

    # Electrolytes & Minerals
    "sodium": ["serum sodium", "sodium (na)", "sodium", "na+", "na"],
    "potassium": ["serum potassium", "potassium (k)", "potassium", "k+", "k"],
    "chloride": ["serum chloride", "chloride (cl)", "chloride", "cl-", "cl"],
    "calcium": ["serum calcium", "calcium (ca)", "calcium", "ca++", "ca"],
    "phosphorus": ["serum phosphorus", "phosphorus (p)", "phosphorus", "phosphate", "p"],
    "magnesium": ["serum magnesium", "magnesium (mg)", "magnesium", "mg++", "mg"],

    # Inflammatory & Cardiac
    "hscrp": ["high-sensitivity c-reactive protein", "hs-crp", "hscrp", "c-reactive protein", "crp"],
    "esr": ["erythrocyte sedimentation rate", "esr", "sed rate"],
    "troponin_i": ["troponin-i", "troponin i", "trop i", "hs-troponin"],

    # Hormonal & Endocrine
    "total_testosterone": ["total testosterone", "testosterone total", "testosterone"],
    "free_testosterone": ["free testosterone", "testosterone free"],
    "estradiol": ["estradiol (e2)", "estradiol", "e2", "serum estradiol"],
    "cortisol": ["serum cortisol", "cortisol", "morning cortisol"],
    "progesterone": ["serum progesterone", "progesterone", "prog"],
    "psa": ["prostate-specific antigen", "psa", "total psa"],

    # Pancreatic Function
    "lipase": ["serum lipase", "lipase"],
    "amylase": ["serum amylase", "amylase"]
}

# Short abbreviations that require strict contextual validation
SHORT_ABBREVIATIONS = {
    "hb", "hgb", "wbc", "tlc", "plt", "rbc", "hct", "pcv", "mcv", "mch", "mchc", "rdw",
    "anc", "tc", "ldl", "hdl", "tg", "vldl", "tsh", "t3", "t4", "ft3", "ft4", "alt",
    "ast", "alp", "ggt", "cre", "bun", "ua", "gfr", "egfr", "a1c", "fbs", "rbs", "fpg",
    "ppbs", "ppg", "b12", "fer", "fe", "tibc", "na", "k", "cl", "ca", "p", "mg", "crp",
    "hscrp", "esr", "e2", "psa"
}

# Single letter or short 2-letter symbols requiring strict matching unit or section context (e.g. K, Ca, P, Na, Cl, Mg, Fe, E2)
ULTRA_SHORT_SYMBOLS = {
    "k", "ca", "p", "na", "cl", "mg", "fe", "e2", "hb", "ua", "tc", "k+", "na+", "cl-", "ca++", "mg++"
}

CLINICAL_UNIT_PATTERN = re.compile(
    r'(\b(meq/l|mmol/l|mg/dl|ug/dl|ng/ml|pg/ml|iu/l|u/l|fl|mm/hr|g/dl|%|cumm|x10\^3|x10\^6|ratio|ml/min|ng/dl)\b)',
    re.IGNORECASE
)

CLINICAL_CONTEXT_PATTERN = re.compile(
    r'(\b(electrolyte|mineral|biochemistry|metabolic|chemistry|serum|hormone|lipid|thyroid|blood|panel|test|specimen|lab|result|reference|range|cardiac|inflammatory|pancreatic|endocrine)\b)',
    re.IGNORECASE
)

def normalize_date_string(date_str: str) -> Optional[str]:
    """Normalizes various date string formats into YYYY-MM-DD."""
    try:
        parts = re.split(r'[\/\-]', date_str)
        if len(parts) != 3:
            return None
        
        p1, p2, p3 = int(parts[0]), int(parts[1]), int(parts[2])
        
        # Format YYYY-MM-DD
        if p1 > 1000:
            year, month, day = p1, p2, p3
        else:
            # Format MM/DD/YYYY or DD/MM/YYYY or MM/DD/YY
            year = p3 if p3 >= 100 else (2000 + p3 if p3 < 50 else 1900 + p3)
            # Standard US MM/DD or DD/MM
            if p1 > 12:  # p1 is day
                day, month = p1, p2
            elif p2 > 12:  # p2 is day
                month, day = p1, p2
            else:  # Default MM/DD
                month, day = p1, p2

        if 1 <= month <= 12 and 1 <= day <= 31 and 1900 <= year <= 2100:
            return f"{year:04d}-{month:02d}-{day:02d}"
    except Exception:
        pass
    return date_str if len(date_str) >= 6 else None

def extract_specimen_date(text: str) -> Optional[str]:
    """
    Extracts specimen/collection date from text using regex.
    Supports formats like MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD, MM-DD-YYYY.
    Returns ISO date string YYYY-MM-DD or raw date string if valid.
    """
    if not text:
        return None

    # Contextual regex pattern looking for common specimen/collection date labels
    context_patterns = [
        r'(?:specimen|collection|collected|sample|drawn|report|visit|test|dated?|date)[\s\w:\.\-\/]*?(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})',
        r'(?:specimen|collection|collected|sample|drawn|report|visit|test|dated?|date)[\s\w:\.\-\/]*?(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})'
    ]

    for pattern in context_patterns:
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            date_str = m.group(1).strip()
            formatted = normalize_date_string(date_str)
            if formatted:
                return formatted

    # Fallback pattern for any standalone date format \d{1,2}[/-]\d{1,2}[/-]\d{2,4}
    fallback_match = re.search(r'\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b', text)
    if fallback_match:
        formatted = normalize_date_string(fallback_match.group(1).strip())
        if formatted:
            return formatted

    # Fallback pattern for YYYY-MM-DD
    iso_match = re.search(r'\b(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})\b', text)
    if iso_match:
        formatted = normalize_date_string(iso_match.group(1).strip())
        if formatted:
            return formatted

    return None

def extract_pages_from_pdf_bytes(pdf_bytes: bytes) -> Tuple[List[Dict[str, Any]], str, int]:
    """
    Extracts text page-by-page from a PDF document using pypdf.
    Returns (pages_data, note, total_page_count)
    where pages_data is [{"page_num": int, "text": str, "specimen_date": Optional[str]}, ...]
    """
    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        page_count = len(reader.pages)
        if page_count == 0:
            return [], "PDF file contains no pages.", 0

        pages = []
        for idx, page in enumerate(reader.pages):
            page_text = page.extract_text() or ""
            if page_text.strip():
                specimen_date = extract_specimen_date(page_text)
                pages.append({
                    "page_num": idx + 1,
                    "text": page_text.strip(),
                    "specimen_date": specimen_date
                })

        note = f"Processed all {page_count} pages of PDF document." if page_count > 1 else "Analyzed PDF document."
        return pages, note, page_count
    except Exception as e:
        return [], f"Could not read PDF text: {str(e)}", 0

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> Tuple[str, str, int]:
    """
    Extracts text from all pages of a PDF document using pypdf.
    Returns (extracted_text, note, page_count)
    """
    pages, note, page_count = extract_pages_from_pdf_bytes(pdf_bytes)
    if not pages:
        return "", note, page_count
    
    extracted_pages = [f"--- [Page {p['page_num']}] ---\n{p['text']}" for p in pages]
    full_text = "\n\n".join(extracted_pages)
    return full_text, note, page_count

def extract_text_with_gemini_vision(image_bytes: bytes, mime_type: str = "image/jpeg") -> Optional[Tuple[str, str]]:
    """
    Attempts cloud Vision AI extraction using Google Gemini if GEMINI_API_KEY or GOOGLE_API_KEY is configured.
    Returns (extracted_text, note) or None if API key not available or call fails.
    """
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        return None

    prompt = (
        "You are an expert clinical laboratory document parser. "
        "Carefully read the provided image. "
        "If this document is NOT a medical lab report or contains no blood test parameters, "
        "respond with exactly: NOT_A_LAB_REPORT. "
        "If this IS a medical laboratory report, transcribe all clinical test names, measured values, "
        "units, and reference ranges line-by-line (e.g. 'Hemoglobin: 14.2 g/dL (12.0 - 16.0)')."
    )

    # 1. Try modern google.genai package
    try:
        from google import genai
        from google.genai import types
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                prompt
            ]
        )
        if response and response.text:
            text = response.text.strip()
            if "NOT_A_LAB_REPORT" in text:
                return "", "Gemini Vision AI verified that this image is not a medical laboratory report."
            return text, "Processed via Google Gemini Vision AI."
    except Exception:
        pass

    # 2. Try legacy google.generativeai package
    try:
        import google.generativeai as legacy_genai
        legacy_genai.configure(api_key=api_key)
        model = legacy_genai.GenerativeModel("gemini-1.5-flash")
        image = Image.open(io.BytesIO(image_bytes))
        response = model.generate_content([image, prompt])
        if response and response.text:
            text = response.text.strip()
            if "NOT_A_LAB_REPORT" in text:
                return "", "Gemini Vision AI verified that this image is not a medical laboratory report."
            return text, "Processed via Google Gemini Vision AI."
    except Exception:
        pass

    return None

def extract_text_from_image_bytes(image_bytes: bytes, filename: str = "image.jpg") -> Tuple[str, str, Dict[str, Any]]:
    """
    Hybrid Image OCR & Vision Engine:
    1. Checks for Gemini Vision AI if API key is present.
    2. Falls back to Local OpenCV Preprocessing + Tesseract OCR Engine.
    Returns (extracted_text, note, metadata)
    """
    mime_type = "image/png" if filename.lower().endswith(".png") else "image/jpeg"

    # Step 1: Cloud Vision AI (Gemini) if available
    gemini_result = extract_text_with_gemini_vision(image_bytes, mime_type=mime_type)
    if gemini_result is not None:
        text, note = gemini_result
        return text, note, {"engine": "gemini_vision", "status": "success" if text else "non_medical_image"}

    # Step 2: Local OpenCV + Tesseract OCR
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return "", "Could not decode image format.", {"engine": "local_ocr", "status": "decode_error"}

        h, w = img.shape[:2]

        # Upscale smaller images for optimal Tesseract character recognition
        if max(h, w) < 1500:
            scale = 1500.0 / max(h, w)
            img = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_CUBIC)

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Contrast normalization
        norm = cv2.normalize(gray, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX)

        # Run Tesseract with both single-block and uniform page segmentation
        text_psm6 = pytesseract.image_to_string(norm, config="--psm 6")
        text_psm3 = pytesseract.image_to_string(norm, config="--psm 3")

        # Choose the richest text output
        ocr_text = text_psm6 if len(text_psm6.strip()) >= len(text_psm3.strip()) else text_psm3

        if not ocr_text.strip():
            return "", "No readable text detected in this image.", {"engine": "tesseract_ocr", "status": "empty"}

        return ocr_text, "Processed via Local Tesseract OCR Engine.", {"engine": "tesseract_ocr", "status": "success"}
    except Exception as e:
        return "", f"Local OCR processing error: {str(e)}", {"engine": "local_ocr", "status": "error", "error": str(e)}

def classify_value(measured_val: float, ref_min: float, ref_max: float) -> str:
    if measured_val < ref_min:
        return "Low"
    if measured_val > ref_max:
        return "High"
    return "Normal"

def calculate_urgency(measured_val: float, classification: str, ref_min: float, ref_max: float) -> str:
    if classification == "Normal":
        return "Normal"
    
    range_width = ref_max - ref_min
    if range_width <= 0:
        return "Monitor"
    
    deviation = 0.0
    if classification == "High":
        deviation = (measured_val - ref_max) / range_width
    elif classification == "Low":
        deviation = (ref_min - measured_val) / range_width
        
    if deviation > 0.25:
        return "Doctor"
    return "Monitor"

def build_synonym_pattern(synonym: str) -> re.Pattern:
    """Builds a regex pattern for a synonym that supports OCR word collisions (e.g. TotalCholesterol)."""
    words = synonym.strip().split()
    if len(words) > 1:
        inner = r'[\s\.\-_:]*'.join(re.escape(w) for w in words)
        pattern_str = r'(?:\b|\()' + inner + r'(?:\b|\)|:)'
    else:
        pattern_str = r'(?:\b|\()' + re.escape(synonym) + r'(?:\b|\)|:)'
    return re.compile(pattern_str, re.IGNORECASE)

def parse_report_text_python(text: str) -> List[Dict[str, Any]]:
    """
    Robust medical lab report parser:
    - Accurately matches clinical test names and multi-line table rows
    - Supports joined OCR text (e.g. TotalCholesterol, SerumCreatinine)
    - Validates short abbreviations to prevent false positives from random non-medical text
    - Handles comma-separated numbers and multi-unit scales (lakhs/cumm, cumm)
    """
    if not text or not text.strip():
        return []

    raw_lines = [l.strip() for l in text.split("\n") if l.strip()]
    results: List[Dict[str, Any]] = []
    detected_test_ids = set()

    for idx, line in enumerate(raw_lines):
        matched_test_id = None
        matched_synonym = ""

        # Test synonym matching
        for test_id, synonyms in TEST_SYNONYMS.items():
            if test_id in detected_test_ids:
                continue

            for syn in synonyms:
                pattern = build_synonym_pattern(syn)
                m = pattern.search(line)
                if m:
                    # CRITICAL OCR COLLISION GUARD:
                    # For short/single-letter symbols (like K, Ca, P, Na, Cl, Mg, Fe, E2),
                    # REQUIRE a matching unit or section context in the line or adjacent line
                    # to prevent false matches on words like "10k copies" or "Ca. 1990" or "p.m.".
                    clean_syn = syn.lower().strip()
                    if clean_syn in ULTRA_SHORT_SYMBOLS:
                        nearby_text = " ".join([
                            line,
                            raw_lines[idx - 1] if idx > 0 else "",
                            raw_lines[idx + 1] if idx + 1 < len(raw_lines) else ""
                        ])
                        has_unit = bool(CLINICAL_UNIT_PATTERN.search(nearby_text))
                        has_section_context = bool(CLINICAL_CONTEXT_PATTERN.search(nearby_text))
                        if not has_unit and not has_section_context:
                            continue
                    elif clean_syn in SHORT_ABBREVIATIONS:
                        # Must have clinical context (numbers, units, ranges, colons, or clean line)
                        has_unit_or_num = bool(re.search(r'(\d+|\b(mg/dl|g/dl|u/l|u/i|%|mmol|meq/l|cumm|lakhs|fl|pg/ml|ng/ml)\b|:|=|-)', line, re.IGNORECASE))
                        if not has_unit_or_num and idx + 1 < len(raw_lines):
                            # Check next line for number
                            has_unit_or_num = bool(re.search(r'\d+', raw_lines[idx + 1]))
                        if not has_unit_or_num:
                            continue

                    matched_test_id = test_id
                    matched_synonym = syn
                    break
            if matched_test_id:
                break

        if not matched_test_id:
            continue

        catalog_entry = get_catalog_entry(matched_test_id)
        if not catalog_entry:
            continue

        # Look for value and reference range
        raw_val = None
        ext_min = None
        ext_max = None
        found_unit = catalog_entry.unit

        # 1. First check remainder of the same line after synonym
        lower_line = line.lower()
        syn_pos = lower_line.find(matched_synonym.lower())
        rest_of_line = line[syn_pos + len(matched_synonym):].strip() if syn_pos != -1 else line

        val_match = re.search(r'(\d+(?:,\d+)*(?:\.\d+)?)', rest_of_line)
        if val_match:
            clean_str = val_match.group(1).replace(',', '')
            try:
                raw_val = float(clean_str)
                after_val = rest_of_line[val_match.end():]
                rng_m = re.search(r'(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:-|–|to)\s*(\d+(?:,\d+)*(?:\.\d+)?)', after_val)
                if rng_m:
                    ext_min = float(rng_m.group(1).replace(',', ''))
                    ext_max = float(rng_m.group(2).replace(',', ''))
            except Exception:
                raw_val = None
        
        # 2. If not found on same line, scan subsequent lines in multi-line table format
        if raw_val is None:
            for offset in range(1, min(6, len(raw_lines) - idx)):
                next_l = raw_lines[idx + offset]

                # If next line starts another known test, stop looking
                is_another_test = False
                for tid, syns in TEST_SYNONYMS.items():
                    for s in syns:
                        if build_synonym_pattern(s).search(next_l):
                            is_another_test = True
                            break
                    if is_another_test:
                        break
                if is_another_test:
                    break

                # Ignore status flags like 'L', 'H', 'NORMAL'
                if next_l.upper() in ['L', 'H', 'NORMAL', 'HIGH', 'LOW']:
                    continue

                # Check for unit
                if any(u in next_l.lower() for u in ['lakh', 'cumm', 'g/dl', 'mg/dl', 'u/i', 'u/l', '%', 'mmol', 'million']):
                    found_unit = next_l.strip()

                # Check for number
                if raw_val is None:
                    num_m = re.search(r'^\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*$', next_l)
                    if num_m:
                        try:
                            raw_val = float(num_m.group(1).replace(',', ''))
                            continue
                        except Exception:
                            pass

                    # Number with unit attached
                    num_m2 = re.search(r'^\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:mg/dl|g/dl|%|cumm|u/i|u/l|lakhs)', next_l, re.IGNORECASE)
                    if num_m2:
                        try:
                            raw_val = float(num_m2.group(1).replace(',', ''))
                            continue
                        except Exception:
                            pass

                # Check for reference range
                if ext_min is None:
                    rng_m2 = re.search(r'(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:-|–|to)\s*(\d+(?:,\d+)*(?:\.\d+)?)', next_l)
                    if rng_m2:
                        try:
                            ext_min = float(rng_m2.group(1).replace(',', ''))
                            ext_max = float(rng_m2.group(2).replace(',', ''))
                        except Exception:
                            pass

        if raw_val is None:
            continue

        # Standardize reference ranges and units
        ref_min = catalog_entry.min
        ref_max = catalog_entry.max
        range_overridden = False

        if ext_min is not None and ext_max is not None and ext_min < ext_max:
            # Check unit scales (platelets in lakhs vs x10^3, wbc in cumm vs x10^3)
            if matched_test_id == 'platelets' and ext_max < 10.0:
                ref_min = ext_min
                ref_max = ext_max
                found_unit = "lakhs/cumm"
            elif matched_test_id == 'wbc' and ext_max > 1000.0:
                ref_min = ext_min
                ref_max = ext_max
                found_unit = "cumm"
            else:
                min_ratio = ext_min / catalog_entry.min if catalog_entry.min > 0 else 1.0
                max_ratio = ext_max / catalog_entry.max if catalog_entry.max > 0 else 1.0

                if min_ratio < 0.25 or min_ratio > 3.5 or max_ratio < 0.25 or max_ratio > 3.5:
                    ref_min = catalog_entry.min
                    ref_max = catalog_entry.max
                    range_overridden = True
                else:
                    ref_min = ext_min
                    ref_max = ext_max

        # Auto-correction safeguard for dropped decimal point
        measured_val = raw_val
        is_auto_corrected = False
        original_val = None

        std_max = ref_max
        range_width = ref_max - ref_min
        close_min = ref_min - 0.2 * range_width
        close_max = ref_max + 0.2 * range_width

        if raw_val > 4.0 * std_max and not (matched_test_id in ['wbc', 'platelets'] and raw_val > 500):
            corrected = raw_val / 10.0
            if close_min <= corrected <= close_max:
                measured_val = corrected
                is_auto_corrected = True
                original_val = raw_val

        classification = classify_value(measured_val, ref_min, ref_max)
        urgency = calculate_urgency(measured_val, classification, ref_min, ref_max)

        explanation = ""
        if classification == "Low":
            explanation = catalog_entry.explanation_low
        elif classification == "High":
            explanation = catalog_entry.explanation_high
        else:
            explanation = f"Your {catalog_entry.name} level is within the normal reference range ({ref_min} - {ref_max} {found_unit}), representing healthy biological balance."

        results.append({
            "testId": matched_test_id,
            "name": catalog_entry.name,
            "category": catalog_entry.category,
            "measuredValue": measured_val,
            "unit": found_unit,
            "referenceMin": ref_min,
            "referenceMax": ref_max,
            "classification": classification,
            "urgency": urgency,
            "explanation": explanation,
            "isAutoCorrected": is_auto_corrected,
            "originalValue": original_val,
            "rangeOverridden": range_overridden
        })

        detected_test_ids.add(matched_test_id)

    return results
