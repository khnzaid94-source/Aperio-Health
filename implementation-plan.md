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
**HEAD:** three commits pushed + deployed & verified 2026-08-25: `07a0a08` (trends single-page layout) → `4620619` (richer demo seeds) → `0d81230` (deletion propagation). Prod bundle `index-T7qpK-e4.js` = fresh local build of HEAD.
**Next up:** owner manual QA battery (`docs/QA-BATTERY.md`, now incl. propagation + layout checks) on prod → Phase 9 test hardening → native-speaker review → publish gate

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
| 19 | **i18n Stage 3**: Profile deep sections + AnalyzeView headings/tier copy localized (123 new keys ×10 langs) | `5e728ea` |
| 20 | Stages 1–3 remediation audit: `nav.selectLanguage` aria-labels (sidebar+landing), delete-confirm `<strong>` split, `prof.today` fallback, tier-3 hint casing; scripted sweep clean (+4 keys/lang → 304×10) | `5e728ea` |
| 21 | **i18n Stage 4**: UploadView + HistoryAndTrends fully localized (110 new keys ×10 langs: `up.*` ×45, `hist.*` ×65); reused `dash.nonFasting/postWorkout`, `an.allWithCount/filterAll`, `normal/high/lowBadge`, `processingText`, `getLocalizedCategory` | `2504c3a` |
| 22 | **i18n Stage 5**: JournalView + AboutView + misc (MLInsightsCard, RangeGauge, ConfirmDialog defaults) fully localized — 91 new keys ×10 langs (`jrn.*` ×35, `ab.*` ×35, `ml.*` ×14, `gauge.*` ×5, `ui.*` ×2); AboutView HIPAA badge reworded honest; dictionary now 505 keys ×10 | `1de3095` |
| 23 | **Pre-QA scripted i18n sweep + defect fixes**: deploy currency verified (prod = HEAD assets). App-wide hardcoded-English scan found 5 user-visible defects, all fixed: (1) LandingView pillar descriptions called `t('pillar1Desc')` etc. missing `landing.` prefix → raw key names rendered on prod since Stage 1b; (2) HistoryAndTrends band caption hardcoded EN → wired existing `hist.bandCaption`; (3) ProfileView "Current Medications & Supplements" hardcoded → wired orphaned `prof.medsLabel`; (4) UploadView CV strip title hardcoded → wired orphaned `up.cvTitle`; (5) `up.processingNofM` called with `{current,total}` but never defined in ANY language → batch progress showed raw key string; added to all 10 langs. Permanent CI hardening in translations.test.ts: `{param}` parity per language + call-site key-existence scan via import.meta.glob (auto-catches defects 1 & 5 classes). Known accepted EN-by-design list documented. Owner QA battery authored at `docs/QA-BATTERY.md`. | `a58eba1` |
| 24 | **ui(trends) single-page layout**: Trends tab chart panel + written summary restructured into responsive grid — `lg:grid-cols-[minmax(0,1fr)_280px]` renders summary as right-side rail on desktop (two-col only when a summary exists); stacked flex-col below lg; card padding tightened one step. Render-location-only change; no logic/i18n keys touched. Battery §6 laptop-viewport fit check added. | `07a0a08` |
| 25 | **feat(demo) richer showcase seeds**: demo accounts upgraded for reviewer impact — 4 visits each (~12/100/190/280 days back via new `daysAgo()` helper → seeds never look stale), realistic treatment-response arcs (Sarah FBS 152→108/HbA1c 7.8→6.4; David LDL 178→121/HDL 36→44; Maya TSH 8.9→3.9/ferritin 6→41 with final visit all-Normal showcasing the clean dashboard state), panels widened with catalog-proven in-range analytes, and every account now seeds medication + supplement + **lifestyle** journal entries (no empty ledger cards). Battery §4 badge=4 updated. | `4620619` |
| 26 | **fix(history) deletion propagation** (owner-reported QA bug: cleared history lingered in Analyze tab): `currentSourceReportId` provenance ties analyzer session to saved-report id — set on save/hydrate, nulled on fresh upload/batch; clear-all resets analyzer + ml insights + provenance; single-report delete resets analyzer only when displaying THAT report; single-biomarker delete removes the testId from the live analyzer too; raw OCR text purges on ANY deletion (strict no-trace per owner directive). Demo resurrection killed via `aperio_democleared_<email>` tombstone blocking auto-seed (history + journal) after explicit clears/last-item deletes — flip-flop across reloads gone; tombstone dies at logout so fresh demo logins reseed intentionally. Non-401 DELETE failures surface amber `ui.syncFail` notice ×10 langs (dictionary 507×10) replacing silent swallow. New pure helpers `src/utils/historyOps.ts` (removeTestFromResults keeps unidentifiable rows — safer deletion semantics; shouldSeedDemoData truth table). Tests: pytest `test_history_api.py` — bulk→GET round-trip, clear-all→`[]`, single report/test deletes, cross-account IDOR no-op guard, auth-required deletes; vitest historyOps suite. Vitest 43/43 · pytest 18/18 · build green · ESLint clean. | `0d81230` |

