# Functional Specification — AI Lab Report Simplifier

---

## 1. App Overview

**Purpose (one sentence):** A tool that reads a person's printed lab/blood test report and explains the results in plain language, flagging anything outside the normal range, without diagnosing.

**Users:** Individual members of the public with no medical training who have received a lab report and want to understand it — particularly people for whom medical terminology is a barrier (health literacy) or who prefer a language other than the report's original language for the explanation.

**Problem it solves:** Lab reports are printed in clinical shorthand (abbreviations, reference ranges, jargon) that most people cannot interpret on their own, and immediate access to a doctor to explain results isn't always available. The app closes that literacy gap for a defined set of common lab tests, while explicitly not replacing professional medical advice.

---

## 2. Core Features & Functionality

### 2.1 Report Upload and Analysis
**What the user can do:** Submit a photo/scan of a lab report, or a PDF of one, and receive a structured breakdown of every recognized test result on it.

**Inputs required:**
- One report file, either as an image or as a PDF document.
- If the PDF has multiple pages, only the first page is analyzed; the user is informed of this.

**Outputs produced, per recognized test result:**
- The name of the test.
- The measured value and its unit of measurement.
- The normal (reference) range for that test.
- A classification of the result as Normal, High, or Low relative to that range.
- An urgency classification (see 2.3).
- A short plain-language explanation, for any result classified High or Low (see 2.4).

**Logic applied:**
- The document's visible text is read and interpreted by the system.
- Each line of text is checked against a known catalog of test names and abbreviations (see 2.2) to identify which test it refers to, tolerating minor misreadings of the source text (e.g., a smudged or lightly-misread character does not automatically cause a test to go unrecognized).
- The measured value is located specifically after the test's name/abbreviation on its line, not merely "the first number in the line" — this avoids mistaking a digit that happens to appear inside a test's own name or abbreviation for the actual measured value.
- Each value is compared to its reference range to produce the Normal/High/Low classification.
- If nothing on the document matches the known test catalog, no results are produced and the user is told the report could not be read, with a suggestion to try a clearer image or check that the report contains a supported test category.

### 2.2 Supported Test Catalog
The system recognizes a fixed set of **24 tests across 7 categories**:

| Category | Tests included |
|---|---|
| Complete Blood Count | Hemoglobin, White Blood Cell Count, Platelet Count, Red Blood Cell Count, Hematocrit |
| Lipid Profile | Total Cholesterol, LDL Cholesterol, HDL Cholesterol, Triglycerides |
| Thyroid Panel | Thyroid Stimulating Hormone, Triiodothyronine (T3), Thyroxine (T4) |
| Liver Function | Alanine Transaminase, Aspartate Transaminase, Total Bilirubin, Alkaline Phosphatase |
| Kidney Function | Creatinine, Blood Urea Nitrogen, Uric Acid |
| Blood Sugar | HbA1c, Fasting Blood Sugar |
| Vitamins & Iron Studies | Vitamin D, Vitamin B12, Ferritin |

Each test in the catalog has a defined normal range, a unit of measurement, and two pieces of pre-written explanatory content: what a low result can mean, and what a high result can mean. This catalog is fixed system content — it is not created or edited by end users.

Tests or panels outside this list are not recognized, even if physically present on an uploaded report.

### 2.3 Urgency Classification
**What it does:** In addition to Normal/High/Low, every result is assigned one of three urgency levels, based on how far the measured value deviates from its normal range (as a proportion of that range):
- **Normal / no elevated urgency** — value is within range.
- **Worth monitoring** — value is outside range by a small-to-moderate margin.
- **Discuss with your doctor soon** — value is outside range by a large margin.

This classification drives which results are surfaced more prominently and what closing guidance is appended to an explanation (see 2.4).

### 2.4 Plain-Language Explanations
**What the user can do:** Read a short (2–3 sentence) explanation for each abnormal (High/Low) result.

