import { UserProfile, JournalEntry } from '../types';

export interface DrugInteractionRule {
    drugClass: string;
    genericNames: string[];
    brandNames: string[];
    targetBiomarkerIds: string[];
    effectDirection: 'elevates' | 'suppresses' | 'interferes_assay';
    clinicalMechanism: string;
    patientGuidance: string;
    summaryTemplate?: string;
}

export interface MatchedDrugInteraction {
    rule: DrugInteractionRule;
    matchedMedication: string;
    matchedDrugName: string;
    biomarkerId: string;
    summaryText: string;
}

export const DRUG_INTERACTIONS: DrugInteractionRule[] = [
    // 1. Statins (HMG-CoA Reductase Inhibitors)
    {
        drugClass: 'Statins (HMG-CoA Reductase Inhibitors)',
        genericNames: ['atorvastatin', 'rosuvastatin', 'simvastatin', 'pravastatin', 'lovastatin', 'fluvastatin', 'pitavastatin', 'statin'],
        brandNames: ['Lipitor', 'Crestor', 'Zocor', 'Pravachol', 'Mevacor', 'Lescol', 'Livalo'],
        targetBiomarkerIds: ['alt', 'ast'],
        effectDirection: 'elevates',
        clinicalMechanism: 'Statins undergo hepatic metabolism and can cause benign, transient transaminase leakage (ALT/AST) through cell membrane permeability changes without intrinsic hepatotoxicity.',
        patientGuidance: 'Do not discontinue statin therapy abruptly. Mild elevations under 3x reference upper limit are standardly monitored in 8–12 weeks rather than requiring medication cessation.',
        summaryTemplate: '{drug} may mildly elevate liver transaminases (ALT/AST)'
    },

    // 2. Metformin (Biguanide)
    {
        drugClass: 'Biguanides (Metformin)',
        genericNames: ['metformin', 'metformin hcl', 'glucophage xr', 'fortamet'],
        brandNames: ['Glucophage', 'Glumetza', 'Fortamet', 'Riomet', 'Janumet', 'Comboglyze'],
        targetBiomarkerIds: ['vitaminb12'],
        effectDirection: 'suppresses',
        clinicalMechanism: 'Long-term metformin therapy interferes with calcium-dependent membrane uptake of the intrinsic factor-Vitamin B12 complex in the terminal ileum, gradually depleting B12 stores.',
        patientGuidance: 'Periodic annual Vitamin B12 screening is standard clinical practice with metformin use. Ask your physician if oral B12 supplementation or dietary adjustments are warranted.',
        summaryTemplate: '{drug} may reduce gastrointestinal Vitamin B12 absorption over time'
    },

    // 3. Biotin (Vitamin B7 / Immunoassay Interferent)
    {
        drugClass: 'Biotin (Vitamin B7 / Multivitamins)',
        genericNames: ['biotin', 'vitamin b7', 'vitamin h', 'coenzyme r', 'b-complex'],
        brandNames: ['Biotin', 'Hair Skin & Nails', 'Super B-Complex', 'Merz', 'Centrum'],
        targetBiomarkerIds: ['tsh', 't3', 't4', 'ferritin'],
        effectDirection: 'interferes_assay',
        clinicalMechanism: 'Exogenous biotin chemically binds to streptavidin in laboratory immunoassay analyzers, generating false-positive high free T3/T4 and artifactually low TSH readings.',
        patientGuidance: 'Biotin does not alter true physiological hormone concentrations. Endocrinologists advise pausing high-dose biotin supplements 48–72 hours prior to follow-up thyroid blood draws.',
        summaryTemplate: '{drug} chemically interferes with immunoassays, causing falsely low TSH or distorted hormone values'
    },

    // 4. Levothyroxine / Thyroid Replacement
    {
        drugClass: 'Thyroid Hormone Replacement',
        genericNames: ['levothyroxine', 'liothyronine', 'desiccated thyroid', 'thyroid extract', 'l-thyroxine'],
        brandNames: ['Synthroid', 'Levoxyl', 'Tirosint', 'Unithroid', 'Cytomel', 'Armour Thyroid', 'Eltroxin'],
        targetBiomarkerIds: ['tsh', 't4', 't3'],
        effectDirection: 'suppresses',
        clinicalMechanism: 'Exogenous thyroxine replaces deficient endogenous hormone, suppressing pituitary TSH production via negative feedback while elevating circulating free T4/T3 levels.',
        patientGuidance: 'Thyroid hormone replacement takes 6–8 weeks to achieve biochemical steady state. Review abnormal TSH or T4 results with your doctor before modifying daily tablet dosages.',
        summaryTemplate: '{drug} regulates thyroid hormone levels and suppresses pituitary TSH secretion'
    },

    // 5. ACE Inhibitors & ARBs (Renal Hemodynamics)
    {
        drugClass: 'ACE Inhibitors & ARBs',
        genericNames: ['lisinopril', 'losartan', 'enalapril', 'ramipril', 'valsartan', 'telmisartan', 'benazepril', 'candesartan', 'olmesartan', 'irbesartan'],
        brandNames: ['Zestril', 'Prinivil', 'Cozaar', 'Vasotec', 'Altace', 'Diovan', 'Micardis', 'Lotensin', 'Avapro', 'Benicar'],
        targetBiomarkerIds: ['creatinine', 'bun'],
        effectDirection: 'elevates',
        clinicalMechanism: 'Inhibition of angiotensin II dilates renal efferent arterioles, reducing intraglomerular pressure and causing a mild, expected 10–30% rise in serum creatinine and BUN.',
        patientGuidance: 'A modest creatinine elevation upon starting or increasing ACE/ARB dose is a recognized hemodynamic response that provides long-term kidney protection. Discuss this reading with your doctor.',
        summaryTemplate: '{drug} may cause a mild, benign baseline increase in creatinine and BUN'
    },

    // 6. Loop & Thiazide Diuretics
    {
        drugClass: 'Diuretics (Thiazide & Loop)',
        genericNames: ['furosemide', 'hydrochlorothiazide', 'hctz', 'torsemide', 'bumetanide', 'chlorthalidone', 'indapamide', 'spironolactone'],
        brandNames: ['Lasix', 'Microzide', 'Demadex', 'Bumex', 'Thalitone', 'Aldactone'],
        targetBiomarkerIds: ['uricacid', 'bun', 'creatinine'],
        effectDirection: 'elevates',
        clinicalMechanism: 'Diuretic-induced mild plasma volume contraction enhances renal tubular reabsorption and competitively impairs uric acid and urea clearance, elevating serum uric acid and BUN.',
        patientGuidance: 'Ensure consistent hydration. Diuretic therapy frequently causes asymptomatic hyperuricemia or pre-renal BUN increases; report any sudden joint redness or pain to your clinician.',
        summaryTemplate: '{drug} may elevate serum uric acid and BUN through mild volume shifts'
    },

    // 7. Proton Pump Inhibitors (PPIs) & H2 Blockers
    {
        drugClass: 'Proton Pump Inhibitors (PPIs)',
        genericNames: ['omeprazole', 'pantoprazole', 'esomeprazole', 'lansoprazole', 'rabeprazole', 'famotidine'],
        brandNames: ['Prilosec', 'Protonix', 'Nexium', 'Prevacid', 'Aciphex', 'Pepcid'],
        targetBiomarkerIds: ['vitaminb12', 'vitamind'],
        effectDirection: 'suppresses',
        clinicalMechanism: 'Prolonged gastric acid suppression impairs the enzymatic cleavage of protein-bound Vitamin B12 and reduces gastrointestinal absorption efficiency of micronutrients.',
        patientGuidance: 'Chronic PPI use (>1 year) is associated with reduced micronutrient uptake. Discuss periodic B12 testing or an oral supplement plan with your healthcare provider.',
        summaryTemplate: '{drug} may reduce gastrointestinal Vitamin B12 and micronutrient absorption'
    },

    // 8. Oral & Systemic Corticosteroids
    {
        drugClass: 'Corticosteroids (Glucocorticoids)',
        genericNames: ['prednisone', 'prednisolone', 'methylprednisolone', 'dexamethasone', 'hydrocortisone', 'budesonide'],
        brandNames: ['Deltasone', 'Medrol', 'Decadron', 'Solu-Medrol', 'Cortef', 'Entocort'],
        targetBiomarkerIds: ['fbs', 'hba1c', 'wbc'],
        effectDirection: 'elevates',
        clinicalMechanism: 'Glucocorticoids stimulate hepatic gluconeogenesis, induce peripheral insulin resistance, and trigger the demargination of vascular neutrophils, elevating blood glucose and WBC counts.',
        patientGuidance: 'Steroid-induced glucose surges and white blood cell elevations are common and generally reversible with dose tapering. Never adjust steroid doses without physician guidance.',
        summaryTemplate: '{drug} may transiently elevate fasting glucose and white blood cell (WBC) counts'
    },

    // 9. Iron Supplements
    {
        drugClass: 'Iron Replacements',
        genericNames: ['ferrous sulfate', 'ferrous gluconate', 'ferrous fumarate', 'iron polysaccharide', 'iron', 'ferric'],
        brandNames: ['Slow Fe', 'Feosol', 'Fer-In-Sol', 'Feraheme', 'Injectafer', 'Venofer'],
        targetBiomarkerIds: ['ferritin', 'hemoglobin', 'hematocrit', 'rbc'],
        effectDirection: 'elevates',
        clinicalMechanism: 'Exogenous iron progressively replenishes intracellular ferritin iron stores and supplies essential substrate for bone marrow erythropoiesis, raising hemoglobin and hematocrit.',
        patientGuidance: 'Ferritin and red blood cell counts reflect therapeutic iron replenishment over several weeks. Continue taking iron as directed and discuss any gastrointestinal symptoms with your doctor.',
        summaryTemplate: '{drug} replenishes intracellular ferritin iron stores and supports RBC synthesis'
    },

    // 10. SGLT2 Inhibitors
    {
        drugClass: 'SGLT2 Inhibitors',
        genericNames: ['empagliflozin', 'dapagliflozin', 'canagliflozin', 'ertugliflozin'],
        brandNames: ['Jardiance', 'Farxiga', 'Invokana', 'Steglatro', 'Synjardy', 'Xigduo'],
        targetBiomarkerIds: ['fbs', 'hba1c', 'creatinine', 'bun', 'hematocrit'],
        effectDirection: 'suppresses',
        clinicalMechanism: 'SGLT2 inhibitors block proximal renal glucose reabsorption to lower blood sugar and HbA1c, while mild osmotic diuresis may cause transient, reversible creatinine/BUN shifts and slight hematocrit rises.',
        patientGuidance: 'A minor initial creatinine increase reflects intended renal protective hemodynamic shifts. Maintain adequate daily fluid intake and review results with your doctor.',
        summaryTemplate: '{drug} lowers blood glucose and may induce a mild initial creatinine/BUN variance'
    },

    // 11. Non-Steroidal Anti-Inflammatory Drugs (NSAIDs)
    {
        drugClass: 'NSAIDs (Anti-Inflammatories)',
        genericNames: ['ibuprofen', 'naproxen', 'meloxicam', 'celecoxib', 'diclofenac', 'indomethacin', 'ketorolac', 'aspirin'],
        brandNames: ['Advil', 'Motrin', 'Aleve', 'Mobic', 'Celebrex', 'Voltaren', 'Naprosyn', 'Bayer'],
        targetBiomarkerIds: ['creatinine', 'bun', 'uricacid'],
        effectDirection: 'elevates',
        clinicalMechanism: 'NSAIDs inhibit renal prostaglandins that maintain afferent arteriolar vasodilation, transiently reducing glomerular filtration rate and elevating serum creatinine and BUN.',
        patientGuidance: 'Frequent or high-dose NSAID usage can stress kidney filtration. Mention your over-the-counter pain reliever intake to your doctor if renal parameters appear elevated.',
        summaryTemplate: '{drug} may transiently reduce renal filtration and elevate creatinine/BUN'
    },

    // 12. Fibrates (Peroxisome Proliferator-Activated Receptor Alpha Agonists)
    {
        drugClass: 'Fibrates (Lipid Regulators)',
        genericNames: ['fenofibrate', 'gemfibrozil', 'fenofibric acid'],
        brandNames: ['Tricor', 'Lopid', 'Trilipix', 'Antara', 'Lipofen'],
        targetBiomarkerIds: ['triglycerides', 'creatinine', 'alt', 'ast'],
        effectDirection: 'suppresses',
        clinicalMechanism: 'Fibrates stimulate PPAR-alpha to markedly lower serum triglycerides, while inhibiting tubular creatinine secretion which can cause a benign, reversible rise in serum creatinine and mild transaminase shifts.',
        patientGuidance: 'A mild elevation in creatinine is a recognized, reversible pharmacodynamic effect of fibrates. Discuss with your physician to distinguish medication effect from primary renal disease.',
        summaryTemplate: '{drug} lowers triglycerides and may induce reversible serum creatinine or transaminase shifts'
    },

    // 13. Allopurinol & Uric Acid Lowering Agents
    {
        drugClass: 'Xanthine Oxidase Inhibitors',
        genericNames: ['allopurinol', 'febuxostat', 'probenecid'],
        brandNames: ['Zyloprim', 'Aloprim', 'Uloric', 'Probalan'],
        targetBiomarkerIds: ['uricacid', 'alt', 'ast'],
        effectDirection: 'suppresses',
        clinicalMechanism: 'Xanthine oxidase inhibition blocks the enzymatic oxidation of hypoxanthine to xanthine and uric acid, significantly lowering circulating uric acid to prevent gout crystal precipitation.',
        patientGuidance: 'Target serum uric acid is generally maintained below 6.0 mg/dL. Continue daily therapy as directed and discuss any acute joint symptoms or liver enzyme monitoring with your doctor.',
        summaryTemplate: '{drug} lowers serum uric acid production to prevent crystal deposition'
    },

    // 14. Vitamin D3 Supplements
    {
        drugClass: 'Vitamin D Supplements',
        genericNames: ['cholecalciferol', 'ergocalciferol', 'vitamin d3', 'vitamin d2', 'calcitriol', 'vitamin d'],
        brandNames: ['Vitamin D3', 'D-Vi-Sol', 'Drisdol', 'Rocaltrol', 'Bio-D3'],
        targetBiomarkerIds: ['vitamind'],
        effectDirection: 'elevates',
        clinicalMechanism: 'Exogenous cholecalciferol undergoes hepatic 25-hydroxylation to form 25-hydroxyvitamin D, directly replenishing circulating storage pools to optimize systemic mineral homeostasis.',
        patientGuidance: 'Consistent supplementation steadily elevates serum Vitamin D levels. High-dose repletion therapy should be rechecked in 8–12 weeks to ensure target levels (30–100 ng/mL) without over-supplementation.',
        summaryTemplate: '{drug} directly elevates circulating 25-hydroxy Vitamin D stores'
    },

    // 15. Combined Hormonal Contraceptives & Estrogens
    {
        drugClass: 'Estrogens & Oral Contraceptives',
        genericNames: ['ethinyl estradiol', 'estradiol', 'levonorgestrel', 'drospirenone', 'norethindrone', 'estrogen', 'birth control'],
        brandNames: ['Yaz', 'Yasmin', 'Ortho Tri-Cyclen', 'NuvaRing', 'Estrostep', 'Premarin', 'Sprintec'],
        targetBiomarkerIds: ['triglycerides', 'cholesterol', 't4'],
        effectDirection: 'elevates',
        clinicalMechanism: 'Exogenous estrogens induce hepatic synthesis of transport globulins (including thyroxine-binding globulin) and hepatic VLDL output, elevating total T4 and serum triglycerides.',
        patientGuidance: 'Estrogen therapies commonly elevate total circulating binding fractions and triglyceride levels without reflecting intrinsic metabolic or thyroid dysfunction.',
        summaryTemplate: '{drug} can elevate thyroxine-binding globulin and circulating triglycerides'
    },

    // 16. Testosterone Replacement Therapy (TRT) & Androgens
    {
        drugClass: 'Androgens / Testosterone Replacement',
        genericNames: ['testosterone', 'testosterone cypionate', 'testosterone enanthate', 'testosterone gel', 'androgen'],
        brandNames: ['AndroGel', 'Depo-Testosterone', 'Testim', 'Fortesta', 'Axiron', 'Aveed'],
        targetBiomarkerIds: ['hematocrit', 'hemoglobin', 'rbc', 'hdl'],
        effectDirection: 'elevates',
        clinicalMechanism: 'Exogenous androgens stimulate renal erythropoietin production and bone marrow erythropoiesis, raising hematocrit and red cell mass while mildly suppressing HDL clearance.',
        patientGuidance: 'Routine hematocrit and CBC monitoring is standard with testosterone therapy to guard against secondary polycythemia. Review elevated hematocrit levels with your prescribing clinician.',
        summaryTemplate: '{drug} stimulates red blood cell production and may elevate hematocrit'
    }
];

