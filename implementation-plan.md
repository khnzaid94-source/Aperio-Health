# Aperio Health — Implementation Plan

> **Purpose:** Master reference for multi-session execution. If starting a new session,
> read this file, find the first unchecked `- [ ]` item, verify prior phases still build,
> and continue. Do not re-audit; all findings are already captured here.

## Project Context

Health lab-report analyzer ("Aperio Health" / LabLens): React 18 + Vite + TS frontend,
FastAPI + SQLite backend, OCR via Tesseract + optional Gemini Vision, scikit-learn
Isolation Forest scoring. Was demo-grade with fake auth; goal is a secure, deployable
portfolio showcase on Render free tier.

- Frontend served by backend (`dist/`), dev via Vite proxy (`/api` → :8000)
- Key dirs: `backend/` (main.py, database.py, ocr.py, cv_engine.py, ml_engine.py,
  catalog.py), `src/` (components/, utils/, constants/, types/)
- Known duplication being consolidated: parsers (`src/utils/parser.ts` + `backend/ocr.py`),
  catalogs (`src/constants/catalog.ts` + `backend/catalog.py`)
- NOTE: `backend/main.py` uses flat imports (`from database import ...`) — launch via
  `start.py` pattern (sys.path insert) or `uvicorn backend.main:app --app-dir backend`

## Locked Decisions (do not re-litigate)

| Topic | Decision |
|---|---|
| Owner / branding | Zaid Khan · app name "Aperio Health" · aperiohealth0826@gmail.com |
| Hosting | Render free tier (750 inst-hrs/mo), Docker runtime, uvicorn serves SPA |
| Database | SQLite anchored to `backend/aperio_data.db`; ephemeral disk accepted; seed-on-startup |
| Gemini OCR | ON, free tier (~15 RPM Flash); key server-side env ONLY |
| Data caching | Option B: localStorage cache allowed, wiped on logout, server is source of truth |
| Auth | Email/password (bcrypt + random session tokens) FIRST, then Google OAuth |
| ML engine | Tiers 1+2: NHANES real-population distributions + age/sex-aware ranges app-wide |

## User Must Provide (blockers per phase)

1. Google OAuth Client ID (`*.apps.googleusercontent.com`) → Phase 5 — user creates GCP
   project: External audience, Web application client, origins localhost:3000 /
   localhost:8000 / https://\<service\>.onrender.com
2. Chosen Render service name → Phase 7
3. GEMINI_API_KEY — user pastes into Render dashboard + local `.env` ONLY (never chat,
   never repo) → Phase 7
4. ~~Branding confirm~~ DONE: Aperio Health / aperiohealth0826@gmail.com

## Git & Publishing Policy

- Identity: Zaid Khan \<aperohealth0826@gmail.com\>
- GitHub account: khnzaid94-source (gh CLI 2.98 authenticated; binary at
  `C:\Program Files\GitHub CLI\gh.exe`)
- NEVER commit/push without explicit user approval at phase checkpoints
- Excluded from repo permanently: `*.db`, `.env`, `node_modules/`, `dist/`,
  `__pycache__/`, AND personal files: `final session transcript.md`,
  `session-ses_0045.md`, `Transcript/`, `memory-bank.md`, `LabLens_OpenCode_Reference.md`
- Repo stays PRIVATE through Phases 1–7 QA; flip public only after final QA pass

## Audit Findings Reference (fix targets)

**Security:** no auth anywhere; IDOR via `{user_email}` path params (main.py:299–458);
path traversal SPA route main.py:467–475; CORS `*`+credentials main.py:25–31; PHI plaintext
in localStorage (App.tsx ×37); XSS via document.write pdfExport.ts:34–177; placebo security
UI (ProfileView); hardcoded `http://localhost:8000` ×16; size-check-after-read main.py:134;
no magic-byte validation; journal DELETE has no ownership check (main.py:394).

**Bugs:** DB path CWD-dependent (database.py:7); batch uploads saved twice
(UploadView.tsx:158,186,219 vs App.tsx:886–898); fabricated fallback report
(ReportAnalyzer.tsx:176–227); only `reports[0]` synced to server (App.tsx persistReports);
crash on `mlInsights.risk_clusters.length` (MLInsightsCard.tsx:170); parser precedence bug
(parser.ts:315); synonym position via indexOf instead of match index (parser.ts:189,
ocr.py:444); stale expansion map + Tier-1 collapsed (AnalyzeView.tsx:119–136); onboarding
step-skip pills (OnboardingView.tsx:268–274); race conditions (UploadView handleFileUpload,
ReportAnalyzer runAnalysis); NaN chart domain (HistoryAndTrends.tsx:317–339); self-compare
allowed (:648–684); RTL dead code (language.ts:78–80); ml_engine import-time instantiation
(ml_engine.py:171); dead `ekg_animation.py`; fake progress strings (UploadView:112–118).

