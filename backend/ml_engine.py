import threading
from typing import Any, Dict, List, Optional

import numpy as np
from sklearn.ensemble import IsolationForest

from population import (
    PopulationDistributions,
    DISTRIBUTIONS_PATH,
    age_from_dob,
    resolve_age_band,
    resolve_sex,
)

PENALTY_SATURATION_Z = 4.0
PENALTY_WEIGHT = 0.6
MIN_BALANCE_INDEX = 10


class ClinicalMLEngine:
    def __init__(self, population: PopulationDistributions):
        self.population = population
        self.feature_keys = population.marker_ids()
        self._lock = threading.Lock()
        self._forest: Optional[IsolationForest] = None

    @property
    def forest(self) -> Optional[IsolationForest]:
        if self._forest is None and self.feature_keys:
            with self._lock:
                if self._forest is None:
                    rng = np.random.default_rng(42)
                    medians, sigmas = [], []
                    for key in self.feature_keys:
                        st = (
                            self.population.stats_for(key, "M", "18-39")
                            or self.population.stats_for(key, None, None)
                        )
                        center = st.get("p50") or st.get("mean") or 0.0
                        spread = st.get("sigma_robust") or st.get("sd") or 1.0
                        medians.append(center)
                        sigmas.append(max(spread, 1e-6))
                    samples = rng.normal(
                        loc=np.array(medians),
                        scale=np.array(sigmas),
                        size=(1500, len(self.feature_keys)),
                    )
                    z_matrix = (samples - np.array(medians)) / np.array(sigmas)
                    forest = IsolationForest(
                        n_estimators=100, contamination=0.05, random_state=42
                    ).fit(z_matrix)
                    self._forest = forest
        return self._forest

    def analyze_report_ml(
        self,
        parsed_results: List[Dict[str, Any]],
        patient_context: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        context = patient_context or {}
        sex = resolve_sex(context.get("gender"))
        age_band = resolve_age_band(
            context.get("age") if context.get("age") is not None else self._age_from_dob(context.get("date_of_birth"))
        )

        result_map = {r.get("testId"): r.get("measuredValue") for r in parsed_results}

        z_scores: Dict[str, float] = {}
        penalties: List[float] = []
        patient_vector: List[float] = []

        for key in self.feature_keys:
            stats = self.population.stats_for(key, sex, age_band)
            value = result_map.get(key)
            if stats is None or value is None or not isinstance(value, (int, float)):
                patient_vector.append(0.0)
                continue

            center = stats.get("p50") or stats.get("mean") or 0.0
            spread = stats.get("sigma_robust") or stats.get("sd") or 1.0
            z = (float(value) - center) / max(spread, 1e-6)
            z_scores[key] = round(float(z), 2)

            penalty = min(abs(z) / PENALTY_SATURATION_Z, 1.0)
            penalties.append(penalty)
            patient_vector.append(z)

        forest = self.forest
        raw_anomaly = 0.2
        if forest is not None and patient_vector:
            matrix = np.array([patient_vector])
            raw_anomaly = float(forest.decision_function(matrix)[0])

        if penalties:
            mean_penalty = sum(penalties) / len(penalties)
            balance_index = int(
                np.clip(round(100 * (1 - PENALTY_WEIGHT * mean_penalty)), MIN_BALANCE_INDEX, 100)
            )
        else:
            balance_index = 100

        if balance_index >= 85:
            balance_status, balance_badge = "Optimal Biomarker Balance", "Optimal"
        elif balance_index >= 65:
            balance_status, balance_badge = "Mild Multi-Marker Variance", "Moderate"
        else:
            balance_status, balance_badge = "Significant Multi-System Variation", "High Variance"

        risk_clusters = self._detect_risk_clusters(result_map)

        return {
            "anomaly_score": round(raw_anomaly, 3),
            "balance_index": balance_index,
            "balance_status": balance_status,
            "balance_badge": balance_badge,
            "analyzed_markers_count": len([k for k in self.feature_keys if k in result_map]),
            "markers_with_population_data": len(penalties),
            "population_source": self.population.source,
            "patient_stratum": f"{sex} {age_band}".strip() if (sex or age_band) else "population average",
            "risk_clusters": risk_clusters,
            "z_scores": z_scores,
        }

    @staticmethod
    def _age_from_dob(dob: Optional[str]) -> Optional[int]:
        return age_from_dob(dob)

    @staticmethod
    def _detect_risk_clusters(result_map: Dict[str, Any]) -> List[Dict[str, Any]]:

        def val(key: str, default: float) -> float:
            v = result_map.get(key, default)
            return v if isinstance(v, (int, float)) else default

        clusters: List[Dict[str, Any]] = []

        has_high_fbs = val("fbs", 0) > 100
        has_high_a1c = val("hba1c", 0) > 5.6
        has_high_tg = val("triglycerides", 0) > 150
        has_low_hdl = val("hdl", 999) < 40

        if (has_high_fbs or has_high_a1c) and (has_high_tg or has_low_hdl):
            clusters.append({
                "name": "Blood Sugar & Cholesterol Relationship",
                "severity": "Elevated",
                "markers": [k for k in ["fbs", "hba1c", "triglycerides", "hdl"] if k in result_map],
                "insight": "Your blood sugar and lipid fats are both elevated. When these rise together, it suggests your body may be having trouble processing dietary energy and carbohydrates smoothly."
            })

        has_low_hb = val("hemoglobin", 999) < 12.0
        has_low_ferritin = val("ferritin", 999) < 15.0
        has_low_hct = val("hematocrit", 999) < 36.0

        if (has_low_hb and has_low_ferritin) or (has_low_hb and has_low_hct):
            clusters.append({
                "name": "Iron Stores & Oxygen Delivery Pattern",
                "severity": "Moderate",
                "markers": [k for k in ["hemoglobin", "ferritin", "hematocrit"] if k in result_map],
                "insight": "Both your active red blood cells (hemoglobin) and stored iron reserves (ferritin) are below standard ranges, which is the hallmark pattern of iron-deficiency anemia."
            })

        has_high_alt = val("alt", 0) > 56
        has_high_ast = val("ast", 0) > 48

        if has_high_alt and has_high_ast:
            clusters.append({
                "name": "Liver Enzyme Activity Pattern",
                "severity": "Elevated",
                "markers": ["alt", "ast"],
                "insight": "Both ALT and AST enzymes are higher than normal. When they elevate at the same time, it points toward mild liver cell irritation (such as from diet, medications, or alcohol) rather than simple muscle fatigue."
            })

        has_high_cre = val("creatinine", 0) > 1.2
        has_high_bun = val("bun", 0) > 20.0

        if has_high_cre and has_high_bun:
            clusters.append({
                "name": "Kidney Filtration Balance Pattern",
                "severity": "Elevated",
                "markers": ["creatinine", "bun"],
                "insight": "Both Creatinine and Blood Urea Nitrogen are elevated together. This often points to mild dehydration or that your kidneys are working harder to filter natural waste products."
            })

        has_high_tsh = val("tsh", 0) > 4.0
        has_low_t4 = val("t4", 999) < 4.5

        if has_high_tsh and has_low_t4:
            clusters.append({
                "name": "Thyroid Hormone Balance Pattern",
                "severity": "Moderate",
                "markers": ["tsh", "t4"],
                "insight": "Higher TSH with lower T4 hormone indicates your body is asking your thyroid gland to work harder, a typical sign of an underactive thyroid (hypothyroidism)."
            })

        return clusters


_population = PopulationDistributions()
_engine_instance: Optional[ClinicalMLEngine] = None
_engine_lock = threading.Lock()


def get_ml_engine() -> ClinicalMLEngine:
    global _engine_instance
    if _engine_instance is None:
        with _engine_lock:
            if _engine_instance is None:
                _engine_instance = ClinicalMLEngine(_population)
    return _engine_instance
