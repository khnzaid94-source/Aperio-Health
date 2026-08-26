# Aperio Health — Easy Testing Guide (Plain-English Edition)

This guide is for someone with **zero technical knowledge**. You just need a browser,
some patience, and this document. You will click around the Aperio Health website and
confirm everything looks and behaves the way it should. Every step tells you exactly
what you should see, and what counts as a **FAIL** (something broken).

**Where to test:** https://aperio-health.onrender.com
**Total active testing time:** about 2 hours (one test needs 30 minutes of waiting — do other tests while you wait).

> This guide covers the exact same tests as the technical checklist
> (`docs/QA-BATTERY.md`) — just in everyday words.

---

## Before You Start (Prep) — ~10 minutes

### What you need

1. **A computer** with any modern browser (Chrome, Edge, or Firefox). Chrome is best.
   If you can, borrow a second browser (e.g. Firefox too) — some steps create
   throwaway accounts and it keeps things tidy to split them across browsers.
   A phone is handy only for photographing a paper lab report.
2. **The website address:** https://aperio-health.onrender.com
3. **Three demo login accounts.** They all use the password **demo1234**:

   | Name | Email | Password |
   |---|---|---|
   | Sarah Jenkins | sarah.jenkins@example.com | demo1234 |
   | David Chen | david.chen@example.com | demo1234 |
   | Maya Patel | maya.patel@example.com | demo1234 |

4. **At least one sample lab report file.** Look in the local folder called
   **`Sample Reports`** (inside the project folder). It contains:
   - `cbc-report-format.pdf` (blood count)
   - `kft-report-format.pdf` (kidney)
   - `lft-report-format.pdf` (liver)
   - `lipid-profile-report-format.pdf` (cholesterol)
   - `rbs-report-format.pdf` (blood sugar)

   Any lab report photo on your phone works too.
5. **A way to take screenshots** (on Windows: press the **PrtScn** key, or use the
   Snipping Tool; save pictures somewhere you can find them).

### Three things to know before your first click

- **The slow first load is NORMAL.** The website lives on a free server that "goes to
  sleep" when nobody uses it. The first page load after a break can take up to
  **60 seconds** and may show a "waking up…" message. That is not a bug. If it takes
  longer than ~90 seconds, that IS a problem — note it.
- **A "private window"** (Chrome calls it Incognito) is a browser window that forgets
  everything when closed. Open one with **Ctrl+Shift+N** in Chrome. It helps you test
  like a brand-new visitor. Use it unless a step says otherwise.
- **A "hard refresh"** forces the browser to fetch the freshest copy of the website.
  Do it by holding **Ctrl+Shift** and tapping **R**.

### Golden rules

- **Never actually delete** the demo accounts or David Chen's data (you WILL be asked
  to open delete screens — always press Cancel).
- When something fails: **take a screenshot**, write down the **step number** and the
  **browser you were using**. That's all we need.

---

## Section 1 — Is the Site Awake and Up to Date?
*Covers tech battery Section 0: Deploy currency · Estimated time: ~5 minutes*

This confirms you are testing the newest version of the site and that the sleepy
server wakes up properly.

1. Open a private/incognito window and go to https://aperio-health.onrender.com.
   → **You should see** either the landing page or a "waking up…" spinner first.
   The spinner may last up to 60 seconds, then the landing page appears.
   **FAIL:** an error page, a blank white screen lasting more than ~90 seconds, or a crash.
2. Once loaded, press **Ctrl+Shift+R** together (hard refresh — grabs the newest copy).
   → **You should see** the same landing page reload quickly, fully drawn (menu, text,
   buttons all present). **FAIL:** missing chunks, broken layout, or error messages.

> Note for the team lead only: engineers normally double-check the update using
> developer tools; a human tester just confirms the site loads cleanly after a hard
> refresh.

**Mark your results:**
- [ ] 1a. Sleepy-server wake-up loads fine: Pass ☐ Fail ☐
- [ ] 1b. Hard refresh shows a clean, complete page: Pass ☐ Fail ☐

---

