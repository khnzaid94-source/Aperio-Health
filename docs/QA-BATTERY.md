# Aperio Health — Owner Manual QA Battery

> Run against **prod** (https://aperio-health.onrender.com) in an incognito window.
> Suggested browsers: Chrome desktop + one mobile browser. Tick each box as you go.
> NOTE: run this AFTER the sweep-fix commit is pushed and deployed (verify footer/version or asset hash changed).

## 0. Deploy currency
- [ ] Prod serves the NEW bundle (hard-refresh Ctrl+Shift+R; DevTools → Network → `index-*.js` hash differs from `Da3MC_8v`)
- [ ] Cold start shows "waking up…" state, then loads

## 1. Landing page — all 10 languages spot-check
- [ ] EN: 4 "Core Pillars" cards show real description text under each title (**bug fix check: must NOT read `pillar1Desc` etc.**)
- [ ] ES: pillars, hero, auth modal fully Spanish
- [ ] FR: same
- [ ] HI: same; no raw `landing.*` keys visible anywhere
- [ ] Language selector on landing persists choice into post-login app

## 2. Auth
- [ ] Register new throwaway account (email/password)
- [ ] Wrong password → honest error, no crash
- [ ] Logout → cache wiped (`aperio_*` keys gone from localStorage)

## 3. Onboarding wizard
- [ ] Complete in HI or MR end-to-end (name → DOB → gender → conditions → meds → consent)
- [ ] Step pills cannot skip ahead beyond maxCompletedStep
- [ ] Condition labels translated (uses `onb.cond_*` keys)

## 4. Dashboard
- [ ] Welcome banner + KPI widgets localized (spot-check one non-EN language)
- [ ] Demo account David Chen: 2 saved reports badge visible

## 5. Upload & Analyze
- [ ] Upload ONE photo report → CV Quality strip header localized (**fix check: not English-only "Computer Vision Quality Diagnostics"**)
- [ ] Upload 2+ files at once → batch progress reads "Processing file X of Y" (**fix check: must NOT read `up.processingNofM`**)
- [ ] Analyze view: tier headers, filters, symptom chips localized; Tier-1 expanded by default

## 6. History & Trends
- [ ] Three tabs present: Trends / Compare / 🗂️ Your Saved Reports (Saved Reports list VISIBLE via tab)
- [ ] Trend chart band caption localized (**fix check: not hardcoded English caption**)
- [ ] Compare workspace: select visits A/B; delta table renders; trajectory badges localized
- [ ] Known accepted gap: trajectory *explanation* sentences still English (documented Scope B)

## 7. Journal
- [ ] Add medication/supplement/context entries; drawer labels, placeholders, delete confirms localized
- [ ] Delete entry → confirm dialog translated

## 8. Profile
- [ ] Medications card label localized (**fix check: not hardcoded "Current Medications & Supplements"**)
- [ ] Change password → success toast localized
- [ ] Export data JSON downloads; delete-account flow shows translated confirm

## 9. About
- [ ] Trust grid, disclaimers, catalog table localized; search filter works with `{query}` substitution
- [ ] Card 4 badge reads "Private Account Isolation" (honest wording)

## 10. Cross-cutting
- [ ] PDF export opens; content readable (PDF body is English-by-design for now)
- [ ] No console errors during a full pass in any language
- [ ] Sign out from a non-EN session → landing returns in that language

## Result
- Date: ______ · Pass count: ___/___ · Issues found: (file notes below)
