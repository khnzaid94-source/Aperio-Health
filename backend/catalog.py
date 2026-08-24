from typing import Dict, List, Optional, Any
from pydantic import BaseModel

class CatalogEntry(BaseModel):
    id: str
    name: str
    category: str
    min: float
    max: float
    unit: str
    explanation_low: str
    explanation_high: str

CATALOG: List[CatalogEntry] = [
    # Complete Blood Count
    CatalogEntry(
        id="hemoglobin",
        name="Hemoglobin",
        category="Complete Blood Count",
        min=12.0,
        max=16.0,
        unit="g/dL",
        explanation_low="Your hemoglobin level is below normal, indicating anemia. This can reduce oxygen transport, causing fatigue, weakness, or shortness of breath.",
        explanation_high="Your hemoglobin level is above normal, which can indicate polycythemia, dehydration, or chronic low oxygen levels."
    ),
    CatalogEntry(
        id="wbc",
        name="White Blood Cell Count",
        category="Complete Blood Count",
        min=4.0,
        max=11.0,
        unit="x10^3/uL",
        explanation_low="A low white blood cell count suggests a reduced immune capacity to fight off infections.",
        explanation_high="An elevated white blood cell count typically indicates an active immune response to an infection, inflammation, or stress."
    ),
    CatalogEntry(
        id="platelets",
        name="Platelet Count",
        category="Complete Blood Count",
        min=150.0,
        max=450.0,
        unit="x10^3/uL",
        explanation_low="A low platelet count can impair blood clotting, increasing the risk of easy bruising or bleeding.",
        explanation_high="A high platelet count means your body is producing extra platelets, which can increase the risk of blood clots."
    ),
    CatalogEntry(
        id="rbc",
        name="Red Blood Cell Count",
        category="Complete Blood Count",
        min=4.0,
        max=5.5,
        unit="x10^6/uL",
        explanation_low="A low red blood cell count indicates reduced oxygen-carrying capacity in your circulation.",
        explanation_high="An elevated red blood cell count indicates a higher concentration of red cells, often linked to dehydration or chronic low oxygen."
    ),
    CatalogEntry(
        id="hematocrit",
        name="Hematocrit",
        category="Complete Blood Count",
        min=36.0,
        max=48.0,
        unit="%",
        explanation_low="A low hematocrit level indicates a lower percentage of red blood cells in your volume, often signaling anemia.",
        explanation_high="A high hematocrit level means red blood cells make up a larger percentage of your blood, frequently seen in dehydration."
    ),
    CatalogEntry(
        id="mcv",
        name="Mean Corpuscular Volume (MCV)",
        category="Complete Blood Count",
        min=80.0,
        max=100.0,
        unit="fL",
        explanation_low="Low MCV indicates smaller red blood cells (microcytosis), typically seen in iron deficiency anemia or thalassemia.",
        explanation_high="High MCV indicates larger red blood cells (macrocytosis), often associated with B12/folate deficiency or liver issues."
    ),
    CatalogEntry(
        id="mch",
        name="Mean Corpuscular Hemoglobin (MCH)",
        category="Complete Blood Count",
        min=27.0,
        max=33.0,
        unit="pg",
        explanation_low="Low MCH indicates less hemoglobin per red blood cell, giving cells a paler appearance.",
        explanation_high="High MCH indicates higher hemoglobin per cell, commonly seen in macrocytic anemias."
    ),
    CatalogEntry(
        id="mchc",
        name="MCHC",
        category="Complete Blood Count",
        min=32.0,
        max=36.0,
        unit="g/dL",
        explanation_low="Low MCHC indicates reduced hemoglobin concentration in red cells, seen in hypochromic anemias.",
        explanation_high="High MCHC indicates elevated hemoglobin concentration per cell volume, seen in spherocytosis."
    ),
    CatalogEntry(
        id="rdw",
        name="Red Cell Distribution Width (RDW)",
        category="Complete Blood Count",
        min=11.5,
        max=14.5,
        unit="%",
        explanation_low="Low RDW indicates uniform red cell size distribution, a normal healthy finding.",
        explanation_high="High RDW indicates varied red cell sizes, an early sign of nutritional deficiency or evolving anemia."
    ),
    CatalogEntry(
        id="neutrophils",
        name="Neutrophils",
        category="Complete Blood Count",
        min=40.0,
        max=75.0,
        unit="%",
        explanation_low="Low neutrophils (neutropenia) reduces immediate bacterial immune defenses.",
        explanation_high="High neutrophils (neutrophilia) indicates acute immune response to infection, stress, or inflammation."
    ),

    # Lipid Profile
    CatalogEntry(
        id="cholesterol",
        name="Total Cholesterol",
        category="Lipid Profile",
        min=100.0,
        max=200.0,
        unit="mg/dL",
        explanation_low="Low total cholesterol levels can occasionally be linked to hyperthyroidism, liver disease, or malnutrition.",
        explanation_high="High total cholesterol indicates elevated fats in your bloodstream, raising cardiovascular risks."
    ),
    CatalogEntry(
        id="ldl",
        name="LDL Cholesterol",
        category="Lipid Profile",
        min=50.0,
        max=100.0,
        unit="mg/dL",
        explanation_low="Low LDL cholesterol is generally favorable for heart health but can occasionally be associated with hyperthyroidism or genetic factors.",
        explanation_high="High LDL cholesterol is associated with plaque buildup in arteries, raising the risk of heart disease."
    ),
    CatalogEntry(
        id="hdl",
        name="HDL Cholesterol",
        category="Lipid Profile",
        min=40.0,
        max=60.0,
        unit="mg/dL",
        explanation_low="Low HDL ('good') cholesterol reduces your body's natural ability to clear excess fats from the bloodstream.",
        explanation_high="High HDL cholesterol is generally protective against heart disease."
    ),
    CatalogEntry(
        id="triglycerides",
        name="Triglycerides",
        category="Lipid Profile",
        min=50.0,
        max=150.0,
        unit="mg/dL",
        explanation_low="Low triglyceride levels are rare but can indicate low-fat diets or hyperthyroidism.",
        explanation_high="High triglycerides represent elevated storage fats in your blood, often linked to high-carbohydrate diets or metabolic syndrome."
    ),
    CatalogEntry(
        id="vldl",
        name="VLDL Cholesterol",
        category="Lipid Profile",
        min=2.0,
        max=30.0,
        unit="mg/dL",
        explanation_low="Low VLDL indicates minimal circulating triglyceride-rich lipoprotein particles.",
        explanation_high="High VLDL contributes to arterial fat deposits and elevated cardiovascular risk."
    ),
    CatalogEntry(
        id="non_hdl",
        name="Non-HDL Cholesterol",
        category="Lipid Profile",
        min=0.0,
        max=130.0,
        unit="mg/dL",
        explanation_low="Low non-HDL cholesterol reflects minimal atherogenic lipid burden.",
        explanation_high="High non-HDL cholesterol measures total atherogenic lipid risk and arterial plaque burden."
    ),
    CatalogEntry(
        id="chol_hdl_ratio",
        name="Total Cholesterol / HDL Ratio",
        category="Lipid Profile",
        min=0.0,
        max=5.0,
        unit="ratio",
        explanation_low="Low ratio demonstrates a highly protective cardiolipid balance.",
        explanation_high="High ratio indicates elevated heart disease risk due to low relative protective HDL."
    ),

    # Thyroid Panel
    CatalogEntry(
        id="tsh",
        name="Thyroid Stimulating Hormone",
        category="Thyroid Panel",
        min=0.4,
        max=4.0,
        unit="uIU/mL",
        explanation_low="Low TSH suggests an overactive thyroid gland (hyperthyroidism).",
        explanation_high="High TSH suggests an underactive thyroid gland (hypothyroidism)."
    ),
    CatalogEntry(
        id="t3",
        name="Triiodothyronine (T3)",
        category="Thyroid Panel",
        min=80.0,
        max=200.0,
        unit="ng/dL",
        explanation_low="Low T3 levels can occur in hypothyroidism or during severe illness.",
        explanation_high="High T3 levels indicate hyperthyroidism, speeding up metabolic processes."
    ),
    CatalogEntry(
        id="t4",
        name="Thyroxine (T4)",
        category="Thyroid Panel",
        min=4.5,
        max=11.2,
        unit="ug/dL",
        explanation_low="Low T4 levels point toward hypothyroidism, where the thyroid does not produce sufficient hormone.",
        explanation_high="High T4 levels indicate hyperthyroidism, causing elevated energy use and pulse."
    ),
    CatalogEntry(
        id="ft3",
        name="Free T3",
        category="Thyroid Panel",
        min=2.0,
        max=4.4,
        unit="pg/mL",
        explanation_low="Low Free T3 indicates reduced circulating active thyroid hormone.",
        explanation_high="High Free T3 indicates thyroid overactivity and accelerated metabolism."
    ),
    CatalogEntry(
        id="ft4",
        name="Free T4",
        category="Thyroid Panel",
        min=0.8,
        max=1.8,
        unit="ng/dL",
        explanation_low="Low Free T4 points toward underactive thyroid hormone synthesis.",
        explanation_high="High Free T4 confirms active thyroid hormone overproduction."
    ),
    CatalogEntry(
        id="anti_tpo",
        name="Anti-Thyroid Peroxidase Antibodies (Anti-TPO)",
        category="Thyroid Panel",
        min=0.0,
        max=34.0,
        unit="IU/mL",
        explanation_low="Low or absent Anti-TPO antibodies indicate normal non-autoimmune thyroid state.",
        explanation_high="High Anti-TPO antibodies indicate autoimmune thyroiditis (Hashimotos or Graves disease)."
    ),

    # Liver Function
    CatalogEntry(
        id="alt",
        name="Alanine Transaminase",
        category="Liver Function",
        min=7.0,
        max=56.0,
        unit="U/L",
        explanation_low="Low ALT levels are generally expected and indicate healthy liver function.",
        explanation_high="High ALT levels suggest liver cell inflammation or irritation, releasing enzymes into the blood."
    ),
    CatalogEntry(
        id="ast",
        name="Aspartate Transaminase",
        category="Liver Function",
        min=8.0,
        max=48.0,
        unit="U/L",
        explanation_low="Low AST levels are normal and indicate healthy tissue.",
        explanation_high="Elevated AST levels point to cellular damage in the liver, heart, or muscle tissue."
    ),
    CatalogEntry(
        id="bilirubin",
        name="Total Bilirubin",
        category="Liver Function",
        min=0.1,
        max=1.2,
        unit="mg/dL",
        explanation_low="Low bilirubin levels are generally harmless and considered normal.",
        explanation_high="High bilirubin can cause jaundice and indicates liver, bile duct, or red cell breakdown issues."
    ),
    CatalogEntry(
        id="alp",
        name="Alkaline Phosphatase",
        category="Liver Function",
        min=44.0,
        max=147.0,
        unit="U/L",
        explanation_low="Low ALP levels can be related to malnutrition, zinc deficiency, or hypothyroidism.",
        explanation_high="High ALP levels are associated with liver conditions, bone growth/repair, or bile duct obstruction."
    ),
    CatalogEntry(
        id="direct_bilirubin",
        name="Direct Bilirubin",
        category="Liver Function",
        min=0.0,
        max=0.3,
        unit="mg/dL",
        explanation_low="Low direct bilirubin is normal.",
        explanation_high="High direct bilirubin suggests biliary obstruction or conjugated hyperbilirubinemia."
    ),
    CatalogEntry(
        id="ggt",
        name="Gamma-Glutamyl Transferase (GGT)",
        category="Liver Function",
        min=9.0,
        max=48.0,
        unit="U/L",
        explanation_low="Low GGT indicates healthy bile duct and liver function.",
        explanation_high="High GGT indicates liver inflammation, alcohol exposure, or bile duct blockage."
    ),
    CatalogEntry(
        id="total_protein",
        name="Total Serum Protein",
        category="Liver Function",
        min=6.0,
        max=8.3,
        unit="g/dL",
        explanation_low="Low total protein indicates reduced liver protein synthesis or kidney loss.",
        explanation_high="High total protein can be caused by chronic infection, inflammation, or fluid loss."
    ),
    CatalogEntry(
        id="albumin",
        name="Albumin",
        category="Liver Function",
        min=3.5,
        max=5.0,
        unit="g/dL",
        explanation_low="Low albumin suggests decreased liver production, kidney leakage, or severe inflammation.",
        explanation_high="High albumin is usually caused by acute dehydration."
    ),

    # Kidney Function
    CatalogEntry(
        id="creatinine",
        name="Creatinine",
        category="Kidney Function",
        min=0.6,
        max=1.2,
        unit="mg/dL",
        explanation_low="Low creatinine levels are often linked to lower muscle mass or low-protein diets.",
        explanation_high="High creatinine suggests your kidneys are filtering waste less efficiently than expected."
    ),
    CatalogEntry(
        id="bun",
        name="Blood Urea Nitrogen",
        category="Kidney Function",
        min=7.0,
        max=20.0,
        unit="mg/dL",
        explanation_low="Low BUN levels can occur in overhydration, malnutrition, or liver disease.",
        explanation_high="High BUN levels mean kidneys are not clearing urea effectively, often due to dehydration or decreased kidney filtration."
    ),
    CatalogEntry(
        id="uricacid",
        name="Uric Acid",
        category="Kidney Function",
        min=3.5,
        max=7.2,
        unit="mg/dL",
        explanation_low="Low uric acid is rare and typically harmless.",
        explanation_high="High uric acid levels can lead to joint crystal deposits (gout) or kidney stone risks."
    ),
    CatalogEntry(
        id="egfr",
        name="Estimated GFR (eGFR)",
        category="Kidney Function",
        min=90.0,
        max=120.0,
        unit="mL/min/1.73m2",
        explanation_low="Low eGFR indicates reduced renal filtration capacity and warrants medical evaluation.",
        explanation_high="Normal eGFR confirms healthy kidney waste filtration rate."
    ),

    # Blood Sugar
    CatalogEntry(
        id="hba1c",
        name="HbA1c",
        category="Blood Sugar",
        min=4.0,
        max=5.6,
        unit="%",
        explanation_low="Low HbA1c is rare and reflects low average blood glucose over recent months.",
        explanation_high="Elevated HbA1c indicates higher average blood sugar over the last 3 months (5.7–6.4% prediabetes, ≥6.5% diabetes)."
    ),
    CatalogEntry(
        id="fbs",
        name="Fasting Blood Sugar",
        category="Blood Sugar",
        min=70.0,
        max=100.0,
        unit="mg/dL",
        explanation_low="Low fasting glucose (hypoglycemia) means insufficient glucose for energy, causing shakiness or dizziness.",
        explanation_high="High fasting blood sugar indicates elevated glucose levels after fasting, a key indicator of prediabetes or diabetes."
    ),
    CatalogEntry(
        id="ppbs",
        name="Postprandial Blood Sugar",
        category="Blood Sugar",
        min=70.0,
        max=140.0,
        unit="mg/dL",
        explanation_low="Low postprandial blood sugar indicates reactive glucose drop after meals.",
        explanation_high="High postprandial blood sugar indicates post-meal glucose intolerance or diabetes."
    ),
    CatalogEntry(
        id="insulin",
        name="Fasting Serum Insulin",
        category="Blood Sugar",
        min=2.6,
        max=24.9,
        unit="uIU/mL",
        explanation_low="Low fasting insulin indicates reduced pancreatic beta cell insulin secretion.",
        explanation_high="High fasting insulin indicates systemic insulin resistance or metabolic compensation."
    ),

    # Vitamins & Iron Studies
    CatalogEntry(
        id="vitamind",
        name="Vitamin D",
        category="Vitamins & Iron Studies",
        min=30.0,
        max=100.0,
        unit="ng/mL",
        explanation_low="Low vitamin D can weaken bone density and reduce immune function.",
        explanation_high="High vitamin D levels can cause hypercalcemia, usually due to excessive supplement intake."
    ),
    CatalogEntry(
        id="vitaminb12",
        name="Vitamin B12",
        category="Vitamins & Iron Studies",
        min=200.0,
        max=900.0,
        unit="pg/mL",
        explanation_low="Low B12 can lead to nerve tingling, fatigue, and megaloblastic anemia.",
        explanation_high="Elevated B12 is often due to high-dose supplement use and is generally non-toxic."
    ),
    CatalogEntry(
        id="ferritin",
        name="Ferritin",
        category="Vitamins & Iron Studies",
        min=15.0,
        max=150.0,
        unit="ng/mL",
        explanation_low="Low ferritin indicates depleted iron stores, the primary cause of iron-deficiency anemia.",
        explanation_high="High ferritin points to excess stored iron or chronic inflammation."
    ),
    CatalogEntry(
        id="iron",
        name="Serum Iron",
        category="Vitamins & Iron Studies",
        min=60.0,
        max=170.0,
        unit="ug/dL",
        explanation_low="Low serum iron indicates insufficient circulating iron for immediate cell creation.",
        explanation_high="High serum iron can indicate iron overload or excessive iron supplement intake."
    ),
    CatalogEntry(
        id="tibc",
        name="Total Iron Binding Capacity (TIBC)",
        category="Vitamins & Iron Studies",
        min=250.0,
        max=450.0,
        unit="ug/dL",
        explanation_low="Low TIBC occurs in iron overload or severe protein deficiency.",
        explanation_high="High TIBC is a classic sign of iron deficiency as transferrin protein increases."
    ),
    CatalogEntry(
        id="transferrin_sat",
        name="Transferrin Saturation",
        category="Vitamins & Iron Studies",
        min=20.0,
        max=50.0,
        unit="%",
        explanation_low="Low transferrin saturation confirms depleted iron availability.",
        explanation_high="High transferrin saturation (>50%) indicates systemic iron overload risk."
    ),
    CatalogEntry(
        id="folate",
        name="Folate (Vitamin B9)",
        category="Vitamins & Iron Studies",
        min=2.7,
        max=17.0,
        unit="ng/mL",
        explanation_low="Low folate causes megaloblastic anemia and fatigue.",
        explanation_high="High folate is generally benign and related to dietary fortification."
    ),

    # Electrolytes & Minerals
    CatalogEntry(
        id="sodium",
        name="Sodium (Na)",
        category="Electrolytes & Minerals",
        min=135.0,
        max=145.0,
        unit="mEq/L",
        explanation_low="Low sodium (hyponatremia) can cause headache, fatigue, confusion, or muscle weakness.",
        explanation_high="High sodium (hypernatremia) indicates dehydration or excessive sodium retention."
    ),
    CatalogEntry(
        id="potassium",
        name="Potassium (K)",
        category="Electrolytes & Minerals",
        min=3.5,
        max=5.2,
        unit="mEq/L",
        explanation_low="Low potassium (hypokalemia) causes muscle cramps, weakness, and risk of heart rhythm changes.",
        explanation_high="High potassium (hyperkalemia) is a serious finding that requires medical evaluation to guard cardiac rhythm."
    ),
    CatalogEntry(
        id="chloride",
        name="Chloride (Cl)",
        category="Electrolytes & Minerals",
        min=96.0,
        max=106.0,
        unit="mEq/L",
        explanation_low="Low chloride can occur with fluid loss, vomiting, or metabolic alkalosis.",
        explanation_high="High chloride can indicate dehydration, kidney dysfunction, or metabolic acidosis."
    ),
    CatalogEntry(
        id="calcium",
        name="Calcium (Ca)",
        category="Electrolytes & Minerals",
        min=8.5,
        max=10.5,
        unit="mg/dL",
        explanation_low="Low calcium (hypocalcemia) can cause muscle twitching, numbness, or bone weakness.",
        explanation_high="High calcium (hypercalcemia) can cause nausea, thirst, kidney stones, and bone pain."
    ),
    CatalogEntry(
        id="phosphorus",
        name="Phosphorus (P)",
        category="Electrolytes & Minerals",
        min=2.5,
        max=4.5,
        unit="mg/dL",
        explanation_low="Low phosphorus can cause muscle weakness, bone pain, and fatigue.",
        explanation_high="High phosphorus is frequently associated with chronic kidney disease."
    ),
    CatalogEntry(
        id="magnesium",
        name="Magnesium (Mg)",
        category="Electrolytes & Minerals",
        min=1.7,
        max=2.2,
        unit="mg/dL",
        explanation_low="Low magnesium can cause muscle cramps, tremors, and irregular heartbeat.",
        explanation_high="High magnesium can cause weakness, sluggish reflexes, and low blood pressure."
    ),

    # Inflammatory & Cardiac
    CatalogEntry(
        id="hscrp",
        name="High-Sensitivity C-Reactive Protein (hs-CRP)",
        category="Inflammatory & Cardiac",
        min=0.0,
        max=3.0,
        unit="mg/L",
        explanation_low="Low hs-CRP demonstrates low systemic arterial vascular inflammation.",
        explanation_high="Elevated hs-CRP indicates systemic inflammation or increased cardiovascular risk."
    ),
    CatalogEntry(
        id="esr",
        name="Erythrocyte Sedimentation Rate (ESR)",
        category="Inflammatory & Cardiac",
        min=0.0,
        max=20.0,
        unit="mm/hr",
        explanation_low="Low ESR is normal and confirms lack of systemic acute-phase protein elevation.",
        explanation_high="High ESR indicates systemic inflammation, infection, or tissue response."
    ),
    CatalogEntry(
        id="troponin_i",
        name="Troponin-I",
        category="Inflammatory & Cardiac",
        min=0.0,
        max=0.04,
        unit="ng/mL",
        explanation_low="Normal low Troponin-I confirms absence of acute heart muscle damage.",
        explanation_high="Elevated Troponin-I is a cardiac emergency marker indicating heart muscle injury."
    ),

    # Hormonal & Endocrine
    CatalogEntry(
        id="total_testosterone",
        name="Total Testosterone",
        category="Hormonal & Endocrine",
        min=300.0,
        max=1000.0,
        unit="ng/dL",
        explanation_low="Low total testosterone can cause fatigue, reduced muscle bulk, and low libido.",
        explanation_high="High total testosterone can be linked to hormone therapy or endocrine conditions."
    ),
    CatalogEntry(
        id="free_testosterone",
        name="Free Testosterone",
        category="Hormonal & Endocrine",
        min=5.0,
        max=21.0,
        unit="pg/mL",
        explanation_low="Low free testosterone indicates reduced tissue-active bioavailable hormone.",
        explanation_high="High free testosterone indicates elevated bioavailable testosterone."
    ),
    CatalogEntry(
        id="estradiol",
        name="Estradiol (E2)",
        category="Hormonal & Endocrine",
        min=10.0,
        max=50.0,
        unit="pg/mL",
        explanation_low="Low estradiol can affect bone mineral density and reproductive health.",
        explanation_high="Elevated estradiol can lead to fluid retention or hormone imbalances."
    ),
    CatalogEntry(
        id="cortisol",
        name="Cortisol",
        category="Hormonal & Endocrine",
        min=6.0,
        max=23.0,
        unit="ug/dL",
        explanation_low="Low cortisol can suggest adrenal fatigue or insufficiency.",
        explanation_high="High cortisol indicates physiological stress, steroid medication effect, or adrenal hyperfunction."
    ),
    CatalogEntry(
        id="progesterone",
        name="Progesterone",
        category="Hormonal & Endocrine",
        min=0.1,
        max=20.0,
        unit="ng/mL",
        explanation_low="Low progesterone can cause menstrual irregularity or luteal dysfunction.",
        explanation_high="High progesterone occurs during ovulation, pregnancy, or supplementation."
    ),
    CatalogEntry(
        id="psa",
        name="Prostate-Specific Antigen (PSA)",
        category="Hormonal & Endocrine",
        min=0.0,
        max=4.0,
        unit="ng/mL",
        explanation_low="Low PSA is reassuring and indicates healthy prostate tissue.",
        explanation_high="Elevated PSA can indicate prostate enlargement, inflammation (prostatitis), or tissue changes."
    ),

    # Pancreatic Function
    CatalogEntry(
        id="lipase",
        name="Lipase",
        category="Pancreatic Function",
        min=10.0,
        max=140.0,
        unit="U/L",
        explanation_low="Low lipase is generally normal.",
        explanation_high="Elevated lipase (>3x upper limit) is a classic indicator of acute pancreatitis."
    ),
    CatalogEntry(
        id="amylase",
        name="Amylase",
        category="Pancreatic Function",
        min=30.0,
        max=110.0,
        unit="U/L",
        explanation_low="Low amylase can occur with chronic pancreatic tissue injury.",
        explanation_high="High amylase points to acute pancreatic or salivary gland inflammation."
    )
]

def get_catalog_entry(test_id: str) -> Optional[CatalogEntry]:
    for entry in CATALOG:
        if entry.id == test_id:
            return entry
    return None
