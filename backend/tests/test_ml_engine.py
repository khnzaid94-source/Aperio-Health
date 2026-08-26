"""Core-accuracy unit tests for ml_engine.py (Phase 9.2).

Deterministic math coverage on a synthetic distribution fixture:
robust z-scores, Balance Index weights/saturation/badges, stratum
selection + fallbacks, non-numeric guarding, lazy forest init, and
risk-cluster rules.
"""

import json
import os
import sys

import pytest

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BACKEND_DIR)
os.chdir(BACKEND_DIR)

from ml_engine import ClinicalMLEngine, get_ml_engine  # noqa: E402
from population import (  # noqa: E402
    PopulationDistributions,
    age_from_dob,
    resolve_age_band,
    resolve_sex,
)

SYNTHETIC_DISTRIBUTIONS = {
    "_meta": {"source": "test fixture"},
    "mk_center_fallback_mean": {"all": {"18+": {"mean": 14.0, "sigma_robust": 1.0}}},
    "mk_spread_fallback_sd": {"all": {"18+": {"p50": 50.0, "sd": 2.0}}},
    "mk_unit_spread": {"all": {"18+": {"p50": 10.0}}},
    "mk_sex_specific": {
        "sex": {"M": {"18-39": {"p50": 100.0, "sigma_robust": 10.0}}},
        "all": {"18+": {"p50": 105.0, "sigma_robust": 12.0}},
    },
}


@pytest.fixture(scope="module")
def engine(tmp_path_factory):
    path = tmp_path_factory.mktemp("dists") / "distributions.json"
    path.write_text(json.dumps(SYNTHETIC_DISTRIBUTIONS), encoding="utf-8")
    return ClinicalMLEngine(PopulationDistributions(path))


def _result(test_id, value):
    return {
        "testId": test_id,
        "measuredValue": value,
        "unit": "",
        "referenceMin": 0,
        "referenceMax": 1,
    }


def _analyze(engine, pairs, ctx=None):
    results = [_result(t, v) for t, v in pairs]
    return engine.analyze_report_ml(results, ctx)


MALE_30 = {"gender": "Male", "age": 30}


def test_z_score_zero_at_population_median(engine):
    ins = _analyze(engine, [("mk_center_fallback_mean", 14.0)], MALE_30)
    assert ins["z_scores"]["mk_center_fallback_mean"] == 0.0


def test_z_score_scales_linearly_and_rounds_to_two_decimals(engine):
    ins = _analyze(engine, [("mk_center_fallback_mean", 16.0)], MALE_30)
    assert ins["z_scores"]["mk_center_fallback_mean"] == 2.0
    ins = _analyze(engine, [("mk_center_fallback_mean", 13.55)], MALE_30)
    assert ins["z_scores"]["mk_center_fallback_mean"] == -0.45


def test_balance_index_formula_exact_for_single_marker(engine):
    z = 2.0
    expected = round(100 * (1 - 0.6 * min(abs(z) / 4.0, 1.0)))
    ins = _analyze(engine, [("mk_center_fallback_mean", 16.0)])
    assert ins["balance_index"] == expected == 70


def test_balance_index_penalties_average_across_markers(engine):
    ins = _analyze(engine, [("mk_center_fallback_mean", 14.0), ("mk_sex_specific", 140.0)], MALE_30)
    assert ins["z_scores"] == {"mk_center_fallback_mean": 0.0, "mk_sex_specific": 4.0}
    assert ins["balance_index"] == 70


def test_penalty_saturates_at_four_sigma(engine):
    ins = _analyze(engine, [("mk_center_fallback_mean", 30.0)])
    assert ins["z_scores"]["mk_center_fallback_mean"] == 16.0
    assert ins["balance_index"] == 40


def test_balance_badges_match_thresholds(engine):
    optimal = _analyze(engine, [("mk_center_fallback_mean", 14.0)])
    assert (optimal["balance_index"], optimal["balance_status"], optimal["balance_badge"]) == (
        100,
        "Optimal Biomarker Balance",
        "Optimal",
    )
    moderate = _analyze(engine, [("mk_center_fallback_mean", 16.0)])
    assert (moderate["balance_badge"], moderate["balance_status"]) == (
        "Moderate",
        "Mild Multi-Marker Variance",
    )
    high = _analyze(engine, [("mk_center_fallback_mean", 30.0)])
    assert (high["balance_badge"], high["balance_status"]) == (
        "High Variance",
        "Significant Multi-System Variation",
    )