**Logic applied:**
- Normal results are not individually explained. If every result on a report is Normal, a single confirmation message is shown instead of a list.
- Each explanation states the test name, the measured value, how it compares to the normal range, and a pre-written description of what that direction of abnormality can generally indicate.
- Explanations are assembled from a fixed, pre-approved bank of content matched to the specific test and direction (high/low) — they are **not** generated freely/dynamically for each request. This is a deliberate constraint to prevent the system from stating anything not pre-vetted.
- Explanations never state or imply a diagnosis. Language is phrased as possibility/association ("can indicate," "is linked to"), never certainty.
- Any result classified at the highest urgency level receives an additional closing sentence recommending the user see a doctor soon rather than wait for a routine visit.

### 2.5 Value Correction (Misread Value Safeguard)
**What it does:** Automatically detects and corrects one specific, narrow error pattern: a decimal point that appears to have been dropped while reading the document (e.g., a value read as "45" that was very likely actually "4.5").

**Logic applied (all conditions must hold):**
- The read value is more than four times the upper bound of that test's normal range (i.e., implausibly high for that specific test).
- Dividing the value by ten would place it within, or very close to, the normal range.
- If both hold, the value is divided by ten and the result is visibly labeled as auto-corrected, with a prompt for the user to verify it against their original document.
- This correction deliberately does **not** trigger for values that are merely "very high but not implausibly so," so that a genuinely severe abnormal result is never silently reinterpreted as something milder.

### 2.6 Reference Range Cross-Check
**What it does:** Protects against a garbled reading of the normal-range numbers printed on the report itself.

**Logic applied:** If the range read directly off the document differs drastically from the system's own known standard range for that same test, the system disregards the document's printed range and uses its own known range instead — on the reasoning that two adjacent numbers being misread is more likely than a legitimate lab using a wildly different reference range for a standard test.

### 2.7 Sample/Demo Reports
**What the user can do:** Browse a fixed set of **7 pre-built example reports** without uploading anything, to see how the tool works. The user can move forward and backward through this set one at a time. Each example has a short descriptive label (e.g., "all-clear panel," "multi-panel, several flagged results").

**Logic applied:** Viewing a sample report runs it through the exact same analysis and explanation process as a real upload, but the result is never saved to the user's history (see 2.8). If the user instead submits their own file, that takes priority over whatever sample was being viewed.

### 2.8 Personal History
**What the user can do:** Every real report a signed-in user uploads and successfully analyzes is automatically added to a personal, private history tied to their account. The user is notified this happened.

**What is stored per saved report:** the date, a label identifying the source file, and every one of its individual test results (name, value, unit, range, classification, urgency).

**Constraint:** Only real uploads are saved this way. Sample/demo reports are never added to history.

### 2.9 Browsing Past Reports
**What the user can do:** View a list of all their previously saved reports, newest first, each showing its date, source label, and a count of how many results were flagged as abnormal. The user can expand any entry to see its full result breakdown and explanations again, identical in content to when it was first analyzed.

### 2.10 Trend Tracking
**What the user can do:** For any test that appears in **two or more** of their saved reports, select that test and view how its value has changed across every visit where it was recorded, oldest to newest.

**Output produced:**
- A chart plotting the value at each recorded date.
- The normal range displayed as a highlighted band on the same chart, with its lower and upper numeric boundaries labeled.
- Each plotted point distinguishable by its Normal/High/Low classification at that point in time.
- A written, one-to-two-sentence summary comparing the very first and most recent recorded value for that test, stating whether it has increased, decreased, or stayed the same, and whether it is now closer to or further from the normal range than it was at the first recorded visit.

**Explicit constraint (business rule, not a gap):** This feature only ever describes what has already happened. It does not predict, project, or estimate any future value. With as few as two data points for some users, a genuine prediction would be closer to guesswork than modeling, and the team decided a confidently-stated wrong prediction is a worse outcome than no prediction, especially for health-related information.

**Test eligibility rule:** A test that has only ever appeared once in a user's history is not offered as a trend option — there is nothing to compare it against yet.

### 2.11 Sample History (Trend Preview)
**What the user can do:** If a signed-in user has no saved history yet, they may choose to load a built-in example history (four example visits over several months, showing one value trending toward normal and another trending away from it) purely to preview what the trend feature looks like.

