import json
from pathlib import Path
from typing import Dict, List, Optional

from pydantic import BaseModel

_SHARED_DIR = Path(__file__).resolve().parent.parent / "shared"


class CatalogEntry(BaseModel):
    id: str
    name: str
    category: str
    min: float
    max: float
    unit: str
    explanation_low: str
    explanation_high: str


def _load_catalog() -> List[CatalogEntry]:
    data = json.loads((_SHARED_DIR / "catalog.json").read_text(encoding="utf-8"))
    return [CatalogEntry(**entry) for entry in data["tests"]]


CATALOG: List[CatalogEntry] = _load_catalog()

_CATALOG_INDEX: Dict[str, CatalogEntry] = {entry.id: entry for entry in CATALOG}


def get_catalog_entry(test_id: str) -> Optional[CatalogEntry]:
    return _CATALOG_INDEX.get(test_id)
