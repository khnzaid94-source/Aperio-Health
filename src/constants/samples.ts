export interface SampleReport {
    id: number;
    label: string;
    description: string;
    text: string;
}

export const SAMPLE_REPORTS: SampleReport[] = [
    {
        id: 1,
        label: 'All-Clear Panel (Healthy)',
        description: 'A standard wellness blood test where all parameters are within normal reference ranges.',
        text: `CENTRAL WELLNESS DIAGNOSTICS
DATE: 12-OCT-2025
PATIENT: SAMPLE RECORD #1
==============================================
COMPLETE BLOOD COUNT (CBC)
----------------------------------------------
Hemoglobin (Hb)................... 14.5 g/dL   (Range: 12.0 - 16.0)
White Blood Cell Count (WBC)...... 6.8 x10^3/uL (Range: 4.0 - 11.0)
Platelet Count (PLT).............. 280 x10^3/uL (Range: 150 - 450)
Red Blood Cell Count (RBC)........ 4.8 x10^6/uL (Range: 4.0 - 5.5)
Hematocrit (Hct).................. 42.0 %       (Range: 36.0 - 48.0)

LIPID CARDIOVASCULAR PROFILE
----------------------------------------------
Total Cholesterol................. 175 mg/dL   (Range: 100 - 200)
LDL Cholesterol................... 90 mg/dL    (Range: 50 - 100)
HDL Cholesterol................... 52 mg/dL    (Range: 40 - 60)
Triglycerides..................... 110 mg/dL   (Range: 50 - 150)
==============================================`
    },
    {
        id: 2,
        label: 'Lipid & Blood Sugar Screening',
        description: 'A cardiovascular and metabolic screening showing elevated cholesterol, high triglycerides, and elevated fasting blood sugar.',
        text: `METROPOLITAN CARE LABS
DATE: 04-NOV-2025
PATIENT: SAMPLE RECORD #2
==============================================
METABOLIC & LIPID SCREENING
----------------------------------------------
Total Cholesterol................. 245 mg/dL   (Range: 100 - 200)
LDL Cholesterol................... 165 mg/dL   (Range: 50 - 100)
HDL Cholesterol................... 35 mg/dL    (Range: 40 - 60)
Triglycerides..................... 210 mg/dL   (Range: 50 - 150)
Fasting Blood Sugar (FBS)......... 126 mg/dL   (Range: 70 - 100)
==============================================`
    },
    {
        id: 3,
        label: 'Thyroid Panel Investigation',
        description: 'Underactive thyroid profile (hypothyroidism) flagged with high TSH and slightly depressed thyroid hormones T3 and T4.',
        text: `ENDOCRINE SPEC-LABS
DATE: 18-DEC-2025
PATIENT: SAMPLE RECORD #3
==============================================
THYROID PANEL
----------------------------------------------
Thyroid Stimulating Hormone (TSH). 8.4 uIU/mL   (Range: 0.4 - 4.0)
Triiodothyronine (T3)............. 65 ng/dL    (Range: 80 - 200)
Thyroxine (T4).................... 3.2 ug/dL    (Range: 4.5 - 11.2)
==============================================`
    },
    {
        id: 4,
        label: 'Complete Blood Count & Iron Deficiency',
        description: 'Anemia screen showing low hemoglobin, low red cells, low hematocrit, and severely depleted iron stores (ferritin).',
        text: `HEMALOGIC ASSOCIATES
DATE: 22-JAN-2026
PATIENT: SAMPLE RECORD #4
==============================================
HEMATOLOGY & IRON STUDIES
----------------------------------------------
Hemoglobin (Hb)................... 9.5 g/dL    (Range: 12.0 - 16.0)
Red Blood Cell Count (RBC)........ 3.2 x10^6/uL (Range: 4.0 - 5.5)
Hematocrit (Hct).................. 28.5 %       (Range: 36.0 - 48.0)
Ferritin.......................... 8 ng/mL     (Range: 15 - 150)
==============================================`
    },
    {
        id: 5,
        label: 'Liver & Kidney Panel Check',
        description: 'Comprehensive liver and kidney safety audit revealing elevated ALT and AST enzymes along with high creatinine and urea nitrogen.',
        text: `RENAL & HEPATIC SPECIALLY LABS
DATE: 08-FEB-2026
PATIENT: SAMPLE RECORD #5
==============================================
LIVER & KIDNEY METABOLIC PANEL
----------------------------------------------
Alanine Transaminase (ALT)........ 95 U/L      (Range: 7 - 56)
Aspartate Transaminase (AST)...... 80 U/L      (Range: 8 - 48)
Creatinine........................ 1.8 mg/dL    (Range: 0.6 - 1.2)
Blood Urea Nitrogen (BUN)......... 32 mg/dL    (Range: 7 - 20)
==============================================`
    },
    {
        id: 6,
        label: 'Urgent Diabetes Alert & Misread Safeguard',
        description: 'Triggers the value correction safeguard (misread decimal point) on HbA1c read as 45% (corrected to 4.5%), alongside an urgently high blood glucose value.',
        text: `APEX MEDICAL DIAGNOSTICS
DATE: 15-MAR-2026
PATIENT: SAMPLE RECORD #6
==============================================
DIABETIC SAFETY LOG
----------------------------------------------
HbA1c............................. 45 %        (Range: 4.0 - 5.6)
Fasting Blood Sugar (FBS)......... 295 mg/dL   (Range: 70 - 100)
==============================================`
    },
    {
        id: 7,
        label: 'Reference Range Discrepancy',
        description: 'Demonstrates the reference range cross-check in action: the laboratory printed range for Vitamin D is corrupted as 3.0-10.0 instead of 30-100. System standard is used.',
        text: `VALLEY HEALTH LABS
DATE: 28-APR-2026
PATIENT: SAMPLE RECORD #7
==============================================
VITAMIN SCREENING
----------------------------------------------
Vitamin D......................... 32 ng/mL    (Range: 3.0 - 10.0)
==============================================`
    },
    {
        id: 8,
        label: 'Expanded Advanced Panels (50+ Biomarkers)',
        description: 'Comprehensive advanced diagnostic panel covering Electrolytes, Inflammatory & Cardiac markers, Hormonal & Endocrine profile, and Pancreatic & Iron studies.',
        text: `ADVANCED SPECIALTY INFORMATICS LAB
DATE: 15-JUN-2026
PATIENT: SAMPLE RECORD #8
==============================================
ELECTROLYTES & MINERALS
----------------------------------------------
Sodium (Na)....................... 140 mEq/L   (Range: 135 - 145)
Potassium (K)..................... 4.4 mEq/L   (Range: 3.5 - 5.2)
Chloride (Cl)..................... 102 mEq/L   (Range: 96 - 106)
Calcium (Ca)...................... 9.5 mg/dL   (Range: 8.5 - 10.5)
Phosphorus (P).................... 3.4 mg/dL   (Range: 2.5 - 4.5)
Magnesium (Mg).................... 2.1 mg/dL   (Range: 1.7 - 2.2)

INFLAMMATORY & CARDIAC MARKERS
----------------------------------------------
High-Sensitivity CRP (hs-CRP)..... 1.1 mg/L    (Range: 0.0 - 3.0)
ESR (Sed Rate).................... 14 mm/hr    (Range: 0 - 20)
Troponin-I........................ 0.01 ng/mL  (Range: 0.0 - 0.04)

HORMONAL & ENDOCRINE
----------------------------------------------
Total Testosterone................ 620 ng/dL   (Range: 300 - 1000)
Free Testosterone................. 14.2 pg/mL  (Range: 5.0 - 21.0)
Estradiol (E2).................... 24 pg/mL    (Range: 10 - 50)
Cortisol.......................... 15.2 ug/dL  (Range: 6.0 - 23.0)
Progesterone...................... 0.6 ng/mL   (Range: 0.1 - 20.0)
PSA............................... 0.9 ng/mL   (Range: 0.0 - 4.0)

PANCREATIC & IRON METABOLISM
----------------------------------------------
Lipase............................ 42 U/L      (Range: 10 - 140)
Amylase........................... 58 U/L      (Range: 30 - 110)
Total Iron Binding Capacity (TIBC) 310 ug/dL   (Range: 250 - 450)
Transferrin Saturation............ 34 %        (Range: 20 - 50)
==============================================`
    }
];