**Constraints:**
- This option is only ever presented when the user's real history is empty — it cannot be used to overwrite existing real data.
- This sample data belongs only to the user who loaded it; it is not visible to, or shared with, any other user.
- It can be removed the same way as real history (see 2.12).

### 2.12 Clear History
**What the user can do:** Permanently delete all of their own saved report history in a single action (real uploads and/or loaded sample data alike).

**Logic applied:** This action only ever removes data belonging to the signed-in user performing it. It has no effect on any other user's data. There is no undo.

### 2.13 Language Selection
**What the user can do:** Switch the display language of the entire interface — every label, every test name, and every generated explanation — from a set of **10 additional languages** beyond the system's default: Hindi, Marathi, Bengali, Telugu, Tamil, Gujarati, Spanish, French, Arabic, and Mandarin Chinese.

**Logic applied:**
- Changing the language changes what the user reads. It does **not** change what the system is able to read from an uploaded report — document analysis always operates against the one source language the catalog is defined in, regardless of the display language currently selected.
- For a language that is conventionally written right-to-left (Arabic, in the current supported set), the entire layout of the interface mirrors accordingly, not just the text direction.
- Numeric ranges (e.g., a "4.0 to 5.6" style range) are protected from a known text-direction rendering issue that could otherwise visually reverse the order of the two numbers in a right-to-left context.
- The language choice is available before signing in as well as after. One exception: the sign-in screen's own short instructional text is currently only available in the system default language, regardless of which language is selected; every other screen fully honors the selected language once signed in.

### 2.14 Sign-In and Account-Based Privacy
**What the user can do:** Sign in using an existing third-party account (a Google account, specifically) before accessing any part of the app beyond the initial landing view. Sign out at any time.

**Logic applied:**
- No feature described above (upload, sample browsing, history, trends) is accessible before signing in — the user sees only a landing view and a prompt to sign in.
- Signing in establishes the user's identity for the remainder of that use of the app.
- All personal history (2.8–2.12) is tied to that identity. A user can only ever see, add to, or clear their **own** history — never another user's, even when many different people use the same deployment of the app.
- Signing out ends access to personal history until the user signs back in.

---

## 3. User Flows & Interactions

### 3.1 First arrival
1. User opens the app. They see introductory branding and a prompt to sign in — nothing else is usable yet.
2. **Decision:** sign in, or leave. There is no way to use any feature without signing in.
3. User signs in via the third-party account flow.
   - **If sign-in succeeds:** user proceeds to the main app, now recognized by their identity for the rest of this visit.
   - **If sign-in fails or cannot be completed** (e.g., the identity provider is unreachable): the user should see a clear explanation of what went wrong, never a blank or frozen screen.

### 3.2 Analyzing a report (primary task)
1. Signed-in user chooses to either upload their own report file, or open the sample-report browser.
   - **Branch A — own file:** user selects an image or PDF from their device.
     - If it's a multi-page PDF, only page 1 will be used; user is told this.
     - Submitting a new file always takes priority over anything from the sample browser that was on screen.
   - **Branch B — sample report:** user steps forward/backward through the 7 built-in examples one at a time; each one shown is analyzed live, the same as a real upload would be.
2. The system analyzes the document (see 2.1). This step takes a perceptible moment; the user should see an indication that processing is underway.
3. **Branch — nothing recognized:** user sees an explanatory message (no report data, no crash). Flow ends here for this attempt; user may try a different file.
4. **Branch — results found:** user sees every recognized test result.
   - **If every result is Normal:** a single confirming message is shown.
   - **If one or more results are High/Low:** each abnormal result is available for the user to open and read its explanation (2.4); the user decides which, if any, to open.
5. **If this was a real upload (not a sample):** the report is silently added to the user's saved history at this point, and the user is told it was saved.