## Section 2 — The Landing Page Speaks Your Language
*Covers tech battery Section 1: Landing page languages · Estimated time: ~15 minutes*

The landing page supports 10 languages. You'll spot-check four of them.

1. On the landing page (English), scroll to the area showing four feature cards
   (called "Core Pillars").
   → **You should see** four cards, EACH with its own paragraph of real description
   text under the title. **FAIL:** any card shows odd leftover code-like text such as
   `pillar1Desc` or `pillar2Desc` instead of sentences.
2. Find the language selector (usually top corner) and switch it to **Español**.
   → **You should see** the hero text, the four pillar cards, and the sign-in /
   sign-up popup ALL in Spanish. **FAIL:** any of those still in English.
3. Switch to **Français**.
   → **You should see** the same areas fully in French. **FAIL:** mixed English remains.
4. Switch to **हिन्दी (Hindi)**.
   → **You should see** everything in Hindi, and nowhere any raw code-style text such
   as `landing.heroTitle`. **FAIL:** you can read entries that look like
   `landing.something` — that means a translation is missing.
5. While still in Hindi, sign in with **sarah.jenkins@example.com** / **demo1234**.
   → **You should see** the inside of the app (Dashboard) STILL displayed in Hindi —
   your language choice carried over from the landing page.
   **FAIL:** the app suddenly switches back to English.

**Mark your results:**
- [ ] 2a. Four pillar cards have real English descriptions: Pass ☐ Fail ☐
- [ ] 2b. Spanish covers pillars, hero, sign-in popup: Pass ☐ Fail ☐
- [ ] 2c. French covers the same: Pass ☐ Fail ☐
- [ ] 2d. Hindi complete, no code-like `landing.*` text: Pass ☐ Fail ☐
- [ ] 2e. Language choice survives signing in: Pass ☐ Fail ☐

---

## Section 3 — Creating an Account, Wrong Passwords, and Logging Out
*Covers tech battery Section 2: Auth · Estimated time: ~10 minutes*

1. Sign out if needed (find the logout option in the left sidebar under Profile, or
   your account menu), then on the landing page choose **Sign Up**.
2. Register a brand-new throwaway account — invent an email like
   `qa.tester.aug26@example.com`, any password you'll remember (8+ characters).
   → **You should see** the account created and you land inside the app (or straight
   into the first-time setup wizard — that's Section 4's business).
   **FAIL:** an error, a frozen screen, or a crash.
3. Sign out, then try signing in again with that new email but a **wrong password**.
   → **You should see** a clear, polite error like "incorrect email or password."
   **FAIL:** the page freezes, goes blank, shows scary technical gibberish, or lets
   you in anyway.
4. Now sign in correctly, then sign out again, and close the private window entirely.
   Reopen a private window and return to the site.
   → **You should see** the landing page, NOT your logged-in app. The browser should
   have forgotten you completely — no personal details peek through anywhere.
   **FAIL:** reopening the site drops you straight into the old account.

**Mark your results:**
- [ ] 3a. New account registers without errors: Pass ☐ Fail ☐
- [ ] 3b. Wrong password gives an honest error, no crash: Pass ☐ Fail ☐
- [ ] 3c. After logging out, nothing of your session lingers: Pass ☐ Fail ☐

---

## Section 4 — The First-Time Setup Wizard (In Hindi or Marathi)
*Covers tech battery Section 3: Onboarding wizard · Estimated time: ~10 minutes*

New users get a short setup interview: name → date of birth → gender → health
conditions → medications → consent. Use the throwaway account from Section 3. If it
already finished setup, register another fresh account first (see Section 3, step 2).

1. Before signing in, set the landing-page language to **Hindi** (or **Marathi**) so
   the whole wizard runs in that language.
2. Complete the entire wizard in that language, screen by screen.
   → **You should see** every question, button, AND the health-condition names
   (like Diabetes या मधुमेह) written in your chosen language.
   **FAIL:** any screen, button, or condition name still appears in English, or
   appears as code-like text such as `onb.cond_3`.
