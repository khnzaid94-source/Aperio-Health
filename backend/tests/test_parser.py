"""Gender-aware parser + population-statistics regression suite.

Mirrors the Vitest suite in src/utils/__tests__/parser.test.ts so the Python
and TypeScript parsers stay provably in sync.
"""

import os
import sys

import pytest

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BACKEND_DIR)
os.chdir(BACKEND_DIR)

from ocr import parse_report_text_python  # noqa: E402
from ml_engine import get_ml_engine  # noqa: E402

MALE_30 = {"gender": "Male", "age": 30}
FEMALE_30 = {"gender": "Female", "age": 30}


def by_id(results):
    return {r["testId"]: r for r in results}


def test_standard_panel():
    text = (
        "LABORATORY REPORT\nSpecimen Date: 08/20/2026\n"
        "Hemoglobin (Hb)      13.5 g/dL   (Range: 12.0 - 16.0)\n"
        "White Blood Cell Count  7.2 x10^3/uL (4.0 - 11.0)\n"
        "Total Cholesterol     210 mg/dL   (100 - 200)\n"
        "Hemoglobin A1c        6.9 %\n"
    )
    r = by_id(parse_report_text_python(text))
    assert r["hemoglobin"]["measuredValue"] == 13.5
    assert r["wbc"]["measuredValue"] == 7.2
    assert r["cholesterol"]["classification"] == "High"
    assert r["hba1c"]["measuredValue"] == 6.9


def test_rejects_non_medical_text():
    text = "The quick brown fox jumps over 10k copies of p.m. notes"
    assert parse_report_text_python(text) == []


def test_decimal_drop_autocorrect():
    r = by_id(parse_report_text_python("Serum Creatinine 7.5 mg/dL (0.6 - 1.2)"))
    assert r["creatinine"]["isAutoCorrected"] is True
    assert r["creatinine"]["measuredValue"] == pytest.approx(0.75)


def test_wbc_never_decimal_corrected():
    r = by_id(parse_report_text_python("Total Leukocyte Count 850000 /uL (4000 - 11000)"))
    assert not r["wbc"]["isAutoCorrected"]


def test_ocr_collision_parsed_at_match_position():
    r = by_id(parse_report_text_python("TotalCholesterol 180 mg/dL (Range 100-200)"))
    assert r["cholesterol"]["measuredValue"] == 180


def test_printed_lab_range_wins_over_population():
    text = "Hemoglobin (Hb)      13.5 g/dL   (Range: 12.0 - 16.0)"
    hb = by_id(parse_report_text_python(text, MALE_30))["hemoglobin"]
    assert hb["rangeSource"] == "catalog"
    assert hb["referenceMin"] == 12.0 and hb["referenceMax"] == 16.0


def test_gender_stratum_applies_nhanes_percentiles():
    text = "Hemoglobin\n13.5 g/dL"
    male = by_id(parse_report_text_python(text, MALE_30))["hemoglobin"]
    assert male["rangeSource"] == "nhanes_p2_5_p97_5"
    assert male["referenceMin"] == pytest.approx(13.2, abs=0.3)
    assert male["referenceMax"] > 17
    assert male["classification"] == "Normal"


def test_gender_stratum_changes_classification():
    text = "Hemoglobin\n16.5 g/dL"
    m = by_id(parse_report_text_python(text, MALE_30))["hemoglobin"]
    f = by_id(parse_report_text_python(text, FEMALE_30))["hemoglobin"]
    assert m["classification"] == "Normal"
    assert f["classification"] == "High"


def test_uncovered_marker_falls_back_to_catalog():
    tsh = by_id(parse_report_text_python("TSH 6.5 uIU/mL (0.4 - 4.0)", MALE_30))["tsh"]
    assert tsh["rangeSource"] == "catalog"
    assert tsh["classification"] == "High"


def _result(test_id, value):
    return {
        "testId": test_id,
        "measuredValue": value,
        "unit": "",
        "referenceMin": 12,
        "referenceMax": 16,
    }


def test_balance_index_high_for_at_median_panel():
    engine = get_ml_engine()
    ins = engine.analyze_report_ml(
        [_result("hemoglobin", 15.2), _result("creatinine", 0.93)],
        patient_context=MALE_30,
    )
    assert ins["balance_index"] >= 95
    assert ins["population_source"].startswith("CDC NHANES")
    assert ins["patient_stratum"] == "M 18-39"


def test_balance_index_low_for_extreme_panel():
    engine = get_ml_engine()
    ins = engine.analyze_report_ml(
        [_result("hemoglobin", 22.0), _result("creatinine", 4.5)],
        patient_context=MALE_30,
    )
    assert ins["balance_index"] < 50
    assert 10 <= ins["balance_index"] <= 100


def test_empty_results_safe():
    engine = get_ml_engine()
    ins = engine.analyze_report_ml([], None)
    assert ins["balance_index"] == 100
    assert isinstance(ins["risk_clusters"], list)


def test_engine_is_lazy_singleton():
    assert get_ml_engine() is get_ml_engine()