---

# 📌 STATUS SNAPSHOT & WORK LOG — Session ending 2026-08-24

**Prod:** https://aperio-health.onrender.com (Render free tier, autoDeploy on push)
**Repo:** github.com/khnzaid94-source/Aperio-Health (private) · branch `main`
**HEAD:** `ea8c9d5` — all work below is pushed
**Next up:** Phase 8 Stage 3 — Profile deep sections + AnalyzeView headings/tier copy (~75 keys)

## ✅ Completed work ledger (this chat)

| # | Deliverable | Commit |
|---|---|---|
| 1 | Full audit (security / bugs / UX) → phased remediation plan | — |
| 2 | Git init, identity, privacy exclusions verified, baseline snapshot | `72b395a` |
| 3 | **Phase 1** real auth: bcrypt+sessions, token routes (IDOR eliminated), CORS lockdown, safe static serving, upload hardening, demo seeding | `43e9648` |
| 4 | **Phase 2** frontend auth wiring: unified API client, real register/login, honest security UI | `96206c8` |
| 5 | **Phase 3** bulk history sync, race/crash guards, parser correctness (TS+PY), PDF XSS escape | `403be14` |
| 6 | **GitHub repo created** (private) + full push | `19dbf30` |
| 7 | **Phase 4** NHANES population engine: shared catalog/synonyms JSON, distribution builder, gender-aware ranges, lazy ML singleton, MODEL_CARD | `19dbf30` |
| 8 | **Phase 5** Google OAuth (server-verified ID tokens) | `b2902c4` |
| 9 | **Phase 6** quality pass: dead-code sweep (incl. deleting fake-report ReportAnalyzer), shared delta engine, Vitest 14 tests, ESLint | `403be14` |
| 10 | **Phase 7** Docker/render.yaml/env prep, lockfile fix, deploy live, prod QA 10/10, honest README | `4af0766`→`98bdb87` |
| 11 | **Post-deploy Batch 1**: analyze header fix · tier defaults collapsed · Saved Reports tab ⚠️(see pinned) · trend chart upgrade package · two-zone banner · Delta Pulse promotion · About panel · CI workflow · pytest suite · GitHub button · gender-aware copy | `16b93bd`, `7dec22d` |
| 12 | EKG refinement ×2 (slower sweep · centered/lowered baseline) | `b56dd4a`, `714b98b` |
| 13 | **i18n Stage 1a** sidebar (20 keys ×10 langs) + key-parity CI guard | `a6db88f` |
| 14 | **i18n Stage 1b** landing page (42 keys ×10 langs) | `8ee1d3d` |
| 15 | Language carry-over fix (explicit choice > stored profile) + immutable asset / no-cache HTML headers + landing language selector | `354562f`, `6ff218e` |
| 16 | **i18n Stage 2** onboarding wizard + dashboard banner/KPI/Delta-Pulse strings (115 keys ×10 langs) | `ea8c9d5` |
| 17 | Pinned Saved-Reports investigation: deploy currency verified, pinned note's code claim disproven via git archaeology, prod API round-trip QA passed, clobber hypothesis documented | — |
| 18 | **Pinned RESOLVED via owner screenshot**: root cause = tab was never implemented (list below fold); third "Saved Reports" pill + view wrapper added to HistoryAndTrends | `7933a07` |

**Test posture at HEAD:** Vitest 26/26 · pytest 13/13 · ESLint clean · tsc build green.

## ⛔ Pinned — RESOLVED 2026-08-24: "Saved Reports tab invisible on prod"

**Root cause (owner screenshot SS.png, incognito, demo account David Chen, badge=2):** the Saved Reports **tab never existed**. Batch-1 commit `7dec22d` *message* claimed "Saved Reports tab" but its actual diff only added a `hidden` class to the compare card. The saved-reports timeline list rendered at the very bottom of History & Trends, below the full chart section — effectively invisible without scrolling. The pinned note's `activeView === 'reports'` snippet was the *intended* design, hallucinated as shipped. Data was never lost (badge showed 2 reports; server round-trip QA also passed live on prod).

**Fix shipped (commit 7933a07):** HistoryAndTrends.tsx — `activeView` extended to `'charts' | 'compare' | 'reports'`; third pill "🗂️ Your Saved Reports" added (reuses translated `historyListHeader` key, all 10 languages); reports timeline list wrapped in `${activeView === 'reports' ? '' : 'hidden'}`; "need 2 visits" message now gated to compare view only (previously it would have shown for any non-charts view with <2 reports). Build green, ESLint clean, Vitest 26/26.

