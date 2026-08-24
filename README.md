# Aperio Health — Clinical Intelligence Suite

> Turn laboratory blood reports into plain-language insights — powered by real
> population statistics, computer vision, and machine learning.

**Live demo:** https://aperio-health.onrender.com *(free tier — first visit may take ~45s while the server wakes)*

---

## What it does

Upload a lab report (**PDF / photo / text**) and Aperio Health:

1. **Extracts** values via a hybrid OCR pipeline — Google Gemini Vision when configured,
   local Tesseract + OpenCV preprocessing (deskew, Otsu binarization, quality grading) as automatic fallback.
2. **Parses** up to **63 clinical biomarkers** across CBC, lipid, thyroid, liver, kidney,
   glucose, iron, vitamin, hormone, inflammatory, and pancreatic panels — including
   multi-line tables, OCR word-collisions (`TotalCholesterol`), comma thousands, and
   unit-scale normalization (lakhs/cumm).
3. **Segments** multi-page PDFs into distinct visits by specimen date.
4. **Interprets** each value against **age- and sex-specific reference intervals derived
   from CDC NHANES 2017–2018** real-world population percentiles — falling back to the
   report's own printed ranges, then textbook catalog ranges (each source labeled).
5. **Scores** overall balance with a transparent weighted z-score index + an Isolation
   Forest anomaly check, detects cross-marker patterns (glycemic-lipid synergy,
   iron-deficiency signature, liver/kidney stress pairs), and explains everything in
   plain language across **10 languages**.
6. **Tracks** history with visit-over-visit delta analysis, trend charts, a health
   journal, doctor-question generation, and a printable clinical summary PDF.

See [`docs/MODEL_CARD.md`](docs/MODEL_CARD.md) for exactly how the scoring works,
where the data comes from, and what it can't do.

## Security & privacy posture

- Real authentication: bcrypt password hashing, server-side session tokens, optional
  **Sign-in with Google** (ID tokens verified against the audience client).
- Every data route derives identity from the session token — no IDOR-style email-in-URL access.
- Upload hardening: pre-read size caps, file-count limits, magic-byte type validation.
- Hardened static serving, explicit CORS allow-list, HTML-escaped PDF export.
- Honest UI: no fake compliance badges. Educational tool — not medical advice, not HIPAA infrastructure.

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Recharts |
| Backend | FastAPI (Python), SQLAlchemy, SQLite |
| Vision/OCR | OpenCV, PyTesseract, pypdf, optional Gemini Vision |
| ML | NumPy, scikit-learn (Isolation Forest), NHANES-derived distributions |
| Auth | bcrypt + session tokens, Google OAuth 2.0 (`google-auth`) |
| Deploy | Multi-stage Docker (Node build → Python slim + Tesseract) on Render free tier |

## Project layout

```
backend/        FastAPI app, auth, parsers, ML engine, seed script
shared/         Single-source catalog.json, test_synonyms.json, distributions.json
src/            React SPA (components, utils, api client)
scripts/        NHANES distribution builder (reproducible pipeline)
docs/           MODEL_CARD.md
Dockerfile      Multi-stage production image
render.yaml     Render blueprint
```

Both the TypeScript and Python parsers consume the **same shared JSON definitions**
(catalog + synonyms + population stats), enforced by mirrored test suites on each side.

## Local development

```bash
# 1. Install
npm install
pip install -r backend/requirements.txt

# 2. Configure (see .env.example)
cp .env.example .env    # add GOOGLE_CLIENT_ID; GEMINI_API_KEY optional

# 3. Run (builds UI on first run, serves API + SPA on :8000)
python start.py         # or: npm run dev  (Vite :3000 -> proxies /api)

# 4. Quality gates
npm test                # Vitest parser + delta suites
npm run lint            # ESLint
python -m pytest        # (parser regression suite)
```

Demo accounts are seeded automatically at startup:
`sarah.jenkins@example.com | david.chen@example.com | maya.patel@example.com` — password `demo1234`.

## Limitations (read before use)

- Heuristic parsing: clean digital PDFs parse reliably; phone photos depend on image
  quality; unusual formats may miss values.
- Population percentiles describe *commonness*, not health. Nothing here diagnoses.
- Free hosting: the server sleeps after 15 idle minutes and its database resets on
  redeploys (demo accounts re-seed automatically).
- If Gemini OCR is enabled, uploaded images go to Google's API (free-tier data may be
  used by Google for product improvement) — use sample reports, not sensitive documents.

---

Built as a portfolio demonstration of full-stack engineering: reproducible data
pipeline, stratified biostatistics, dual-language parser parity under test, and an
honest security posture.
