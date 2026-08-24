import { CATALOG, classifyValue, getUrgency } from '../constants/catalog';
import { TestResult } from '../types';

const TEST_SYNONYMS: Record<string, string[]> = {
    // Complete Blood Count
    hemoglobin: ['hemoglobin', 'haemoglobin', 'hb', 'hgb', 'total hemoglobin'],
    wbc: ['total leukocyte count', 'total leucocyte count', 'white blood cell count', 'white blood cell', 'wbc', 'tlc', 'leukocyte count', 'leukocytes'],
    platelets: ['platelet count', 'platelets', 'plt', 'platelet', 'total platelet count'],
    rbc: ['total rbc count', 'red blood cell count', 'red blood cell', 'rbc', 'erythrocyte count', 'erythrocytes', 'red blood cells'],
    hematocrit: ['hematocrit value, hct', 'hematocrit', 'hct', 'pcv', 'packed cell volume'],
    mcv: ['mean corpuscular volume', 'mcv'],
    mch: ['mean corpuscular hemoglobin', 'mch'],
    mchc: ['mean corpuscular hemoglobin concentration', 'mchc'],
    rdw: ['red cell distribution width', 'rdw', 'rdw-cv', 'rdw-sd'],
    neutrophils: ['neutrophils', 'neutrophil percentage', 'absolute neutrophil count', 'anc', 'neutrophil'],

    // Lipid Profile
    cholesterol: ['total cholesterol', 'serum cholesterol', 'cholesterol', 'tc'],
    ldl: ['ldl cholesterol', 'serum ldl', 'ldl-c', 'ldl'],
    hdl: ['hdl cholesterol', 'serum hdl', 'hdl-c', 'hdl'],
    triglycerides: ['serum triglycerides', 'triglycerides', 'tg', 'trig'],
    vldl: ['vldl cholesterol', 'serum vldl', 'vldl-c', 'vldl'],
    non_hdl: ['non-hdl cholesterol', 'non hdl cholesterol', 'non-hdl'],
    chol_hdl_ratio: ['total cholesterol / hdl ratio', 'cholesterol/hdl ratio', 'chol/hdl ratio', 'tc/hdl'],

    // Thyroid Panel
    tsh: ['thyroid stimulating hormone', 's.tsh', 'serum tsh', 'tsh'],
    t3: ['triiodothyronine', 'total t3', 't3'],
    t4: ['thyroxine', 'total t4', 't4'],
    ft3: ['free triiodothyronine', 'free t3', 'ft3'],
    ft4: ['free thyroxine', 'free t4', 'ft4'],
    anti_tpo: ['anti-thyroid peroxidase', 'anti-tpo', 'tpo antibodies', 'anti tpo'],

    // Liver Function
    alt: ['sgpt (alt)', 'alanine transaminase', 'alanine aminotransferase', 'alt', 'sgpt', 's.g.p.t'],
    ast: ['sgot (ast)', 'aspartate transaminase', 'aspartate aminotransferase', 'ast', 'sgot', 's.g.o.t'],
    bilirubin: ['serum bilirubin (total)', 'total bilirubin', 'bilirubin (total)', 'bilirubin', 'tbil', 's.bilirubin'],
    alp: ['serum alkaline phosphatase', 'alkaline phosphatase', 'alp', 'alk phos', 's.alkaline phosphatase'],
    direct_bilirubin: ['direct bilirubin', 'conjugated bilirubin', 'dbil'],
    ggt: ['gamma-glutamyl transferase', 'gamma gt', 'ggt', 'ggtp'],
    total_protein: ['total serum protein', 'total protein', 's.protein'],
    albumin: ['serum albumin', 'albumin', 'alb'],

    // Kidney Function
    creatinine: ['serum creatinine', 'creatinine', 'cre', 'creat', 's.creatinine'],
    bun: ['blood urea nitrogen', 'bun', 'serum urea', 'blood urea', 'urea', 's.urea'],
    uricacid: ['serum uric acid', 'uric acid', 'ua', 's.uric acid'],
    egfr: ['estimated gfr', 'estimated glomerular filtration rate', 'egfr', 'gfr'],

    // Blood Sugar
    hba1c: ['hba1c', 'glycated hemoglobin', 'glycohemoglobin', 'a1c'],
    fbs: ['fasting blood sugar', 'fbs', 'fasting glucose', 'fpg', 'fasting blood glucose'],
    ppbs: ['postprandial blood sugar', 'ppbs', 'post prandial glucose', 'post-prandial blood sugar', 'ppg', 'rbs', 'random blood sugar'],
    insulin: ['fasting insulin', 'serum insulin', 'insulin'],

    // Vitamins & Iron Studies
    vitamind: ['vitamin d', '25-oh vitamin d', 'vit d', '25-hydroxy vitamin d'],
    vitaminb12: ['vitamin b12', 'cobalamin', 'vit b12', 'b12'],
    ferritin: ['serum ferritin', 'ferritin', 'fer', 's.ferritin'],
    iron: ['serum iron', 'total iron', 'fe', 's.iron'],
    tibc: ['total iron binding capacity', 'tibc'],
    transferrin_sat: ['transferrin saturation', 'iron saturation', 'transferrin sat', '% saturation'],
    folate: ['serum folate', 'folic acid', 'folate', 'vitamin b9'],

    // Electrolytes & Minerals
    sodium: ['serum sodium', 'sodium (na)', 'sodium', 'na+', 'na'],
    potassium: ['serum potassium', 'potassium (k)', 'potassium', 'k+', 'k'],
    chloride: ['serum chloride', 'chloride (cl)', 'chloride', 'cl-', 'cl'],
    calcium: ['serum calcium', 'calcium (ca)', 'calcium', 'ca++', 'ca'],
    phosphorus: ['serum phosphorus', 'phosphorus (p)', 'phosphorus', 'phosphate', 'p'],
    magnesium: ['serum magnesium', 'magnesium (mg)', 'magnesium', 'mg++', 'mg'],

    // Inflammatory & Cardiac
    hscrp: ['high-sensitivity c-reactive protein', 'hs-crp', 'hscrp', 'c-reactive protein', 'crp'],
    esr: ['erythrocyte sedimentation rate', 'esr', 'sed rate'],
    troponin_i: ['troponin-i', 'troponin i', 'trop i', 'hs-troponin'],

    // Hormonal & Endocrine
    total_testosterone: ['total testosterone', 'testosterone total', 'testosterone'],
    free_testosterone: ['free testosterone', 'testosterone free'],
    estradiol: ['estradiol (e2)', 'estradiol', 'e2', 'serum estradiol'],
    cortisol: ['serum cortisol', 'cortisol', 'morning cortisol'],
    progesterone: ['serum progesterone', 'progesterone', 'prog'],
    psa: ['prostate-specific antigen', 'psa', 'total psa'],

    // Pancreatic Function
    lipase: ['serum lipase', 'lipase'],
    amylase: ['serum amylase', 'amylase']
};

