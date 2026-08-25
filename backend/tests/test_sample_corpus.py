"""Sample-report regression corpus.

Guards the parser against the false-positive family found during QA
(2026-08-25): ultra-short symbols (mg) matching inside units (mg/dL) and
reference-table boilerplate fabricating analyte rows (Magnesium 4.4 High).

Fixtures are sanitized pypdf extractions of the owner's five sample PDFs in
/Sample Reports (names replaced with placeholders; clinical content intact).
Expected matrices were verified against the source documents themselves.
"""

import os
import sys

import pytest

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BACKEND_DIR)
os.chdir(BACKEND_DIR)

from ocr import parse_report_text_python  # noqa: E402

FIXTURE_DIR = os.path.join(BACKEND_DIR, "tests", "fixtures", "sample_reports")


def load_fixture(name: str) -> str:
    with open(os.path.join(FIXTURE_DIR, name), encoding="utf-8") as f:
        return f.read()


def rows_by_id(text: str):
    return {r["testId"]: r for r in parse_report_text_python(text)}


# ---------------------------------------------------------------------------
# rbs-report-format.pdf — THE regression that started this suite.
# Document contains "70-140 mg/dL (4.4-7.8 mmol/i)" boilerplate; the old \bmg\b
# pattern matched inside the unit and fabricated Magnesium = 4.4 (High, Doctor).
# ---------------------------------------------------------------------------

def test_rbs_never_fabricates_magnesium():
    rows = rows_by_id(load_fixture("rbs-report-format.txt"))
    assert "magnesium" not in rows, f"hallucinated rows: {list(rows)}"
    assert set(rows.keys()) == {"rbs"}, f"unexpected test ids: {sorted(rows)}"


def test_rbs_row_is_correct():
    r = rows_by_id(load_fixture("rbs-report-format.txt"))["rbs"]
    assert r["measuredValue"] == 82.0
    assert r["classification"] == "Normal"
    assert r["urgency"] == "Normal"


def test_rbs_no_longer_mapped_to_ppbs():
    """RANDOM BLOOD SUGAR must map to its own catalog test, not postprandial."""
    assert "ppbs" not in rows_by_id(load_fixture("rbs-report-format.txt"))


# ---------------------------------------------------------------------------
# CBC / KFT / LFT / Lipid — expected matrices verified against source PDFs.
# ---------------------------------------------------------------------------

EXPECTED_MATRICES = {
    # mchc is intentionally absent: pypdf interleaves the H flag before the
    # value ("MCHC\nH\n35.7"), a known extraction-order limitation, not a
    # parser regression. alp=11 Low is correct: the source PDF genuinely
    # prints 11 U/I with an empty reference column.
    "cbc-report-format.txt": {
        "hemoglobin": (15.0, "Normal"),
        "wbc": (5100.0, "Normal"),
        "neutrophils": (79.0, "Normal"),
        "platelets": (3.5, "Normal"),
        "rbc": (5.0, "Normal"),
        "hematocrit": (42.0, "Normal"),
        "mcv": (84.0, "Normal"),
        "mch": (30.0, "Normal"),
    },
    "kft-report-format.txt": {
        "bun": (15.88, "Normal"),
        "creatinine": (1.17, "Normal"),
        "calcium": (10.0, "Normal"),
        "potassium": (4.0, "Normal"),
        "sodium": (142.0, "Normal"),
        "uricacid": (7.1, "Normal"),
    },
    "lft-report-format.txt": {
        "bilirubin": (0.9, "Normal"),
        "alt": (36.0, "Normal"),
        "ast": (32.0, "Normal"),
        "alp": (11.0, "Low"),
        "albumin": (4.7, "Normal"),
    },
    "lipid-profile-report-format.txt": {
        "cholesterol": (180.0, "Normal"),
        "triglycerides": (172.0, "Normal"),
        "hdl": (55.0, "Normal"),
        "ldl": (90.6, "Normal"),
        # Document prints its own reference 5-40; extracted ranges override the
        # catalog band (2-30), so 34.4 is correctly classified Normal here.
        "vldl": (34.4, "Normal"),
        "non_hdl": (125.0, "Normal"),
    },
}


@pytest.mark.parametrize("fixture_name", sorted(EXPECTED_MATRICES.keys()))
def test_expected_matrix(fixture_name):
    rows = rows_by_id(load_fixture(fixture_name))
    expected = EXPECTED_MATRICES[fixture_name]

    missing = set(expected) - set(rows)
    extra = set(rows) - set(expected)
    assert not missing, f"{fixture_name}: missing {sorted(missing)}; got {sorted(rows)}"
    assert not extra, f"{fixture_name}: unexpected rows {sorted(extra)}"

    for test_id, (value, classification) in expected.items():
        assert rows[test_id]["measuredValue"] == value, f"{fixture_name}:{test_id} value"
        assert rows[test_id]["classification"] == classification, (
            f"{fixture_name}:{test_id} classification"
        )