import { SavedReport } from '../types';

export const SAMPLE_HISTORY_REPORTS: SavedReport[] = [
    {
        id: 'sample-hist-1',
        date: '2025-08-15',
        label: 'Initial Wellness Screening',
        results: [
            {
                testId: 'fbs',
                name: 'Fasting Blood Sugar',
                category: 'Blood Sugar',
                measuredValue: 145,
                unit: 'mg/dL',
                referenceMin: 70,
                referenceMax: 100,
                classification: 'High',
                urgency: 'Doctor',
                explanation: 'Your fasting blood sugar is significantly elevated above the normal range, which is a major indicator of prediabetes or diabetes.'
            },
            {
                testId: 'hba1c',
                name: 'HbA1c',
                category: 'Blood Sugar',
                measuredValue: 6.8,
                unit: '%',
                referenceMin: 4.0,
                referenceMax: 5.6,
                classification: 'High',
                urgency: 'Doctor',
                explanation: 'An HbA1c level of 6.8% indicates elevated average blood sugar levels over the past 3 months.'
            },
            {
                testId: 'cholesterol',
                name: 'Total Cholesterol',
                category: 'Lipid Profile',
                measuredValue: 230,
                unit: 'mg/dL',
                referenceMin: 100,
                referenceMax: 200,
                classification: 'High',
                urgency: 'Monitor',
                explanation: 'High total cholesterol indicates elevated fats in your bloodstream.'
            },
            {
                testId: 'hemoglobin',
                name: 'Hemoglobin',
                category: 'Complete Blood Count',
                measuredValue: 10.8,
                unit: 'g/dL',
                referenceMin: 12.0,
                referenceMax: 16.0,
                classification: 'Low',
                urgency: 'Monitor',
                explanation: 'Your hemoglobin level is below normal, indicating mild anemia.'
            }
        ]
    },
    {
        id: 'sample-hist-2',
        date: '2025-11-20',
        label: '3-Month Follow-Up Test',
        results: [
            {
                testId: 'fbs',
                name: 'Fasting Blood Sugar',
                category: 'Blood Sugar',
                measuredValue: 128,
                unit: 'mg/dL',
                referenceMin: 70,
                referenceMax: 100,
                classification: 'High',
                urgency: 'Doctor',
                explanation: 'Fasting blood sugar remains elevated above normal range.'
            },
            {
                testId: 'hba1c',
                name: 'HbA1c',
                category: 'Blood Sugar',
                measuredValue: 6.2,
                unit: '%',
                referenceMin: 4.0,
                referenceMax: 5.6,
                classification: 'High',
                urgency: 'Doctor',
                explanation: 'HbA1c is 6.2%, showing progress but still in the prediabetes range.'
            },
            {
                testId: 'cholesterol',
                name: 'Total Cholesterol',
                category: 'Lipid Profile',
                measuredValue: 210,
                unit: 'mg/dL',
                referenceMin: 100,
                referenceMax: 200,
                classification: 'High',
                urgency: 'Monitor',
                explanation: 'Total cholesterol is slightly elevated above 200 mg/dL.'
            },
            {
                testId: 'hemoglobin',
                name: 'Hemoglobin',
                category: 'Complete Blood Count',
                measuredValue: 11.5,
                unit: 'g/dL',
                referenceMin: 12.0,
                referenceMax: 16.0,
                classification: 'Low',
                urgency: 'Monitor',
                explanation: 'Hemoglobin is improving but remains slightly below standard range.'
            }
        ]
    },
    {
        id: 'sample-hist-3',
        date: '2026-02-10',
        label: '6-Month Progress Panel',
        results: [
            {
                testId: 'fbs',
                name: 'Fasting Blood Sugar',
                category: 'Blood Sugar',
                measuredValue: 112,
                unit: 'mg/dL',
                referenceMin: 70,
                referenceMax: 100,
                classification: 'High',
                urgency: 'Monitor',
                explanation: 'Fasting blood sugar is close to normal reference range.'
            },
            {
                testId: 'hba1c',
                name: 'HbA1c',
                category: 'Blood Sugar',
                measuredValue: 5.8,
                unit: '%',
                referenceMin: 4.0,
                referenceMax: 5.6,
                classification: 'High',
                urgency: 'Monitor',
                explanation: 'HbA1c is 5.8%, approaching normal threshold.'
            },
            {
                testId: 'cholesterol',
                name: 'Total Cholesterol',
                category: 'Lipid Profile',
                measuredValue: 195,
                unit: 'mg/dL',
                referenceMin: 100,
                referenceMax: 200,
                classification: 'Normal',
                urgency: 'Normal',
                explanation: ''
            },
            {
                testId: 'hemoglobin',
                name: 'Hemoglobin',
                category: 'Complete Blood Count',
                measuredValue: 12.5,
                unit: 'g/dL',
                referenceMin: 12.0,
                referenceMax: 16.0,
                classification: 'Normal',
                urgency: 'Normal',
                explanation: ''
            }
        ]
    },
    {
        id: 'sample-hist-4',
        date: '2026-05-18',
        label: 'Annual Comprehensive Review',
        results: [
            {
                testId: 'fbs',
                name: 'Fasting Blood Sugar',
                category: 'Blood Sugar',
                measuredValue: 95,
                unit: 'mg/dL',
                referenceMin: 70,
                referenceMax: 100,
                classification: 'Normal',
                urgency: 'Normal',
                explanation: ''
            },
            {
                testId: 'hba1c',
                name: 'HbA1c',
                category: 'Blood Sugar',
                measuredValue: 5.3,
                unit: '%',
                referenceMin: 4.0,
                referenceMax: 5.6,
                classification: 'Normal',
                urgency: 'Normal',
                explanation: ''
            },
            {
                testId: 'cholesterol',
                name: 'Total Cholesterol',
                category: 'Lipid Profile',
                measuredValue: 185,
                unit: 'mg/dL',
                referenceMin: 100,
                referenceMax: 200,
                classification: 'Normal',
                urgency: 'Normal',
                explanation: ''
            },
            {
                testId: 'hemoglobin',
                name: 'Hemoglobin',
                category: 'Complete Blood Count',
                measuredValue: 13.8,
                unit: 'g/dL',
                referenceMin: 12.0,
                referenceMax: 16.0,
                classification: 'Normal',
                urgency: 'Normal',
                explanation: ''
            }
        ]
    }
];