const SHORT_ABBREVIATIONS = new Set([
    'hb', 'hgb', 'wbc', 'tlc', 'plt', 'rbc', 'hct', 'pcv', 'mcv', 'mch', 'mchc', 'rdw',
    'anc', 'tc', 'ldl', 'hdl', 'tg', 'vldl', 'tsh', 't3', 't4', 'ft3', 'ft4', 'alt',
    'ast', 'alp', 'ggt', 'cre', 'bun', 'ua', 'gfr', 'egfr', 'a1c', 'fbs', 'rbs', 'fpg',
    'ppbs', 'ppg', 'b12', 'fer', 'fe', 'tibc', 'na', 'k', 'cl', 'ca', 'p', 'mg', 'crp',
    'hscrp', 'esr', 'e2', 'psa'
]);

// Single letter or short 2-letter symbols requiring strict matching unit or section context (e.g. K, Ca, P, Na, Cl, Mg, Fe, E2)
const ULTRA_SHORT_SYMBOLS = new Set([
    'k', 'ca', 'p', 'na', 'cl', 'mg', 'fe', 'e2', 'hb', 'ua', 'tc', 'k+', 'na+', 'cl-', 'ca++', 'mg++'
]);

// Clinical measurement units pattern
const CLINICAL_UNIT_PATTERN = /(\b(meq\/l|mmol\/l|mg\/dl|ug\/dl|ng\/ml|pg\/ml|iu\/l|u\/l|fl|mm\/hr|g\/dl|%|cumm|x10\^3|x10\^6|ratio|ml\/min|ng\/dl)\b)/i;

// Section / Clinical context keywords pattern
const CLINICAL_CONTEXT_PATTERN = /(\b(electrolyte|mineral|biochemistry|metabolic|chemistry|serum|hormone|lipid|thyroid|blood|panel|test|specimen|lab|result|reference|range|cardiac|inflammatory|pancreatic|endocrine)\b)/i;

function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildSynonymPattern(synonym: string): RegExp {
    const words = synonym.trim().split(/\s+/);
    if (words.length > 1) {
        const inner = words.map(w => escapeRegExp(w)).join('[\\s\\.\\-_:]*');
        return new RegExp(`(?:\\b|\\()${inner}(?:\\b|\\)|:)`, 'i');
    }
    return new RegExp(`(?:\\b|\\()${escapeRegExp(synonym)}(?:\\b|\\)|:)`, 'i');
}