### 3.3 Reviewing history and trends
1. Signed-in user navigates to their history area.
2. **Branch — no saved history yet:** user is offered the option to load a sample history for a preview (2.11), or to go analyze a real report instead (3.2).
3. **Branch — saved history exists:**
   - User may pick any test that has 2+ recorded results and view its trend chart plus written summary (2.10). Picking a different eligible test updates both immediately.
   - User may browse the full list of past reports and expand any one to review it in full (2.9).
   - User may clear all of their history in one action (2.12) — irreversible, immediate.

### 3.4 Changing language
1. At any point, signed-in or not, the user selects a different language.
2. All interface text, test names, and explanations for anything currently on screen update to the new language immediately. Previously saved history is unaffected in storage — it simply displays in whichever language is currently selected when viewed.

### 3.5 Ending a session
1. Signed-in user chooses to sign out.
2. Access to their personal history and the rest of the app ends; they return to the landing/sign-in view.

---

## 4. Data & State

### 4.1 Core data entities
- **User** — identified by the email address associated with their sign-in. Not otherwise profiled; no other personal attributes are collected or stored about them.
- **Saved Report** — belongs to exactly one user; has an upload date and a source label; contains one or more Test Results.
- **Test Result** — belongs to exactly one Saved Report; has a test name/category, measured value, unit, the normal range it was checked against, a Normal/High/Low classification, and an urgency classification.
- **Test Catalog entry** — system-defined, not user-generated; defines a recognized test's name, category, normal range, unit, and the two pieces of explanatory content (low/high). Shared and identical for all users.
- **Language content set** — system-defined, not user-generated; the translated text for every interface label, test name, and explanation template, per supported language. Shared and identical for all users.

### 4.2 Relationships
- One User has many Saved Reports.
- One Saved Report has many Test Results.
- Every Test Result references exactly one Test Catalog entry (by test name) to obtain its display name, standard range, and explanatory content in whichever language is currently selected.

### 4.3 What persists vs. what is temporary
**Persists indefinitely, tied to the user's account, across separate visits and devices:**
- Saved Reports and their Test Results (until the user explicitly clears them).

**Temporary — reset at the start of each new visit:**
- Which language is currently selected.
- Which sample report is currently being viewed, and how far through the sample set the user has navigated.
- Any in-progress upload.
- Which past report or which explanation is currently expanded on screen.
- The results of a sample-report analysis (never persisted at all, at any point — see 2.7).

### 4.4 What triggers a state change
- Successful sign-in / sign-out.
- A real report is successfully analyzed → a new Saved Report and its Test Results are created.
- Loading sample history → the user's history is (re)populated with the fixed example dataset. (This action is only ever offered when the user's real history is already empty, so it cannot overwrite real data in normal use.)
- Clearing history → all of that user's Saved Reports and Test Results are permanently removed.
- Changing the selected language → affects only what is displayed, not any stored data.
- Navigating the sample browser → affects only what is currently displayed, nothing is stored.

---

## 5. External Integrations & APIs

- **Identity/sign-in provider:** a third-party account sign-in (Google) is used to establish who the user is. The app requests only enough permission to know the signed-in person's identity (name/email) — nothing further from their account.
- **Document text-reading capability:** the uploaded report's visual content is processed by a text-recognition capability that converts the image into readable text for the analysis step described in 2.1.
- **No live external content generation:** explanations are assembled from the app's own pre-written, pre-approved content bank (2.4) — no outside generative service is queried at the time a report is analyzed.
- **No other external services** are used: no outside medical database lookups, no email-sending, no payment processing, no analytics/tracking service.

**Data fetched vs. sent:**
- Nothing is fetched from a live external data source at the time a user analyzes a report — all reference/explanation content is part of the system itself.
- The uploaded document's content is passed to the text-recognition capability described above in order to extract its text.
- The user's identity claim (name/email) is received from the sign-in provider at login time; no other account data is requested or received.

---

## 6. Business Logic & Rules