Investigation artifacts (still valid context):
- Prod deploy currency CONFIRMED: prod served `index-GQ4nzSBn.js` = fresh local build from HEAD.
- Live prod API round-trip QA PASSED (throwaway account): register → bulk-push → re-fetch → vault delete.

## ⏸️ Phase 8 · i18n Scope A — Stage 1 marked **INCOMPLETE by owner**

Shipped pieces are live (see ledger #13–15): parity guard, sidebar + landing localization, landing language selector, carry-over fix. Owner judges Stage 1 incomplete because large app surfaces remain English (Welcome-back banner, onboarding wizard, profile sections, etc.) — which are precisely the pending stages below.

- [x] Foundation: 10-language key-parity CI test (`translations.test.ts`)
- [x] Stage 1a: SidebarLayout (20 keys) — pushed
- [x] Stage 1b: LandingView (42 keys) — pushed
- [x] **Stage 2 (scope expanded per owner): Onboarding wizard + Dashboard welcome-banner/KPI strings (~85 keys)** — shipped `ea8c9d5`: 115 new keys (`onb.*` ×72, `dash.*` ×43) authored across all 10 languages; OnboardingView fully wired (wizard live-switches language via its own Language Preference select); DashboardView fully wired (welcome banner, Delta Pulse strip, KPI widgets, Latest Report card, quick-nav cards). Stored VALUES stay English by design (gender/blood/condition strings feed ML strata + filters); display-only translation via label helpers. Vitest 26/26 parity green, tsc build green, ESLint clean, pytest 13/13.
- [ ] Stage 3: Profile deep sections + AnalyzeView headings/tier copy (~75)
- [ ] Stage 4: Upload remainder + History compare/chart microcopy (~75)
- [ ] Stage 5: JournalView + AboutView + misc (~50)

Notes: translations are AI-authored (native review recommended pre-promotion); clinical term dictionaries fall back to English names where untranslated; parity test must be extended to any new dictionary added.

---


## Phase 1 — Backend Foundation & Real Auth [P0]

- [x] 1.1 `database.py`: anchor SQLite to file path; add `UserModel` (email unique,
      password_hash nullable for future Google-only accounts) + `SessionModel` (token PK)
- [x] 1.2 New `backend/auth.py`: bcrypt hashing; POST /api/auth/register, /api/auth/login,
      /api/auth/logout, PUT /api/auth/password (verify old), POST /api/auth/logout-all;
      `get_current_user` dependency (Bearer token → session → email); stale-session cleanup
- [x] 1.3 `main.py`: remove `user_email` from ALL history/journal/profile/delete routes —
      derive from token. Journal delete scoped by owner. Account deletion by token identity.
- [x] 1.4 CORS from `ALLOWED_ORIGIN` env (comma-separated support)
- [x] 1.5 Static serving: safe catch-all via os.path.realpath containment inside DIST_DIR
- [x] 1.6 Upload hardening: pre-read cap (read MAX+1 bytes), ≤10 files server-side,
      magic-byte validation (%PDF, PNG/JPEG/BMP/WebP), explicit skipped-file reporting
- [x] 1.7 New `backend/seed.py`: demo users sarah.jenkins/david.chen/maya.patel@example.com
      (password `demo1234`) if absent; called from startup event
- [x] 1.8 `requirements.txt`: pin versions; add bcrypt, google-auth
- [x] 1.9 Resolve stray root-level `aperio_data.db` / `lablens_data.db` after inspection

**Verify:** register→login→authorized GET history works; unauthorized → 401.

## Phase 2 — Frontend API Layer & Honest UI [P0]

- [x] 2.1 New `src/api/client.ts`: `API_BASE = import.meta.env.VITE_API_BASE || ''`;
      apiFetch wrapper (auth header, JSON parse, shape check, 401 → clear session)
- [x] 2.2 Replace all ~16 hardcoded localhost:8000 fetch URLs with client
- [x] 2.3 LandingView: real register/login against API; store token+email; hide Google
      button until Phase 5; remove fake setTimeout flows
- [x] 2.4 App.tsx: logout wipes ALL `aperio_*` keys; cache is cache-only (server wins)
- [x] 2.5 ProfileView: real password change; working logout-all-devices; REMOVE 2FA toggle
- [x] 2.6 Reword claims: remove HIPAA/encryption/zero-knowledge text (SidebarLayout,
      OnboardingView, landing badges) → honest wording

**Verify:** tsc build green; manual register/login/logout round-trip.

## Phase 3 — Bug Fixes [P0/P1]

- [x] 3.1 UploadView: delete per-report onSaveToHistory calls; batch persistence owned
      solely by App.handleBatchReportsExtracted
- [x] 3.2 ReportAnalyzer: delete FileReader fake-report fallback + identical readAsText
      branches; always POST /api/upload-file; error state on failure; clear stale cvQuality
- [x] 3.3 Backend POST /api/history/bulk (list merge); frontend persists ALL new reports once
- [x] 3.4 Guard `(mlInsights?.risk_clusters ?? [])` in MLInsightsCard + shape-check in client
- [x] 3.5 AbortController per upload/analysis; disable inputs while busy; stale-response guards
- [x] 3.6 OnboardingView: maxCompletedStep gating on pill navigation
- [x] 3.7 AnalyzeView: reset expansion map on parsedResults change; Tier-1 expanded default
- [x] 3.8 parser.ts:315 paren fix; match-index slicing instead of indexOf (parser.ts:189);
      mirror in ocr.py:444
- [x] 3.9 HistoryAndTrends: Number.isFinite filter + domain guard; block self-compare
- [x] 3.10 pdfExport.ts: escapeHtml() applied to every interpolation

## Phase 4 — Parser Consolidation + ML Tiers 1+2

- [x] 4.1 Shared `data/catalog.json`; TS imports it, Python loads it; delete duplicate literals
- [x] 4.2 Offline script `scripts/build_distributions.py`: NHANES XPT labs → per age-band×sex
      mean/SD/percentiles → commit `backend/data/distributions.json`
- [x] 4.3 Rewrite `ml_engine.py`: robust z-scores vs patient stratum; transparent weighted
      Balance Index; IsolationForest refit on NHANES samples; lazy init; keep risk clusters
- [x] 4.4 Age/sex-aware reference ranges flow through parser/catalog/UI
- [x] 4.5 `docs/MODEL_CARD.md` + educational-use disclaimers

## Phase 5 — Google OAuth

- [x] 5.1 Backend POST /api/auth/google: verify id_token (GOOGLE_CLIENT_ID env),
      require email_verified, find-or-create user, issue session token
- [x] 5.2 Frontend @react-oauth/google provider + GoogleLogin → credential → API → session
- [x] 5.3 Env plumbing: GOOGLE_CLIENT_ID (server), VITE_GOOGLE_CLIENT_ID (build)

## Phase 6 — Quality Pass [P2, time-boxed]

- [x] 6.1 Dead code sweep: rm ekg_animation.py; unused props (UploadView userEmail,
      HistoryAndTrends onLoadSampleHistory, JournalView currentLang, MLInsightsCard unused,
      ProfileView extras); dead RTL plumbing; fake progress strings → real stages
- [x] 6.2a computeDeltas() extracted to src/utils/deltas.ts (both consumers migrated). 6.2b ResultCard extraction DEFERRED: high churn vs regression risk before deploy QA
- [x] 6.3 Vitest parser tests + ESLint config
- [x] 6.4 CATALOG Map lookups in render paths; lazy ML init

## Phase 7 — Deploy & Verify (Render)

- [x] 7.1 Dockerfile: python slim + tesseract-ocr + node build stage → uvicorn :8000
- [x] 7.2 Env checklist (service name LOCKED: Aperio-Health -> https://aperio-health.onrender.com; render.yaml blueprint added; .env.production carries public VITE client id): SECRET_KEY, ALLOWED_ORIGIN, GOOGLE_CLIENT_ID, VITE_* build args;
      USER pastes GEMINI_API_KEY personally
- [x] 7.3 Seed-on-startup verified; cold-start "waking up…" loading state
- [x] 7.4 Remote QA battery 10/10 on prod + README rewritten (browser-side manual QA handed to owner) · README rewritten honestly
- [x] 7.5 PROD URL: https://aperio-health.onrender.com (owner adds to Google origins; OAuth publish = owner click) to Google origins; publish OAuth app (non-sensitive scopes)

## Resume Protocol (for new sessions)

1. Read this file top-to-bottom.
2. Check `git status` clean-ish; run `npm run build` (tsc) and existing tests — must be
   green before new work.
3. Execute first unchecked task; tick checkboxes here as work completes.
4. Never commit/push without explicit user approval; never touch GEMINI_API_KEY (user-only).
5. If blocked on a "User Must Provide" item: STOP and ask the user immediately. Only if no
   response in-session: mark the task ⛔ BLOCKED here and continue with next unblocked task.
   Never fabricate placeholder values for user-only secrets.

### Phase 6 addendum - encoding investigation
'Flagged mojibake' in hi/mr/es/fr translation strings was a FALSE ALARM caused by PowerShell cp1252 console rendering. Verified at codepoint level: all files strict-UTF-8 valid; real Devanagari (26k+ chars in translations.ts) and accents intact. Hardened getTranslation() param interpolation instead (regex-escape key, function replacer) - closes audit item S5.