export function parseLabReportText(text: string): TestResult[] {
    if (!text || !text.trim()) return [];

    const rawLines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const results: TestResult[] = [];
    const detectedTestIds = new Set<string>();

    for (let idx = 0; idx < rawLines.length; idx++) {
        const line = rawLines[idx];
        let matchedTestId: string | null = null;
        let matchedIndex = -1;
        let matchedLength = 0;

        // Match test synonym in this line
        for (const [testId, synonyms] of Object.entries(TEST_SYNONYMS)) {
            if (detectedTestIds.has(testId)) continue;

            for (const syn of synonyms) {
                const pattern = buildSynonymPattern(syn);
                const m = pattern.exec(line);
                if (m && m.index !== undefined) {
                    const cleanSyn = syn.toLowerCase().trim();

                    // CRITICAL OCR COLLISION GUARD:
                    // For short/single-letter symbols (like K, Ca, P, Na, Cl, Mg, Fe, E2),
                    // REQUIRE a matching unit or section context in the line or adjacent line
                    // to prevent false matches on words like "10k copies" or "Ca. 1990" or "p.m.".
                    if (ULTRA_SHORT_SYMBOLS.has(cleanSyn)) {
                        const nearbyText = [
                            line,
                            idx > 0 ? rawLines[idx - 1] : '',
                            idx + 1 < rawLines.length ? rawLines[idx + 1] : ''
                        ].join(' ');

                        const hasUnit = CLINICAL_UNIT_PATTERN.test(nearbyText);
                        const hasSectionContext = CLINICAL_CONTEXT_PATTERN.test(nearbyText);

                        if (!hasUnit && !hasSectionContext) {
                            continue; // Skip false positive match
                        }
                    } else if (SHORT_ABBREVIATIONS.has(cleanSyn)) {
                        const hasClinicalContext = /(\d+|\b(mg\/dl|g\/dl|u\/l|u\/i|%|mmol|cumm|lakhs|meq\/l|fl|pg\/ml|ng\/ml)\b|:|=|-)/i.test(line);
                        const nextHasNumber = idx + 1 < rawLines.length && /\d+/.test(rawLines[idx + 1]);
                        if (!hasClinicalContext && !nextHasNumber) {
                            continue;
                        }
                    }

                    matchedTestId = testId;
                    matchedIndex = m.index;
                    matchedLength = m[0].length;
                    break;
                }
            }
            if (matchedTestId) break;
        }

        if (!matchedTestId) continue;

        const catalogEntry = CATALOG.find(item => item.id === matchedTestId);
        if (!catalogEntry) continue;

        let rawVal: number | null = null;
        let extMin: number | null = null;
        let extMax: number | null = null;
        let foundUnit = catalogEntry.unit;

        // 1. First check the rest of the same line after the actual regex match position
        const sliceFrom = matchedIndex >= 0 ? matchedIndex + matchedLength : 0;
        const restOfLine = line.substring(sliceFrom).trim();

        const valMatch = restOfLine.match(/(\d+(?:,\d+)*(?:\.\d+)?)/);
        if (valMatch && valMatch.index !== undefined) {
            const cleanStr = valMatch[1].replace(/,/g, '');
            const parsed = parseFloat(cleanStr);
            if (!isNaN(parsed)) {
                rawVal = parsed;
                const afterVal = restOfLine.substring(valMatch.index + valMatch[0].length);
                const rngMatch = afterVal.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:-|–|to)\s*(\d+(?:,\d+)*(?:\.\d+)?)/i);
                if (rngMatch) {
                    extMin = parseFloat(rngMatch[1].replace(/,/g, ''));
                    extMax = parseFloat(rngMatch[2].replace(/,/g, ''));
                }
            }
        }

        // 2. If not found on same line, scan subsequent lines in multi-line table format
        if (rawVal === null) {
            for (let offset = 1; offset < Math.min(6, rawLines.length - idx); offset++) {
                const nextLine = rawLines[idx + offset];

                // If next line starts another known test, stop looking
                let isAnotherTest = false;
                for (const [, syns] of Object.entries(TEST_SYNONYMS)) {
                    for (const s of syns) {
                        if (buildSynonymPattern(s).test(nextLine)) {
                            isAnotherTest = true;
                            break;
                        }
                    }
                    if (isAnotherTest) break;
                }
                if (isAnotherTest) break;

                // Ignore status flags like 'L', 'H', 'NORMAL', 'HIGH', 'LOW'
                if (/^(L|H|NORMAL|HIGH|LOW)$/i.test(nextLine.trim())) {
                    continue;
                }

                // Check for unit
                if (/(lakh|cumm|g\/dl|mg\/dl|u\/i|u\/l|%|mmol|meq\/l|fl|pg\/ml|ng\/ml|iu\/l|million)/i.test(nextLine)) {
                    foundUnit = nextLine.trim();
                }

                // Check for numeric value on standalone number line
                if (rawVal === null) {
                    const numMatch = nextLine.match(/^\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*$/);
                    if (numMatch) {
                        const parsed = parseFloat(numMatch[1].replace(/,/g, ''));
                        if (!isNaN(parsed)) {
                            rawVal = parsed;
                            continue;
                        }
                    }

                    // Number with unit attached
                    const numWithUnitMatch = nextLine.match(/^\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:mg\/dl|g\/dl|%|cumm|u\/i|u\/l|meq\/l|fl|pg\/ml|ng\/ml|lakhs)/i);
                    if (numWithUnitMatch) {
                        const parsed = parseFloat(numWithUnitMatch[1].replace(/,/g, ''));
                        if (!isNaN(parsed)) {
                            rawVal = parsed;
                            continue;
                        }
                    }
                }

                // Check for reference range on next line
                if (extMin === null) {
                    const rngMatch2 = nextLine.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:-|–|to)\s*(\d+(?:,\d+)*(?:\.\d+)?)/i);
                    if (rngMatch2) {
                        const pMin = parseFloat(rngMatch2[1].replace(/,/g, ''));
                        const pMax = parseFloat(rngMatch2[2].replace(/,/g, ''));
                        if (!isNaN(pMin) && !isNaN(pMax)) {
                            extMin = pMin;
                            extMax = pMax;
                        }
                    }
                }
            }
        }

        if (rawVal === null || isNaN(rawVal)) {
            continue;
        }

        let refMin = catalogEntry.min;
        let refMax = catalogEntry.max;
        let rangeOverridden = false;

        if (extMin !== null && extMax !== null && extMin < extMax) {
            // Unit scale checks (platelets in lakhs vs x10^3, wbc in cumm vs x10^3)
            if (matchedTestId === 'platelets' && extMax < 10.0) {
                refMin = extMin;
                refMax = extMax;
                foundUnit = 'lakhs/cumm';
            } else if (matchedTestId === 'wbc' && extMax > 1000.0) {
                refMin = extMin;
                refMax = extMax;
                foundUnit = 'cumm';
            } else {
                const minRatio = catalogEntry.min > 0 ? extMin / catalogEntry.min : 1.0;
                const maxRatio = catalogEntry.max > 0 ? extMax / catalogEntry.max : 1.0;

                if (minRatio < 0.25 || minRatio > 3.5 || maxRatio < 0.25 || maxRatio > 3.5) {
                    refMin = catalogEntry.min;
                    refMax = catalogEntry.max;
                    rangeOverridden = true;
                } else {
                    refMin = extMin;
                    refMax = extMax;
                }
            }
        }

        // Apply Value Correction Safeguard (dropped decimal point)
        let measuredValue = rawVal;
        let isAutoCorrected = false;
        let originalValue: number | undefined;

        const standardMax = refMax;
        const rangeWidth = refMax - refMin;
        const closeMin = refMin - 0.2 * rangeWidth;
        const closeMax = refMax + 0.2 * rangeWidth;

        if (rawVal > 4.0 * standardMax && !((matchedTestId === 'wbc' || matchedTestId === 'platelets') && rawVal > 500)) {
            const correctedValue = rawVal / 10.0;
            if (correctedValue >= closeMin && correctedValue <= closeMax) {
                measuredValue = correctedValue;
                isAutoCorrected = true;
                originalValue = rawVal;
            }
        }

        // Run classification and urgency checks
        const classification = classifyValue(matchedTestId, measuredValue, { min: refMin, max: refMax });
        const urgency = getUrgency(matchedTestId, measuredValue, classification, { min: refMin, max: refMax });

        // Build default English explanation (UI localizes on display)
        let explanation = '';
        if (classification === 'Low') {
            explanation = catalogEntry.explanations.low;
        } else if (classification === 'High') {
            explanation = catalogEntry.explanations.high;
        } else {
            explanation = `Your ${catalogEntry.name} level is within the normal reference range (${refMin} - ${refMax} ${foundUnit}), representing healthy biological balance.`;
        }

        results.push({
            testId: matchedTestId,
            name: catalogEntry.name,
            category: catalogEntry.category,
            measuredValue,
            unit: foundUnit,
            referenceMin: refMin,
            referenceMax: refMax,
            classification,
            urgency,
            explanation,
            isAutoCorrected,
            originalValue,
            rangeOverridden
        });

        detectedTestIds.add(matchedTestId);
    }

    return results;
}