3. At any step, look at the little progress pills/steps at the top and try clicking
   a LATER step you haven't reached yet.
   → **You should see** nothing happen — you cannot jump ahead past the furthest
   step you've completed. **FAIL:** clicking forward skips unfinished questions.
4. Finish the wizard all the way to the end.
   → **You should see** a completion moment (message or arrival at the Dashboard),
   and your answers saved. **FAIL:** the wizard loops forever or loses your answers.

**Mark your results:**
- [ ] 4a. Full wizard completable in Hindi/Marathi: Pass ☐ Fail ☐
- [ ] 4b. Progress pills block skipping ahead: Pass ☐ Fail ☐
- [ ] 4c. Condition names are properly translated: Pass ☐ Fail ☐

---

## Section 5 — The Dashboard (Your Home Screen)
*Covers tech battery Section 4: Dashboard · Estimated time: ~15 minutes*

1. Sign in as **david.chen@example.com** / **demo1234** (use English for now).
   → **You should see** a welcome banner at the top and several small stat boxes
   (called KPI widgets — quick numbers like report counts).
   **FAIL:** missing banner, empty/broken stat boxes, error text.
2. Still as David, look for a badge showing his **4 saved reports** (on the History
   & Trends entry in the left sidebar or on the Dashboard).
   → **You should see** the number 4 indicated somewhere sensible.
   **FAIL:** no badge, or a different number with no explanation.
3. Open the **Journal** area for David.
   → **You should see** existing cards already filled in covering at least these
   three kinds: a medication, a supplement, and a lifestyle entry (like exercise or
   sleep). **FAIL:** Journal is empty for David.
4. Switch the language selector to any non-English language.
   → **You should see** the welcome banner AND the small stat boxes translate into
   that language. **FAIL:** they stay in English.
5. **Demo-data trick (David only):** clear David's history (in History & Trends use
   "Clear All"), then SIGN OUT, then sign back in as David.
   → **You should see** David's sample reports and journal cards BACK AGAIN — the
   demo account refills itself after re-login. **FAIL:** David's data stays deleted.
6. **Your own data behaves differently (good!):** on your throwaway account, delete
   its history (or everything you added), then refresh the page (F5).
   → **You should see** it STAYS empty — your deletion was real and permanent.
   **FAIL:** your cleared items mysteriously return after refresh.

**Mark your results:**
- [ ] 5a. Welcome banner + stat boxes appear: Pass ☐ Fail ☐
- [ ] 5b. David shows 4 saved reports badge: Pass ☐ Fail ☐
- [ ] 5c. David's Journal has medication + supplement + lifestyle cards: Pass ☐ Fail ☐
- [ ] 5d. Banner and stat boxes translate: Pass ☐ Fail ☐
- [ ] 5e. David's demo data refills after sign-out/sign-in: Pass ☐ Fail ☐
- [ ] 5f. Throwaway account's deletions stay deleted: Pass ☐ Fail ☐

---

## Section 6 — Uploading Reports and Reading Results
*Covers tech battery Section 5: Upload & Analyze · Estimated time: ~20 minutes*

Use Sarah Jenkins (sarah.jenkins@example.com) or your throwaway account.

1. Click **Upload** in the left sidebar.
   → **You should see** a box inviting you to drop files or browse for them, plus an
   option to paste report text instead. **FAIL:** nothing happens or an error appears.
2. Find ONE lab report as a **photo** (photograph a paper report, or use any report
   image) and upload just that one photo.
   → **You should see** the app examine the photo and show a **quality-check strip**
   above/near the result telling you how readable the image is. Its heading must be
   written in YOUR CURRENT LANGUAGE. **FAIL:** the strip's title is stuck in English
   (reading exactly "Computer Vision Quality Diagnostics") while the rest of the app
   is in another language.
3. Now start an upload with **two or more files at once** (select multiple PDFs from
   `Sample Reports`, e.g. the CBC and Lipid ones).
   → **You should see** progress wording like "Processing file 1 of 2", "file 2 of 2"
   — real sentences with real numbers. **FAIL:** you see machine leftovers like
   `up.processingNofM`.
