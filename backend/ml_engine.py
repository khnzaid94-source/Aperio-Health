import numpy as np
from typing import List, Dict, Any
from sklearn.ensemble import IsolationForest
from catalog import CATALOG

# Representative baseline normal clinical distribution parameters (mean, std_dev)
# derived from standard adult reference population intervals in CATALOG
PANEL_DISTRIBUTIONS: Dict[str, Dict[str, float]] = {
    entry.id: {
        "mean": round((entry.min + entry.max) / 2.0, 3),
        "std": round(max((entry.max - entry.min) / 4.0, 0.001), 3)
    }
    for entry in CATALOG
}

class ClinicalMLEngine:
    def __init__(self):
        # Synthetic baseline normal cohort for Isolation Forest fitting
        np.random.seed(42)
        n_samples = 1500
        feature_keys = sorted(list(PANEL_DISTRIBUTIONS.keys()))
        self.feature_keys = feature_keys

        # Generate normal population baseline
        baseline_data = []
        for _ in range(n_samples):
            sample = []
            for k in feature_keys:
                mean = PANEL_DISTRIBUTIONS[k]["mean"]
                std = PANEL_DISTRIBUTIONS[k]["std"]
                val = np.random.normal(mean, std)
                # Normalize via z-score
                z = (val - mean) / std
                sample.append(z)
            baseline_data.append(sample)

        self.baseline_matrix = np.array(baseline_data)
        self.isolation_forest = IsolationForest(
            n_estimators=100,
            contamination=0.05,
            random_state=42
        )
        self.isolation_forest.fit(self.baseline_matrix)

    def analyze_report_ml(self, parsed_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Runs Multi-Marker Machine Learning Evaluation:
        1. Anomaly scoring via trained Isolation Forest
        2. Overall Metabolic Balance Index (0-100%)
        3. Multi-Marker Synergistic Risk Cluster Detection
        """
        if not parsed_results:
            return {
                "anomaly_score": 0.0,
                "balance_index": 100,
                "balance_status": "No data",
                "risk_clusters": []
            }

        # Build patient vector with available tests (using mean for unrecorded tests)
        result_map = {r["testId"]: r["measuredValue"] for r in parsed_results}
        patient_vector = []
        z_scores: Dict[str, float] = {}

        for k in self.feature_keys:
            mean = PANEL_DISTRIBUTIONS[k]["mean"]
            std = PANEL_DISTRIBUTIONS[k]["std"]
            if k in result_map:
                val = result_map[k]
                z = (val - mean) / std
                z_scores[k] = round(float(z), 2)
            else:
                z = 0.0  # Population mean (baseline neutral)
            patient_vector.append(z)

        patient_matrix = np.array([patient_vector])

        # Isolation Forest Decision Function (-0.5 to +0.5 where lower = more anomalous)
        raw_score = float(self.isolation_forest.decision_function(patient_matrix)[0])

        # Map to 0-100% Balance Index
        # raw_score of ~0.2 is pristine normal (100%), raw_score < -0.15 is multi-system stress (20%)
        balance_index = int(np.clip((raw_score + 0.20) / 0.40 * 100, 10, 100))

        if balance_index >= 85:
            balance_status = "Optimal Biomarker Balance"
            balance_badge = "Optimal"
        elif balance_index >= 65:
            balance_status = "Mild Multi-Marker Variance"
            balance_badge = "Moderate"
        else:
            balance_status = "Significant Multi-System Variation"
            balance_badge = "High Variance"

        # 2. Multi-Marker Connected Health Patterns Detection
        risk_clusters = []

        # Pattern A: Blood Sugar & Lipid Balance
        has_high_fbs = result_map.get("fbs", 0) > 100
        has_high_a1c = result_map.get("hba1c", 0) > 5.6
        has_high_tg = result_map.get("triglycerides", 0) > 150
        has_low_hdl = result_map.get("hdl", 999) < 40

        if (has_high_fbs or has_high_a1c) and (has_high_tg or has_low_hdl):
            risk_clusters.append({
                "name": "Blood Sugar & Cholesterol Relationship",
                "severity": "Elevated",
                "markers": [k for k in ["fbs", "hba1c", "triglycerides", "hdl"] if k in result_map],
                "insight": "Your blood sugar and lipid fats are both elevated. When these rise together, it suggests your body may be having trouble processing dietary energy and carbohydrates smoothly."
            })

        # Pattern B: Iron & Red Blood Cell Pattern
        has_low_hb = result_map.get("hemoglobin", 999) < 12.0
        has_low_ferritin = result_map.get("ferritin", 999) < 15.0
        has_low_hct = result_map.get("hematocrit", 999) < 36.0

        if (has_low_hb and has_low_ferritin) or (has_low_hb and has_low_hct):
            risk_clusters.append({
                "name": "Iron Stores & Oxygen Delivery Pattern",
                "severity": "Moderate",
                "markers": [k for k in ["hemoglobin", "ferritin", "hematocrit"] if k in result_map],
                "insight": "Both your active red blood cells (hemoglobin) and stored iron reserves (ferritin) are below standard ranges, which is the hallmark pattern of iron-deficiency anemia."
            })

        # Pattern C: Liver Enzyme Activity Pattern
        has_high_alt = result_map.get("alt", 0) > 56
        has_high_ast = result_map.get("ast", 0) > 48

        if has_high_alt and has_high_ast:
            risk_clusters.append({
                "name": "Liver Enzyme Activity Pattern",
                "severity": "Elevated",
                "markers": ["alt", "ast"],
                "insight": "Both ALT and AST enzymes are higher than normal. When they elevate at the same time, it points toward mild liver cell irritation (such as from diet, medications, or alcohol) rather than simple muscle fatigue."
            })

        # Pattern D: Kidney Filtration Pattern
        has_high_cre = result_map.get("creatinine", 0) > 1.2
        has_high_bun = result_map.get("bun", 0) > 20.0

        if has_high_cre and has_high_bun:
            risk_clusters.append({
                "name": "Kidney Filtration Balance Pattern",
                "severity": "Elevated",
                "markers": ["creatinine", "bun"],
                "insight": "Both Creatinine and Blood Urea Nitrogen are elevated together. This often points to mild dehydration or that your kidneys are working harder to filter natural waste products."
            })

        # Pattern E: Thyroid Hormone Activity Pattern
        has_high_tsh = result_map.get("tsh", 0) > 4.0
        has_low_t4 = result_map.get("t4", 999) < 4.5

        if has_high_tsh and has_low_t4:
            risk_clusters.append({
                "name": "Thyroid Hormone Balance Pattern",
                "severity": "Moderate",
                "markers": ["tsh", "t4"],
                "insight": "Higher TSH with lower T4 hormone indicates your body is asking your thyroid gland to work harder, a typical sign of an underactive thyroid (hypothyroidism)."
            })

        return {
            "anomaly_score": round(raw_score, 3),
            "balance_index": balance_index,
            "balance_status": balance_status,
            "balance_badge": balance_badge,
            "analyzed_markers_count": len([k for k in self.feature_keys if k in result_map]),
            "risk_clusters": risk_clusters,
            "z_scores": z_scores
        }

ml_engine = ClinicalMLEngine()
