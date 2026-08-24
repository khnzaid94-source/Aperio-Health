# 🔬 Aperio Health — AI Lab Report Simplifier Suite
> **Full-Stack Clinical Informatics, Machine Learning, and Computer Vision System**

Aperio Health is an intelligent health literacy tool designed to read typed blood test reports, photo scans, and PDFs, and translate complex laboratory shorthand into clear, plain-language explanations with multi-marker anomaly detection—without diagnosing.

---

## 🌟 Key Features

* **24 Standard Clinical Biomarkers across 7 Panels**:
  * *Complete Blood Count (CBC)*: Hemoglobin, WBC, Platelets, RBC, Hematocrit
  * *Lipid Profile*: Total Cholesterol, LDL, HDL, Triglycerides
  * *Thyroid Panel*: TSH, T3, T4
  * *Liver Function (LFT)*: ALT, AST, Total Bilirubin, ALP
  * *Kidney Function (KFT)*: Creatinine, BUN, Uric Acid
  * *Blood Sugar*: Fasting Blood Sugar (FBS), HbA1c
  * *Vitamins & Iron Studies*: Vitamin D, Vitamin B12, Ferritin

* **Machine Learning & Multi-Marker Anomaly Detection (`scikit-learn`)**:
  * Isolation Forest multidimensional vector evaluation.
  * **Metabolic Balance Index (0–100%)** scoring overall biomarker balance.
  * Co-occurrence Risk Clustering (Metabolic & Glycemic Synergy, Iron-Depletion Anemia, Hepatic Cellular Stress, Renal Clearance Stress).

* **Computer Vision Diagnostics (`OpenCV`)**:
  * Laplacian variance blur and sharpness detection.
  * Michelson contrast ratio calculation and >150 DPI resolution verification.
  * Automatic document deskewing and adaptive Otsu binarization.

* **11 Supported Languages with RTL Layout Support**:
  * English, Hindi (हिन्दी), Marathi (मराठी), Bengali (বাংলা), Telugu (తెలుగు), Tamil (தமிழ்), Gujarati (ગુજરાતી), Spanish (Español), French (Français), Arabic (العربية - with full right-to-left UI mirroring), and Mandarin Chinese (简体中文).

* **Visual Reference Range Gauges & PDF Summary Export**:
  * Interactive horizontal meters showing exact biomarker positioning across Low, Normal, and High zones.
  * One-click **"Download Doctor Summary (PDF)"** formatted for physician consultation.

* **Private Account-Isolated History & Retrospective Trend Tracking**:
  * Interactive Recharts trend charts with shaded reference bands.
  * 1–2 sentence retrospective trajectory summaries (strict non-predictive clinical rule).

* **Clinical Safeguards**:
  * Auto-detection for dropped decimal points (e.g. `45%` $\rightarrow$ `4.5%`).
  * Cross-check protection against garbled reference ranges.
  * Permanent medical scope disclaimer and **"No Data Used for AI Training"** privacy guarantee.

---

## 🛠️ Architecture & Tech Stack

```
Aperio Health/
├── backend/                  # Python FastAPI Backend
│   ├── main.py               # REST API & Unified Static SPA Server
│   ├── cv_engine.py          # OpenCV Computer Vision Quality & Preprocessing
│   ├── ml_engine.py          # Scikit-Learn Isolation Forest & Risk Clustering
│   ├── ocr.py                # Regex Parser & Clinical Safeguards
│   ├── catalog.py            # 24-Test Clinical Reference Catalog
│   ├── database.py           # SQLAlchemy SQLite Models (aperio_data.db)
│   └── requirements.txt      # Python Dependencies
├── src/                      # React TypeScript Frontend
│   ├── components/           # UI Components (Analyzer, History, Gauges, ML Card)
│   ├── constants/            # Translations (11 Languages), Catalog & Samples
│   ├── utils/                # Language helpers, Parsers & PDF Generator
│   └── App.tsx               # Main Application Shell
├── start.py                  # One-Click Unified Runner Script
└── package.json              # NPM Configuration
```

---

## 🚀 One-Command Quick Start

### 1. Install Dependencies (First-time setup only)
```bash
npm install
pip install -r backend/requirements.txt
```

### 2. Run the Full-Stack Application
```bash
python start.py
```
*(Or run `npm start`)*

This single command:
1. Automatically compiles the React frontend bundle.
2. Starts the Python FastAPI backend server on `http://localhost:8000`.
3. Automatically opens your default web browser to the application!

---

## ☁️ Deployment (Render / Railway / Cloud)

Aperio Health is designed as a single-port unified server for zero-cost cloud hosting:
* **Build Command**: `npm install && npm run build && pip install -r backend/requirements.txt`
* **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

---

## ⚖️ Medical Disclaimer
*Aperio Health is intended for educational and health literacy purposes only. It is not a clinical decision support system, diagnostic device, or medical treatment prescription tool. All clinical values must be verified against official laboratory instruments and reviewed with a qualified healthcare provider.*