**Test posture:** Vitest 43/43 · pytest 18/18 · ESLint clean · tsc build green. Dictionary 507 keys ×10 (param parity + call-site scan green). Prod = HEAD verified.

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
- [x] **Stage 3** — shipped (uncommitted): 123 new keys (`prof.*` ×66, `an.*` ×57) across all 10 languages; ProfileView fully wired (all 6 cards + hero chips + password/delete modals), gender/blood/condition display via label helpers reusing `onb.opt*` / `onb.cond_*` vocab — stored values stay English by design; AnalyzeView fully wired (tier headers/badges/subcopy, urgency+category filters, symptom bar, postprandial/exercise/med-context/discussion-prompt chips, Range/Target lines, empty state, search). Exact-match reuse of `dash.nonFasting`, `dash.postWorkout`, `dash.ctaUploadNow`. Applied via verified codemod (60/60 patterns). Vitest 26/26 parity green, tsc build green, ESLint clean, pytest 13/13.
- [x] **Stage 4** — shipped `2504c3a`: 110 new keys (`up.*` ×45, `hist.*` ×65) across all 10 languages; UploadView fully wired (dropzone header/limits/format badges, batch progress + honest stage messages, all error/success banners incl. 401 + server-offline variants, CV quality strip labels/scores, raw-text inspector accordion + placeholder); HistoryAndTrends fully wired (3 view pills, trend chart tooltip/min-max lines/band caption, compare workspace header/sub-toggles, visit A/B selectors + option tags, self-compare warning, plain-language summary chips+lines, delta filter pills, card badges/target-range/marker titles, clinical table headers + localized category via `getLocalizedCategory` + High/Low/Normal badges via existing badge keys + trajectory states, sample-condition pill reusing `dash.*`, all 3 ConfirmDialogs). Exact-match reuse of `dash.nonFasting`, `dash.postWorkout`, `an.allWithCount`, `an.filterAll`, `normalBadge/highBadge/lowBadge`, `processingText`. Inserted via verified Python splice (key parity 110×10, `{param}` parity vs EN pre-checked). Vitest 26/26 parity green, tsc build green, ESLint clean, pytest 13/13.
- [x] **Stage 5** — shipped (uncommitted): 91 new keys (`jrn.*` ×35, `ab.*` ×35, `ml.*` ×14, `gauge.*` ×5, `ui.*` ×2) across all 10 languages; JournalView fully wired (header/subtitle/info strip, form drawer incl. category pills + labels + per-type placeholders, cancel/save buttons, all 3 ledger cards with headers/counts/empty states/type tags/`Started:`+`Event Date:` prefixes/delete titles) — `currentLang` prop added and passed from App.tsx; AboutView fully wired (hero badge/title/intro, trust-grid 4 cards badges/titles/bodies, 3-part disclaimer leads+bodies, catalog header `{count}`/sub/search/filter-aria/all-panels `{count}`, table column headers, no-match `{query}` state, fallback purpose cell); misc: MLInsightsCard localized (card title/badge/sub, balance label/header/body + `{stratum}` suffix, copy-questions button×2 + title, clusters header/empty-state/interacting-markers, agenda header `{count}`, unknown fallback) via optional `currentLang` prop from AnalyzeView; RangeGauge localized (gauge title, value title `{value}/{unit}`, low/normal/high zone labels) via optional `currentLang` prop ×2 call sites; HistoryAndTrends ConfirmDialogs now pass translated `subtitle` (`ui.cannotUndo`) + `cancelLabel` (`ui.cancel`) replacing English defaults. Honest-copy fix: AboutView card-4 badge reworded EN "HIPAA & GDPR Privacy" → "Private Account Isolation" (compliance claim contradicted Phase 2 honesty pass; body text already accurate). Inserted via verified Python splice (910 entries); zh-block splice initially landed past INTERFACE_TRANSLATIONS close (last-property brace has no trailing comma) — caught by vitest parity run, relocated surgically. Vitest 26/26 parity green, tsc build green, ESLint clean, pytest 13/13; scripted hardcoded-English sweep of all 5 touched components = 0 hits.

