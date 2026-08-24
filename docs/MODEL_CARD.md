# Model Card — Metabolic Balance Index & Population Reference Engine

## What this is
An educational health-literacy feature that compares parsed lab values against
real-world population statistics and produces a 0-100 "Metabolic Balance Index".
It is **not** a diagnostic model and makes no disease predictions.

## Data source
- CDC NHANES 2017-2018 public-use laboratory files (DEMO_J, CBC_J, BIOPRO_J,
  GLU_J, TRIGLY_J, TCHOL_J, HDL_J, GHB_J, INS_J, HSCRP_J, FERTIN_J).
- ~5,000 measured participants per marker; fasting markers (glucose, insulin,
  triglycerides) come from NHANES fasting subsamples.
- Regenerate anytime: `python scripts/build_distributions.py` (cached downloads).

## Method
1. Per marker, per stratum (gender x age band 18-39 / 40-59 / 60+), we store:
   n, mean, SD, 2.5th / 50th / 97.5th percentiles, and a robust sigma (IQR/1.349).
2. Patient values are converted to robust z-scores against the matching stratum:
   `z = (value - p50) / sigma_robust` (falls back to population-average stats when
   gender/age are unknown, and to catalog reference ranges when a marker has no
   NHANES coverage - flagged as `rangeSource: "catalog"`).
3. Balance Index = `100 * (1 - 0.6 * mean(min(|z|/4, 1)))`, clipped to [10, 100].
   Every marker at its population median scores 100; every marker 4+ sigmas out
   drives that marker's penalty to saturation. The formula is deterministic and
   fully documented here - no hidden weights.
4. An Isolation Forest (100 trees, contamination 0.05, seed 42) is refit on
   1,500 z-score vectors resampled from the NHANES strata for the anomaly score.

## Known limitations (please read)
- Population percentiles are NOT clinical decision limits. A value outside the
  2.5-97.5 percentile band is statistically uncommon, not automatically pathological.
- NHANES reflects the non-institutionalized US population; other populations and
  ethnicities may differ.
- Glucose distributions include a mixed fed/fasted caveat in older cycles;
  the 2017-2018 build uses the dedicated fasting subsample (GLU_J).
- Markers without NHANES coverage this cycle (TSH panel, testosterone, B12,
  folate, vitamins D/A/E, iron panel beyond ferritin, etc.) fall back to static
  textbook ranges and are excluded from the population-stratified balance math.
- The Isolation Forest is fitted on resampled distribution parameters, not on
  raw patient rows (raw microdata is not redistributable). It adds smoothness to
  the anomaly score but no information beyond the stored statistics.
- This system has NOT been clinically validated, is not FDA-cleared or CE-marked,
  and must never be used for diagnosis, treatment decisions, or emergencies.

## Intended use
Portfolio demonstration of full-stack ML engineering: reproducible data
pipeline, stratified biostatistics, transparent scoring, and honest UX copy.
