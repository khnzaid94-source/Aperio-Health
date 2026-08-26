"""Core-accuracy edge-case tests for ocr.py (Phase 9.2).

Mirrors and extends the Vitest suite in
src/utils/__tests__/parser.test.ts: match-index slicing, synonym
position/separator handling, ultra-short symbol guards, malformed or
implausible reference ranges, multi-line tables, classification/urgency
boundaries, and date normalization.
"""

import os
import sys

import pytest

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BACKEND_DIR)
os.chdir(BACKEND_DIR)

from ocr import (  # noqa: E402
    build_synonym_pattern,
    calculate_urgency,
    classify_value,
    extract_specimen_date,
    normalize_date_string,
    parse_report_text_python,
)


def by_id(results):
    return {r["testId"]: r for r in results}


def ids(text):
    return [r["testId"] for r in parse_report_text_python(text)]


def test_value_before_match_position_is_never_grabbed():
    r = by_id(parse_report_text_python("Reference: 150 Total Cholesterol 210 mg/dL"))
    assert list(r.keys()) == ["cholesterol"]
    assert r["cholesterol"]["measuredValue"] == 210


def test_colon_terminated_synonym_form_parses():
    r = by_id(parse_report_text_python("Hemoglobin: 13.5 g/dL"))
    assert r["hemoglobin"]["measuredValue"] == 13.5


@pytest.mark.parametrize(
    "line",
    [
        "Total.Cholesterol 210 mg/dL",
        "TOTAL-CHOLESTEROL 210 mg/dL",
        "total   cholesterol 210 mg/dL",
        "TotalCholesterol 210 mg/dL",
    ],
)
def test_multiword_synonym_separator_tolerance(line):
    results = parse_report_text_python(line)
    assert len(results) == 1
    assert results[0]["testId"] == "cholesterol"
    assert results[0]["measuredValue"] == 210


def test_ultra_short_symbol_matches_as_standalone_token_with_unit_context():
    same_line = by_id(parse_report_text_python("Mg 2.0 mg/dL (1.6 - 2.6)"))
    assert same_line["magnesium"]["measuredValue"] == 2.0
    next_line = by_id(parse_report_text_python("Mg\n2.0 mg/dL"))
    assert next_line["magnesium"]["measuredValue"] == 2.0


def test_ultra_short_symbol_rejects_glued_values_and_sentences():
    assert parse_report_text_python("Take Mg4 supplement daily") == []
    assert parse_report_text_python("Ca. 1990 was a year") == []
    assert parse_report_text_python("K") == []


def test_ultra_short_symbol_requires_clinical_context_nearby():
    assert parse_report_text_python("Mg") == []


def test_ada_reference_table_fabrication_guard():
    results = parse_report_text_python("Fasting Blood Sugar 95 mg/dL")
    assert ids("Fasting Blood Sugar 95 mg/dL") == ["fbs"]
    assert results[0]["measuredValue"] == 95


def test_short_abbreviation_without_any_number_or_unit_is_skipped():
    assert parse_report_text_python("AST") == []
    assert parse_report_text_python("AST\nno numbers here") == []


def test_short_abbreviation_accepted_when_next_line_carries_the_number():
    r = by_id(parse_report_text_python("FBS\n95 mg/dL"))
    assert r["fbs"]["measuredValue"] == 95


def test_malformed_reversed_range_falls_back_to_catalog():
    r = by_id(parse_report_text_python("TSH 6.5 uIU/mL (4.0 - 0.4)"))["tsh"]
    assert (r["referenceMin"], r["referenceMax"]) == pytest.approx((0.4, 4.0))
    assert r["rangeOverridden"] is False
    assert r["rangeSource"] == "catalog"
    assert r["classification"] == "High"


def test_malformed_zero_width_range_is_ignored():
    r = by_id(parse_report_text_python("TSH 6.5 uIU/mL (2.0 - 2.0)"))["tsh"]
    assert (r["referenceMin"], r["referenceMax"]) == pytest.approx((0.4, 4.0))
    assert r["rangeSource"] == "catalog"