Notes: translations are AI-authored (native review recommended pre-promotion); clinical term dictionaries fall back to English names where untranslated; parity test must be extended to any new dictionary added.

**Stages 1–3 remediation audit (this session):** scripted sweep of dictionaries + call sites found: 0 duplicate keys, 0 `{param}` mismatches across all 10 langs, 0 param'd keys called bare, carry-over guard verified at all 4 profile-load sites. Fixed: hardcoded `aria-label="Select display language"` in SidebarLayout + LandingView → new `nav.selectLanguage` key; delete-confirm modal restored `<strong>` bolding via `prof.deleteConfirmLead/Bold/Tail` split; last-login fallback `'Today'` restored via `prof.today`; tier-3 hint action word lowercased. Net +4 keys/lang (304 ×10). All six wired views now scan clean of hardcoded English.

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

## Phase 9 — Test Hardening [pre-publish gate]

> Rationale (locked 2026-08-24): the Phase 1–3 audit *fixed* security issues but nothing
> *guards* them — a regression would ship silently. Formal performance/load testing is
> deliberately SKIPPED: Render free tier (~50s cold start, 512 MB, shared CPU) makes load
> numbers noise; revisit only if a paid tier is adopted. Compatibility = light manual pass
> (Chrome + one WebKit + one Android), folded into the QA battery.

- [ ] 9.1 **IDOR/authz matrix + dependency audit in CI**: pytest matrix proving token A
      cannot read/write user B's reports / journal / profile / vault-delete routes;
      stale-session → 401; add `npm audit --omit=dev` + `pip audit` step to GitHub Actions
- [ ] 9.2 **Core-accuracy unit tests**: `ml_engine.py` robust z-scores, Balance Index
      weights, age/sex stratum selection, lazy-init singleton; `ocr.py` parser edge cases
      (match-index slicing, synonym positions, malformed ranges) mirroring parser.ts suite
- [ ] 9.3 **Integration suite** (FastAPI TestClient + temp SQLite): register→login→
      authorized fetch; history bulk push/re-fetch round-trip; journal CRUD owner-scoped;
      upload-file endpoint with fixture files incl. magic-byte reject paths; Google OAuth
      verify mocked (codifies the manual prod round-trip QA from the pinned investigation)
- [ ] 9.4 **Post-deploy smoke script**: GET / returns HTML with NEW asset hash, API wake-up
      check, demo-account login round-trip on prod; local script or post-deploy CI step
- [ ] 9.5 **Bundle split**: main index chunk 803 kB (>500 kB warning) — evaluate React.lazy
      route-level splitting for AnalyzeView/HistoryAndTrends; charts/vendor already split

**Verify:** full battery green (vitest + pytest + build + ESLint); IDOR matrix red-green
proven by reverting one ownership check locally; smoke script passes against prod.

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