def test_balance_index_clipped_to_floor_and_ceiling_bounds(engine):
    extreme = _analyze(
        engine,
        [(k, 10_000.0) for k in SYNTHETIC_DISTRIBUTIONS if not k.startswith("_")],
    )
    assert 10 <= extreme["balance_index"] <= 100
    assert extreme["balance_index"] >= 40


def test_non_numeric_measured_value_excluded_from_scoring(engine):
    ins = _analyze(engine, [("mk_center_fallback_mean", "abc"), ("mk_sex_specific", 100.0)], MALE_30)
    assert "mk_center_fallback_mean" not in ins["z_scores"]
    assert ins["markers_with_population_data"] == 1
    assert ins["balance_index"] == 100


def test_missing_population_stats_excluded_from_penalties(engine):
    ins = _analyze(engine, [("totally_unknown_marker", 5.0), ("mk_sex_specific", 100.0)], MALE_30)
    assert ins["analyzed_markers_count"] == 1
    assert ins["markers_with_population_data"] == 1


def test_center_falls_back_to_mean_then_zero(engine):
    ins = _analyze(engine, [("mk_center_fallback_mean", 15.0)])
    assert ins["z_scores"]["mk_center_fallback_mean"] == 1.0
    ins = _analyze(engine, [("mk_unit_spread", 12.0)])
    assert ins["z_scores"]["mk_unit_spread"] == 2.0


def test_spread_falls_back_to_sd_then_one(engine):
    ins = _analyze(engine, [("mk_spread_fallback_sd", 54.0)])
    assert ins["z_scores"]["mk_spread_fallback_sd"] == 2.0
    ins = _analyze(engine, [("mk_unit_spread", 12.0)])
    assert ins["z_scores"]["mk_unit_spread"] == 2.0


def test_sex_specific_stats_preferred_over_population_average(engine, monkeypatch):
    male = engine.population.stats_for("mk_sex_specific", "M", "18-39")
    assert male["stratum"] == "M 18-39"
    assert male["p50"] == 100.0
    fallback = engine.population.stats_for("mk_sex_specific", None, None)
    assert fallback["stratum"] == "adults 18+ (population average)"
    assert fallback["p50"] == 105.0
    female_missing_stratum = engine.population.stats_for("mk_sex_specific", "F", "60+")
    assert female_missing_stratum["p50"] == 105.0


def test_patient_stratum_labels(engine):
    assert _analyze(engine, [], MALE_30)["patient_stratum"] == "M 18-39"
    assert _analyze(engine, [], {"gender": "Female", "age": 67})["patient_stratum"] == "F 60+"
    assert _analyze(engine, [], {"gender": "Male"})["patient_stratum"] == "M"
    assert _analyze(engine, [], {"age": 45})["patient_stratum"] == "40-59"
    assert _analyze(engine, [], None)["patient_stratum"] == "population average"


def test_dob_derived_age_band_in_stratum(engine):
    ctx = {"gender": "Male", "date_of_birth": "1990-06-15"}
    assert _analyze(engine, [], ctx)["patient_stratum"] == "M 18-39"


def test_resolve_age_band_boundaries():
    assert resolve_age_band(None) is None
    assert resolve_age_band(17) == "18-39"
    assert resolve_age_band(18) == "18-39"
    assert resolve_age_band(39) == "18-39"
    assert resolve_age_band(40) == "40-59"
    assert resolve_age_band(59) == "40-59"
    assert resolve_age_band(60) == "60+"
    assert resolve_age_band(999) == "60+"


def test_resolve_sex_normalization():
    assert resolve_sex("Male") == "M"
    assert resolve_sex("MALE") == "M"
    assert resolve_sex("m") == "M"
    assert resolve_sex("Female") == "F"
    assert resolve_sex("F") == "F"
    assert resolve_sex("Non-binary") is None
    assert resolve_sex("") is None
    assert resolve_sex(None) is None