4. Open a finished report in the **Analyze** view (results screen).
   → **You should see**: results grouped into levels/tiers (most important findings
   first); filter buttons; small symptom tag buttons ("chips"); and the FIRST group
   (Tier 1) already opened/expanded, with the others collapsed.
   **FAIL:** tiers have untranslated headers, filters/chips are in the wrong
   language, or nothing is expanded so you face a wall of closed sections.

**Mark your results:**
- [ ] 6a. Photo report shows a quality strip in the current language: Pass ☐ Fail ☐
- [ ] 6b. Multi-file upload says "Processing file X of Y" properly: Pass ☐ Fail ☐
- [ ] 6c. Analyze screen: tiers, filters, symptom chips localized; Tier 1 pre-opened: Pass ☐ Fail ☐

---

## Section 7 — History & Trends (The Busiest Section)
*Covers tech battery Section 6: History & Trends · Estimated time: ~25 minutes*

Stay signed in as Sarah or your throwaway account. Make sure you have at least two
saved reports first (upload more if needed).

### Part A — Layout and tabs

1. Open **History & Trends** from the left sidebar on a normal laptop-sized window
   (not fullscreen-cropped, not tiny). Look at the Charts/Trends sub-tab.
   → **You should see** the chart AND its written summary side by side, both fully
   visible WITHOUT scrolling on a standard laptop screen.
   **FAIL:** you must scroll down/sideways to find the summary text next to the chart.
2. Confirm the three sub-tabs exist: **Charts (Trends)**, **Compare**, and
   **🗂️ Your Saved Reports**.
   → **You should see** all three, and clicking Saved Reports shows your list of
   saved visits. **FAIL:** a tab missing, or Saved Reports appears empty when you
   know reports exist.

### Part B — Chart captions and Compare

3. On the chart, check the caption describing the highlighted band/range on the graph.
   → **You should see** the caption in your current language.
   **FAIL:** the caption alone is hardcoded English while everything else is translated.
4. Open the **Compare** sub-tab, pick two visits/dates (A and B) to compare.
   → **You should see** a comparison table listing how values changed between the two
   visits (up/down arrows or similar "delta" markers), plus little trend badges
   (improving/worsening) — all in your current language.
   **FAIL:** table empty, broken, or badges in the wrong language.
   *Known quirk, NOT a fail:* the longer explanatory SENTENCES under the badges may
   still be English — the team already knows and accepts this.

### Part C — Deleting propagates instantly

5. Delete ONE saved visit from the Saved Reports list (use its delete control;
   confirm if asked).
   → **You should see** the list shrink IMMEDIATELY. Then click over to **Analyze**,
   the **Dashboard**, the **Charts/Trends** tab, and any panel showing the extracted
   report text: the deleted visit appears NOWHERE, all without refreshing the page.
   **FAIL:** the deleted visit still shows up in ANY of those places until you refresh.
6. Use **Clear All History**.
   → **You should see** the **Analyze** tab immediately return to its empty state with
   the "please upload" invitation — no refresh needed.
   **FAIL:** Analyze still displays old results until you manually refresh.
7. Repeat steps 5–6 on your THROWAWAY account, then do a hard refresh (Ctrl+Shift+R).
   → **You should see** everything still gone after the refresh — the deletions are
   truly saved on the server, not just hidden. **FAIL:** deleted items resurrect.

### Part D — Losing internet mid-action

8. Start deleting something, but FIRST turn off your Wi‑Fi (or unplug the network
   cable) so the app can't reach the server.
   → **You should see** a yellowish/amber warning notice saying, in effect, the
   server did not confirm the deletion.
   **FAIL:** silence — the app pretends it worked with no warning.
   Turn Wi‑Fi back on when done.

**Mark your results:**
- [ ] 7a. Chart + summary fit side-by-side on a laptop: Pass ☐ Fail ☐
- [ ] 7b. All three sub-tabs present, Saved Reports visible: Pass ☐ Fail ☐
- [ ] 7c. Chart band caption localized: Pass ☐ Fail ☐
- [ ] 7d. Compare table + trend badges localized: Pass ☐ Fail ☐
- [ ] 7e. Single delete vanishes everywhere instantly: Pass ☐ Fail ☐
- [ ] 7f. Clear All empties Analyze immediately: Pass ☐ Fail ☐
- [ ] 7g. Throwaway deletions survive hard refresh: Pass ☐ Fail ☐
- [ ] 7h. Offline delete shows amber warning: Pass ☐ Fail ☐