/**
 * Extracts a normalized, clean list of active medications and supplements from UserProfile and JournalEntry records.
 */
export function extractActiveMedications(
    userProfile?: UserProfile | null,
    journalEntries?: JournalEntry[]
): string[] {
    const rawList: string[] = [];

    if (userProfile?.medications) {
        // Split by commas, semicolons, or newlines
        const items = userProfile.medications.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
        rawList.push(...items);
    }

    if (journalEntries && Array.isArray(journalEntries)) {
        journalEntries.forEach(entry => {
            if ((entry.entry_type === 'medication' || entry.entry_type === 'supplement') && entry.name) {
                const trimmed = entry.name.trim();
                if (trimmed) rawList.push(trimmed);
            }
        });
    }

    // Deduplicate case-insensitively while preserving original casing
    const seen = new Set<string>();
    const uniqueList: string[] = [];

    for (const med of rawList) {
        const lower = med.toLowerCase();
        if (!seen.has(lower)) {
            seen.add(lower);
            uniqueList.push(med);
        }
    }

    return uniqueList;
}

/**
 * Helper to match an active medication string against a DrugInteractionRule.
 * Returns the matched display name (e.g. "Atorvastatin" or "Synthroid") if matched, or null.
 */
export function matchMedicationToRule(medicationString: string, rule: DrugInteractionRule): string | null {
    const medLower = medicationString.toLowerCase();

    // Check brand names first for exact/substring match
    for (const brand of rule.brandNames) {
        const brandLower = brand.toLowerCase();
        if (medLower.includes(brandLower)) {
            return brand;
        }
    }

    // Check generic names
    for (const generic of rule.genericNames) {
        const genericLower = generic.toLowerCase();
        if (medLower.includes(genericLower)) {
            // Capitalize first letter for display
            return generic.charAt(0).toUpperCase() + generic.slice(1);
        }
    }

    return null;
}

/**
 * Cross-references active medications with a specific biomarker.
 * Returns all matching drug interaction rules with contextual details.
 */
export function findDrugInteractionsForBiomarker(
    testId: string,
    userProfile?: UserProfile | null,
    journalEntries?: JournalEntry[]
): MatchedDrugInteraction[] {
    const activeMeds = extractActiveMedications(userProfile, journalEntries);
    if (activeMeds.length === 0) return [];

    const matches: MatchedDrugInteraction[] = [];
    const matchedRuleClasses = new Set<string>();

    for (const med of activeMeds) {
        for (const rule of DRUG_INTERACTIONS) {
            if (rule.targetBiomarkerIds.includes(testId)) {
                const matchedName = matchMedicationToRule(med, rule);
                if (matchedName && !matchedRuleClasses.has(rule.drugClass)) {
                    matchedRuleClasses.add(rule.drugClass);
                    
                    const summary = (rule.summaryTemplate || '{drug} may impact this biomarker')
                        .replace('{drug}', matchedName);

                    matches.push({
                        rule,
                        matchedMedication: med,
                        matchedDrugName: matchedName,
                        biomarkerId: testId,
                        summaryText: summary
                    });
                }
            }
        }
    }

    return matches;
}