def test_implausible_extracted_range_ratio_is_overridden():
    r = by_id(parse_report_text_python("TSH 6.5 uIU/mL (0.004 - 0.008)"))["tsh"]
    assert (r["referenceMin"], r["referenceMax"]) == pytest.approx((0.4, 4.0))
    assert r["rangeOverridden"] is True
    assert r["rangeSource"] == "catalog"
    assert r["classification"] == "High"


@pytest.mark.parametrize("rng", ["(12.0 - 16.0)", "(12.0 \u2013 16.0)", "(12 to 16)"])
def test_range_separator_variants(rng):
    r = by_id(parse_report_text_python(f"Hemoglobin 13.5 g/dL {rng}"))["hemoglobin"]
    assert r["measuredValue"] == 13.5


def test_thousands_comma_values_and_ranges():
    r = by_id(parse_report_text_python("Total Leukocyte Count 8,500 /uL (4,000 - 11,000)"))
    assert r["wbc"]["measuredValue"] == 8500.0


def test_multiline_table_value_then_range():
    r = by_id(parse_report_text_python("Hemoglobin\n13.5 g/dL\n(12 - 16)"))
    assert r["hemoglobin"]["measuredValue"] == 13.5


def test_multiline_table_skips_status_flag_lines():
    r = by_id(parse_report_text_python("Hemoglobin\nH\n13.5 g/dL"))
    assert r["hemoglobin"]["measuredValue"] == 13.5


def test_multiline_value_scan_stops_at_another_known_test():
    r = by_id(parse_report_text_python("Hemoglobin\nTSH 3.0 uIU/mL\n13.5 g/dL"))
    assert "hemoglobin" not in r
    assert r["tsh"]["measuredValue"] == 3.0


def test_row_without_numeric_value_is_dropped():
    assert parse_report_text_python("Hemoglobin g/dL") == []


def test_empty_and_whitespace_text_return_no_results():
    assert parse_report_text_python("") == []
    assert parse_report_text_python("   \n\t  ") == []


def test_build_synonym_pattern_ultra_short_boundaries():
    assert build_synonym_pattern("mg").search("Mg4") is None
    assert build_synonym_pattern("mg").search("mg/dL") is None
    assert build_synonym_pattern("mg").search("4.4 Mg") is not None
    assert build_synonym_pattern("ca").search("Ca.") is None
    assert build_synonym_pattern("ca").search("Ca 9.0") is not None


def test_classify_value_boundaries_are_inclusive():
    assert classify_value(12.0, 12.0, 16.0) == "Normal"
    assert classify_value(16.0, 12.0, 16.0) == "Normal"
    assert classify_value(11.9, 12.0, 16.0) == "Low"
    assert classify_value(16.1, 12.0, 16.0) == "High"


def test_calculate_urgency_deviation_thresholds():
    assert calculate_urgency(14.0, "Normal", 12.0, 16.0) == "Normal"
    assert calculate_urgency(16.8, "High", 12.0, 16.0) == "Monitor"
    assert calculate_urgency(17.2, "High", 12.0, 16.0) == "Doctor"
    assert calculate_urgency(11.7, "Low", 12.0, 16.0) == "Monitor"
    assert calculate_urgency(10.9, "Low", 12.0, 16.0) == "Doctor"


def test_calculate_urgency_degenerate_range_always_monitors():
    assert calculate_urgency(50.0, "High", 10.0, 10.0) == "Monitor"
    assert calculate_urgency(1.0, "Low", 10.0, 10.0) == "Monitor"


def test_normalize_date_string_matrix():
    assert normalize_date_string("08/20/2026") == "2026-08-20"
    assert normalize_date_string("2026-08-20") == "2026-08-20"
    assert normalize_date_string("25/12/2025") == "2025-12-25"
    assert normalize_date_string("12/25/2025") == "2025-12-25"
    assert normalize_date_string("3/7/26") == "2026-03-07"
    assert normalize_date_string("45/45/2025") == "45/45/2025"


def test_extract_specimen_date_contextual_and_absent():
    assert extract_specimen_date("Report Date: 03/04/2025") == "2025-03-04"
    assert extract_specimen_date("Specimen Collected: 2025-03-04") == "2025-03-04"
    assert extract_specimen_date("no date on this line") is None
    assert extract_specimen_date("") is None