---

## Section 8 — Journal (Daily Log Entries)
*Covers tech battery Section 7: Journal · Estimated time: ~5 minutes*

Any account works here; use your current one.

1. Open **Journal** from the left sidebar and click the button to log a new item
   (it may read "Log New Item").
   → **You should see** a slide-out panel (drawer) for adding an entry, with all its
   labels and hint texts (the grey placeholder examples inside empty fields) in your
   current language. **FAIL:** labels or hints in the wrong language.
2. Add one medication entry, one supplement entry, and one lifestyle/context entry
   (fill the required fields; save each).
   → **You should see** each one appear as a card/list row in the Journal.
   **FAIL:** saving does nothing, or entries vanish.
3. Delete one of the entries you just made.
   → **You should see** a confirmation pop-up asking "are you sure?" — WRITTEN IN YOUR
   CURRENT LANGUAGE. Confirm it, and the entry disappears.
   **FAIL:** the confirmation is in English while the rest isn't, or there's no
   confirmation at all.

**Mark your results:**
- [ ] 8a. Entry drawer labels/placeholders localized: Pass ☐ Fail ☐
- [ ] 8b. Med/supplement/lifestyle entries can be added: Pass ☐ Fail ☐
- [ ] 8c. Delete confirmation dialog translated: Pass ☐ Fail ☐

---

## Section 9 — Profile (Your Account Settings)
*Covers tech battery Section 8: Profile · Estimated time: ~10 minutes*

⚠️ Use your **throwaway account** here — NEVER run destructive steps on the shared
demo accounts.

1. Open **Profile** and find the card listing current medications & supplements.
   → **You should see** its heading in your current language.
   **FAIL:** the heading is stuck in English reading exactly "Current Medications &
   Supplements" while the rest of the app is translated.
2. Use **Change Password**. Enter your current password and a new one, submit.
   → **You should see** a brief success pop-up bubble (a "toast") in your current
   language confirming the change. Change it back afterwards so you don't forget!
   **FAIL:** success message in the wrong language, or no feedback at all.
3. Click **Export Data** (download my information).
   → **You should see** your browser download a file ending in `.json`
   (a machine-readable data file — if you open it, it looks like code soup; that's
   normal and fine). **FAIL:** nothing downloads or an error appears.
4. Click **Delete Account**, but STOP at the confirmation.
   → **You should see** a confirmation dialog written in your current language asking
   if you're really sure. **Press Cancel — do not finish the deletion!**
   **FAIL:** dialog untranslated, or worse, deletion happens without asking.

**Mark your results:**
- [ ] 9a. Medications card heading localized: Pass ☐ Fail ☐
- [ ] 9b. Password-change success toast localized: Pass ☐ Fail ☐
- [ ] 9c. Export downloads a .json file: Pass ☐ Fail ☐
- [ ] 9d. Delete-account confirmation translated (and cancelled safely): Pass ☐ Fail ☐

---

## Section 10 — About Page (Biomarker Catalog)
*Covers tech battery Section 9: About · Estimated time: ~5 minutes*

1. Click **About** in the left sidebar.
   → **You should see** a trust/safety grid, disclaimers (legal-ish notices), and a
   searchable catalog table of biomarkers (the substances labs measure) — all in your
   current language. **FAIL:** big blocks stuck in English or missing entirely.
2. Type a biomarker name (try `glucose` or `hemoglobin`) into the catalog's search box.
   → **You should see** the table filter live as you type — only matching rows remain.
   **FAIL:** typing does nothing until you press Enter-and-reload, or filtering breaks.
3. In the trust grid, look at the fourth card's badge/label.
   → **You should see** the words **"Private Account Isolation"** (honest phrasing
   about how accounts are separated). **FAIL:** exaggerated marketing wording
   promising something stronger than reality.