def test_age_from_dob_guards():
    assert age_from_dob(None) is None
    assert age_from_dob("") is None
    assert age_from_dob("not-a-date") is None
    assert isinstance(age_from_dob("1990-06-15"), int)


def test_forest_is_lazy_singleton_per_engine(engine):
    fresh = ClinicalMLEngine(engine.population)
    assert fresh._forest is None
    forest = fresh.forest
    assert forest is not None
    assert fresh.forest is forest


def test_get_ml_engine_returns_process_wide_singleton():
    assert get_ml_engine() is get_ml_engine()


def test_risk_cluster_metabolic_requires_both_axes():
    clusters = ClinicalMLEngine._detect_risk_clusters({"fbs": 110.0})
    assert clusters == []
    clusters = ClinicalMLEngine._detect_risk_clusters({"fbs": 110.0, "hdl": 35.0})
    assert [c["name"] for c in clusters] == ["Blood Sugar & Cholesterol Relationship"]
    clusters = ClinicalMLEngine._detect_risk_clusters({"hba1c": 6.0, "triglycerides": 200.0})
    assert [c["name"] for c in clusters] == ["Blood Sugar & Cholesterol Relationship"]


def test_risk_cluster_metabolic_marker_list_reflects_available_inputs():
    clusters = ClinicalMLEngine._detect_risk_clusters({"fbs": 110.0, "triglycerides": 200.0})
    assert clusters[0]["markers"] == ["fbs", "triglycerides"]


def test_risk_cluster_iron_deficiency_patterns():
    hb_ferritin = ClinicalMLEngine._detect_risk_clusters({"hemoglobin": 10.0, "ferritin": 8.0})
    hb_hct = ClinicalMLEngine._detect_risk_clusters({"hemoglobin": 10.0, "hematocrit": 33.0})
    assert [c["name"] for c in hb_ferritin] == ["Iron Stores & Oxygen Delivery Pattern"]
    assert [c["name"] for c in hb_hct] == ["Iron Stores & Oxygen Delivery Pattern"]
    lone_low_hb = ClinicalMLEngine._detect_risk_clusters({"hemoglobin": 10.0})
    assert lone_low_hb == []


def test_risk_cluster_liver_kidney_thyroid_pairs():
    liver = ClinicalMLEngine._detect_risk_clusters({"alt": 60.0, "ast": 55.0})
    kidney = ClinicalMLEngine._detect_risk_clusters({"creatinine": 1.5, "bun": 25.0})
    thyroid = ClinicalMLEngine._detect_risk_clusters({"tsh": 5.0, "t4": 4.0})
    assert [c["name"] for c in liver] == ["Liver Enzyme Activity Pattern"]
    assert [c["name"] for c in kidney] == ["Kidney Filtration Balance Pattern"]
    assert [c["name"] for c in thyroid] == ["Thyroid Hormone Balance Pattern"]


def test_risk_clusters_empty_for_healthy_panel_and_non_numeric_values():
    healthy = ClinicalMLEngine._detect_risk_clusters(
        {
            "fbs": 90.0,
            "hdl": 50.0,
            "hemoglobin": 14.0,
            "ferritin": 60.0,
            "alt": 30.0,
            "ast": 25.0,
            "creatinine": 0.9,
            "bun": 15.0,
            "tsh": 2.0,
            "t4": 7.0,
        }
    )
    assert healthy == []
    non_numeric = ClinicalMLEngine._detect_risk_clusters({"fbs": "high", "hdl": "ok"})
    assert non_numeric == []


def test_population_distribution_helpers(tmp_path):
    empty = PopulationDistributions(tmp_path / "missing.json")
    assert empty.raw == {}
    assert empty.has_data() is False
    assert empty.source == "catalog reference ranges"
    assert empty.marker_ids() == []

    meta_only = tmp_path / "meta_only.json"
    meta_only.write_text(json.dumps({"_meta": {"source": "x"}}), encoding="utf-8")
    assert PopulationDistributions(meta_only).has_data() is False

    real = PopulationDistributions()
    assert real.has_data() is True
    ids = real.marker_ids()
    assert ids == sorted(ids)
    assert all(not i.startswith("_") for i in ids)