- A value is **High** if above the upper bound of its test's normal range, **Low** if below the lower bound, otherwise **Normal**.
- Urgency is derived purely from how far outside the range a value falls (proportionally), independent of which specific test it is.
- Only High/Low results are individually explained; an all-Normal report yields one blanket confirming message instead.
- Explanations never assert a diagnosis; language stays possibility-based, and always closes with a recommendation to consult a doctor when a result is abnormal.
- Trend descriptions are strictly retrospective (see 2.10) — no forecasting logic exists or should be added without deliberately revisiting this rule.
- Value auto-correction (2.5) and reference-range cross-checking (2.6) are both deliberately conservative: they only override what was read from the document when the evidence for an error is very strong, and any such override is disclosed to the user rather than applied silently.
- A test needs at least two recorded results, for the same signed-in user, before it is offered as a trend.
- Sample data (demo reports, sample history) is fully isolated from and never mixed into real saved data.
- Personal history is strictly private to the account that created it; there is no mechanism, intentional or accidental, by which one user's saved data should be readable by another user.
- Document analysis always reads in the one fixed source language the test catalog is defined against, never the user's currently selected display language.

**Error conditions and expected handling:**
- Unrecognized/unreadable document → explanatory message, zero partial or fabricated results shown.
- Multi-page PDF → only page one is used; user is informed, not left to wonder.
- Sign-in cannot complete → clear explanatory message, not a blank or frozen screen.
- Nothing on a report matches the supported test catalog → same explanatory-message handling as an unrecognized document.

---

## 7. User Roles & Permissions

There is a single user role: **signed-in individual user.** There is no administrator role, no elevated/staff role, and no tiered permission levels in this specification.

Every signed-in user has identical capability: full use of upload/analysis, the sample browser, language switching, and their own history/trends. The only permission boundary in the system is **data ownership** — a user may only ever view, add to, or delete their own saved history, never another user's, regardless of how many people use the app.

Before signing in, capability is limited to viewing the landing view and initiating sign-in; no analysis, history, or saved data of any kind is accessible.

---

## 8. Edge Cases & Constraints

- Only image or PDF report files are accepted as input; other file types are not supported.
- Only the 24 tests in the defined catalog (2.2) are recognized; anything else present on a report is simply not extracted, even if the document is otherwise readable.
- Only printed/typed report text is supported; handwritten reports are out of scope.
- Only the first page of a multi-page PDF is analyzed.
- A test must appear in 2+ of a user's saved reports before it becomes trend-eligible; a single occurrence is not enough.
- The option to load sample history is withheld once a user has any real saved history, specifically to prevent it from ever being used to clobber real data.
- Value auto-correction only fires for one specific, narrow error pattern (an implausible ~10x-magnitude misread that a decimal-point correction would resolve) — it is intentionally not a general "fix anything that looks odd" mechanism, so that a genuinely severe real result is never reinterpreted as something safer-looking.
- Reference-range cross-checking only overrides a document's printed range when it is drastically different from the known standard — small, plausible lab-to-lab variation in a printed range is left alone.
- Clearing history is immediate and permanent, with no confirmation step and no undo — this should be treated as a deliberate design point to revisit if ever considered too easy to trigger by accident, not assumed to already have a safeguard.
- Translation coverage is complete for the main app experience but not yet extended to the sign-in screen's own short prompt text, which remains in the default language regardless of the language selected.

---

## 9. Performance & Experience Requirements

**Should feel instant:**
- Switching the selected language.
- Moving forward/backward through the sample report browser.
- Switching between the analysis view and the history/trends view.
- Expanding or collapsing an individual explanation or a past saved report.
- Selecting a different test to view its trend.

**Can tolerate a brief, clearly-communicated delay:**
- Analyzing a newly uploaded or newly viewed sample report (the read-and-interpret step) — the user should be shown that processing is underway rather than seeing nothing happen.

**Must-not-break scenarios:**
- Under no circumstance should one signed-in user ever see another signed-in user's saved history or reports.
- The app should never show a blank, frozen, or unexplained-error screen — every failure path (unreadable document, failed sign-in, unrecognized report) must resolve to an understandable message.
- A value the system is not confident it read correctly should never be silently presented as-is without disclosure — it is either corrected-and-flagged (2.5) or left as read, never silently altered without the auto-correction indicator.
- The general-information / not-a-substitute-for-medical-advice disclaimer must remain visible/accessible from every screen state, in every supported language, at all times.