**Mark your results:**
- [ ] 10a. Trust grid, disclaimers, catalog localized: Pass ☐ Fail ☐
- [ ] 10b. Catalog search filters as you type: Pass ☐ Fail ☐
- [ ] 10c. Card 4 badge reads "Private Account Isolation": Pass ☐ Fail ☐

---

## Section 11 — Everything Else (Cross-Cutting Checks)
*Covers tech battery Section 10: Cross-cutting · Estimated time: ~20 min active, plus one 30-minute wait you can overlap with lunch*

1. **Session ending politely:** sessions expire after 30 minutes of inactivity. Leave
   the app open and untouched for 30+ minutes (great time for a coffee), then click
   anything.
   → **You should see** a friendly banner/message (on the landing page) explaining
   your session ended and asking you to sign in again — IN THE LANGUAGE YOU WERE USING.
   **FAIL:** the app silently dumps you on the landing page with no explanation.
2. **No doubled icons:** open **History & Trends** and look at the sub-tab pills.
   → **You should see** each icon/picture appearing exactly ONCE per pill.
   Then open **Journal** and find the "Log New Item" button.
   → It should show its icon exactly ONCE. **FAIL:** any doubled/repeated emoji or
   icon sitting side-by-side.
3. **PDF export:** export/download any report as PDF from the app.
   → **You should see** the PDF open and its text readable.
   *Note:* the PDF's body text being English-only is intentional for now — NOT a fail.
   **FAIL:** download fails, file won't open, or pages are garbled/blank.
4. **No hidden errors:** press **F12** (opens the browser's developer tools — a panel
   engineers use; you're only peeking). Click the **Console** tab, then casually use
   the app for a couple of minutes across pages and languages.
   → **You should see** no growing pile of bright RED error text. A few warnings in
   yellow/grey are acceptable. **FAIL:** repeated red error messages. Close the panel
   with F12 again.
5. **Language sticks at goodbye:** while using the app in a non-English language,
   sign out.
   → **You should see** the landing page come back IN THAT SAME language.
   **FAIL:** landing resets to English.

**Mark your results:**
- [ ] 11a. Session-end banner appears, translated: Pass ☐ Fail ☐
- [ ] 11b. No doubled icons on Trends pills or Journal button: Pass ☐ Fail ☐
- [ ] 11c. PDF export opens and is readable: Pass ☐ Fail ☐
- [ ] 11d. No red errors in Console during use: Pass ☐ Fail ☐
- [ ] 11e. Sign-out returns landing in the same language: Pass ☐ Fail ☐

---

## Final Scoreboard

Fill one row per section. Count your Pass/Fail marks from the checklists above.

| Section | What it covered | Pass | Fail |
|---|---|---|---|
| 1 | Site awake & up to date | ☐ | ☐ |
| 2 | Landing page languages | ☐ | ☐ |
| 3 | Sign-up, wrong password, logout | ☐ | ☐ |
| 4 | First-time setup wizard | ☐ | ☐ |
| 5 | Dashboard | ☐ | ☐ |
| 6 | Upload & Analyze | ☐ | ☐ |
| 7 | History & Trends | ☐ | ☐ |
| 8 | Journal | ☐ | ☐ |
| 9 | Profile | ☐ | ☐ |
| 10 | About page | ☐ | ☐ |
| 11 | Everything else | ☐ | ☐ |

Date tested: ____________ · Sections passed: ____ / 11 · Total individual checks failed: ______

---

## How to Report a Problem

Found a FAIL? Do these three things — that's all the team needs:

1. **Take a screenshot** of the broken screen *at the moment it fails*
   (PrtScn key or Snipping Tool on Windows).
2. **Write down the step number** where it failed (for example: "Section 7, step 5").
3. **Note which browser** you were using (for example: "Chrome, version shown under
   Help → About"; or "Safari on iPhone").

Send those three things — plus one sentence on what you expected versus what you saw —
to your team lead or paste them into the team's issue tracker. One report per problem.
Thank you for testing!
