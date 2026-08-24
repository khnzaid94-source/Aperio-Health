"""One-time offline builder: downloads CDC NHANES 2017-2018 lab files and computes
real-population reference statistics per sex x age-band for supported biomarkers.

Output: backend/data/distributions.json
Run:    python scripts/build_distributions.py
"""

import io
import json
import sys
import urllib.request
from pathlib import Path

import numpy as np
import pandas as pd

CYCLE = "2017-2018"
CYCLE_YEAR = "2017"
BASE_URL = "https://wwwn.cdc.gov/Nchs/Data/Nhanes/Public"
PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = PROJECT_ROOT / "shared" / "distributions.json"
CACHE_DIR = Path(sys.argv[1]) if len(sys.argv) > 1 else None

AGE_BANDS = [(18, 39, "18-39"), (40, 59, "40-59"), (60, 200, "60+")]

FILE_COLUMNS = {
    "CBC_J": {
        "LBXHGB": "hemoglobin",
        "LBXWBCSI": "wbc",
        "LBXPLTSI": "platelets",
        "LBXRBCSI": "rbc",
        "LBXHCT": "hematocrit",
        "LBXMCV": "mcv",
        "LBXMCH": "mch",
        "LBXMCHC": "mchc",
        "LBXRDW": "rdw",
        "LBXNEPCT": "neutrophils",
    },
    "BIOPRO_J": {
        "LBXSATSI": "alt",
        "LBXSASSI": "ast",
        "LBXSCA": "calcium",
        "LBXSBU": "bun",
        "LBXSUA": "uricacid",
        "LBXSCR": "creatinine",
        "LBXSTB": "bilirubin",
        "LBXSAL": "albumin",
        "LBXSTP": "total_protein",
        "LBXSNASI": "sodium",
        "LBXKSI": "potassium",
        "LBXSCLSI": "chloride",
    },
    "GLU_J": {"LBXGLU": "fbs"},
    "TRIGLY_J": {"LBXTR": "triglycerides", "LBDLDL": "ldl"},
    "TCHOL_J": {"LBXTC": "cholesterol"},
    "HDL_J": {"LBDHDD": "hdl"},
    "GHB_J": {"LBXGH": "hba1c"},
    "INS_J": {"LBXIN": "insulin"},
    "HSCRP_J": {"LBXHSCRP": "hscrp"},
    "FERTIN_J": {"LBXFER": "ferritin"},
}

UNIT_OVERRIDES = {
    "fbs": "mg/dL (mixed fed/fasted caveat)",
}


def fetch_xpt(file_stem: str) -> pd.DataFrame:
    url = f"{BASE_URL}/{CYCLE_YEAR}/DataFiles/{file_stem}.XPT"
    if CACHE_DIR:
        cache_file = Path(CACHE_DIR) / f"{file_stem}.xpt"
        if cache_file.exists():
            return pd.read_sas(str(cache_file), format="xport")
        Path(CACHE_DIR).mkdir(parents=True, exist_ok=True)
        print(f"  downloading {url} ...")
        with urllib.request.urlopen(url, timeout=120) as resp:
            raw = resp.read()
        cache_file.write_bytes(raw)
        return pd.read_sas(io.BytesIO(raw), format="xport")
    print(f"  downloading {url} ...")
    with urllib.request.urlopen(url, timeout=120) as resp:
        raw = resp.read()
    return pd.read_sas(io.BytesIO(raw), format="xport")


def robust_stats(values: np.ndarray) -> dict | None:
    values = values[np.isfinite(values)]
    n = int(values.size)
    if n < 50:
        return None
    p = np.percentile(values, [2.5, 25, 50, 75, 97.5])
    iqr_sigma = max((p[3] - p[1]) / 1.349, 1e-6)
    return {
        "n": n,
        "mean": round(float(np.mean(values)), 3),
        "sd": round(float(np.std(values)), 3),
        "p2_5": round(float(p[0]), 3),
        "p50": round(float(p[2]), 3),
        "p97_5": round(float(p[4]), 3),
        "sigma_robust": round(float(iqr_sigma), 3),
    }


def main() -> None:
    demo_df = fetch_xpt("DEMO_J")[["SEQN", "RIAGENDR", "RIDAGEYR"]]
    collected: dict[str, list] = {}

    for file_stem, columns in FILE_COLUMNS.items():
        try:
            df = fetch_xpt(file_stem)
        except Exception as exc:
            print(f"  SKIP {file_stem}: {exc}")
            continue
        merged = demo_df.merge(df, on="SEQN", how="inner")
        for col, test_id in columns.items():
            if col not in merged.columns:
                continue
            for _, row in merged[["RIAGENDR", "RIDAGEYR", col]].dropna().iterrows():
                val = row[col]
                if not np.isfinite(val) or val <= 0:
                    continue
                band = next((label for lo, hi, label in AGE_BANDS if lo <= row["RIDAGEYR"] <= hi), None)
                if band is None:
                    continue
                sex = "M" if row["RIAGENDR"] == 1 else "F"
                bucket = collected.setdefault(test_id, {}).setdefault(sex, {}).setdefault(band, [])
                bucket.append(float(val))
                all_bucket = collected[test_id].setdefault("all", {})
                all_bucket.setdefault("18+", []).append(float(val))

    distributions = {}
    markers_with_data = 0
    for test_id in sorted(collected.keys()):
        entry = {"sex": {}}
        total_n = 0
        for group_key in ("M", "F"):
            group = collected[test_id].get(group_key, {})
            strata = {}
            for _, _, band in AGE_BANDS:
                stats = robust_stats(np.array(group.get(band, []), dtype=float))
                if stats:
                    strata[band] = stats
                    total_n += stats["n"]
            if strata:
                entry["sex"][group_key] = strata
        all_stats = robust_stats(np.array(
            collected[test_id].get("all", {}).get("18+", []), dtype=float
        ))
        if all_stats:
            entry["all"] = {"18+": all_stats}
            total_n = max(total_n, all_stats["n"])
        if entry["sex"] or entry.get("all"):
            distributions[test_id] = entry
            markers_with_data += 1

            def median_of(sex_key):
                s = entry.get("sex", {}).get(sex_key, {}).get("18-39")
                return s["p50"] if s else None

            m_med = median_of("M")
            f_med = median_of("F")
            print(f"{test_id:20s} n={total_n:>7d}  M18-39 p50={m_med}  F18-39 p50={f_med}")

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps({
        "_meta": {
            "source": "CDC NHANES 2017-2018 (public use)",
            "age_bands": ["18-39", "40-59", "60+"],
            "markers": markers_with_data,
            "note": "Robust stats per sex x age band; sigma_robust = IQR/1.349.",
        },
        **distributions,
    }, indent=1))

    print(f"\nWrote {OUT_PATH} with {markers_with_data} markers.")


if __name__ == "__main__":
    main()
