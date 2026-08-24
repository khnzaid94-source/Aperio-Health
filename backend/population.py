import json
from pathlib import Path
from typing import Any, Dict, Optional

SHARED_DIR = Path(__file__).resolve().parent.parent / "shared"
DISTRIBUTIONS_PATH = SHARED_DIR / "distributions.json"

AGE_BANDS = [(18, 39, "18-39"), (40, 59, "40-59"), (60, 200, "60+")]


def resolve_age_band(age: Optional[int]) -> Optional[str]:
    if age is None:
        return None
    clamped = max(18, min(int(age), 200))
    for lo, hi, label in AGE_BANDS:
        if lo <= clamped <= hi:
            return label
    return "60+"


def age_from_dob(dob: Optional[str]) -> Optional[int]:
    if not dob:
        return None
    try:
        from datetime import date
        parts = [int(p) for p in str(dob)[:10].split("-")]
        if len(parts) != 3:
            return None
        today = date.today()
        return today.year - parts[0] - ((today.month, today.day) < (parts[1], parts[2]))
    except Exception:
        return None


def resolve_sex(gender: Optional[str]) -> Optional[str]:
    if not gender:
        return None
    g = str(gender).strip().lower()
    if g.startswith("m"):
        return "M"
    if g.startswith("f"):
        return "F"
    return None


class PopulationDistributions:
    def __init__(self, path: Path = DISTRIBUTIONS_PATH):
        self.raw: Dict[str, Any] = {}
        if path.exists():
            self.raw = json.loads(path.read_text(encoding="utf-8"))
        self.meta = self.raw.get("_meta", {})
        self.source = self.meta.get("source", "catalog reference ranges")

    def has_data(self) -> bool:
        return len(self.raw) > 1

    def stats_for(
        self, test_id: str, sex: Optional[str], age_band: Optional[str]
    ) -> Optional[Dict[str, Any]]:
        entry = self.raw.get(test_id)
        if not isinstance(entry, dict):
            return None
        if sex and age_band:
            st = entry.get("sex", {}).get(sex, {}).get(age_band)
            if st:
                return {**st, "stratum": f"{sex} {age_band}"}
        all_st = entry.get("all", {}).get("18+")
        if all_st:
            return {**all_st, "stratum": "adults 18+ (population average)"}
        return None

    def marker_ids(self):
        return sorted(k for k in self.raw.keys() if not k.startswith("_"))
