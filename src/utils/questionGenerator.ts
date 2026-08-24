import { TestResult, UserProfile, JournalEntry } from '../types';

/**
 * Generates 3–4 tailored, collaborative, non-defensive questions for the doctor's consultation
 * based on abnormal biomarkers, medications, and general health context.
 */
export function generateDoctorQuestions(
    results: TestResult[],
    userProfile?: UserProfile | null,
    journalEntries?: JournalEntry[]
): string[] {
    const questions: string[] = [];

    // Helper to get measured value and unit
    const getValStr = (res: TestResult) => `${res.measuredValue} ${res.unit}`;

    // Helper to find a specific result
    const findResult = (id: string) => results.find(r => r.testId === id);

    // Collect all abnormal results
    const abnormalResults = results.filter(r => r.classification !== 'Normal');

    // Extract medication information from both profile and journal entries
    const medicationsList: string[] = [];
    if (userProfile?.medications) {
        medicationsList.push(...userProfile.medications.toLowerCase().split(',').map(m => m.trim()));
    }
    if (journalEntries) {
        journalEntries.forEach(entry => {
            if (entry.entry_type === 'medication' && entry.name) {
                medicationsList.push(entry.name.toLowerCase());
            }
        });
    }

    const hasStatin = medicationsList.some(med =>
        ['atorvastatin', 'simvastatin', 'rosuvastatin', 'pravastatin', 'lovastatin', 'fluvastatin', 'pitavastatin', 'statin'].some(s => med.includes(s))
    );

    const getStatinName = () => {
        const found = medicationsList.find(med =>
            ['atorvastatin', 'simvastatin', 'rosuvastatin', 'pravastatin', 'lovastatin', 'fluvastatin', 'pitavastatin', 'statin'].some(s => med.includes(s))
        );
        if (found) {
            // Capitalize first letter of the first word
            const word = found.split(' ')[0];
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return 'statin';
    };

    // 1. Elevated ALT/AST + Statin in profile
    const altResult = findResult('alt');
    const astResult = findResult('ast');
    const isAltHigh = altResult && altResult.classification === 'High';
    const isAstHigh = astResult && astResult.classification === 'High';

    if ((isAltHigh || isAstHigh) && hasStatin) {
        const value = altResult ? getValStr(altResult) : (astResult ? getValStr(astResult) : '');
        const markerName = altResult ? 'ALT' : 'AST';
        const statinName = getStatinName();
        questions.push(`My ${markerName} is slightly elevated at ${value}. Could this be related to my daily ${statinName}, or should we monitor liver enzymes in 8–12 weeks?`);
    }

    // 2. Elevated Fasting Glucose + Normal HbA1c
    const fbsResult = findResult('fbs');
    const hba1cResult = findResult('hba1c');
    const isFbsHigh = fbsResult && fbsResult.classification === 'High';
    const isHba1cNormalOrNotPresent = !hba1cResult || hba1cResult.classification === 'Normal';

    if (isFbsHigh && isHba1cNormalOrNotPresent) {
        questions.push(`My fasting glucose was ${getValStr(fbsResult)}, but my 3-month HbA1c is within target. Would a repeat fasting check or glucose tolerance test be helpful?`);
    }

    // 3. Low Ferritin / Borderline Hemoglobin
    const ferritinResult = findResult('ferritin');
    const hemoglobinResult = findResult('hemoglobin');
    const isFerritinLow = ferritinResult && ferritinResult.classification === 'Low';
    
    // Borderline hemoglobin: present, and classification is Low or measuredValue is within 1.0 of referenceMin
    const isHemoglobinBorderlineOrLow = hemoglobinResult && (
        hemoglobinResult.classification === 'Low' || 
        (hemoglobinResult.measuredValue >= hemoglobinResult.referenceMin && 
         hemoglobinResult.measuredValue <= hemoglobinResult.referenceMin + 1.0)
    );

    if (isFerritinLow || isHemoglobinBorderlineOrLow) {
        if (ferritinResult) {
            questions.push(`My ferritin is at ${getValStr(ferritinResult)}. Would dietary iron adjustments or supplementation be recommended before hemoglobin declines?`);
        } else if (hemoglobinResult) {
            questions.push(`My hemoglobin is borderline or low at ${getValStr(hemoglobinResult)}. Would checking my ferritin levels or dietary iron adjustments be helpful to understand this trend?`);
        }
    }

    // 4. Elevated TSH + Thyroid medication
    const tshResult = findResult('tsh');
    const isTshHigh = tshResult && tshResult.classification === 'High';
    const hasThyroidMed = medicationsList.some(med =>
        ['levothyroxine', 'synthroid', 'thyroxine', 'armour', 'liothyronine', 'cytomel'].some(t => med.includes(t))
    );
    if (isTshHigh && hasThyroidMed) {
        const medName = medicationsList.find(med =>
            ['levothyroxine', 'synthroid', 'thyroxine', 'armour', 'liothyronine', 'cytomel'].some(t => med.includes(t))
        );
        const medCap = medName ? medName.charAt(0).toUpperCase() + medName.slice(1) : 'thyroid medication';
        questions.push(`My TSH is elevated at ${getValStr(tshResult)}. Could my ${medCap} dose need adjustment, or should we monitor this for a few more weeks first?`);
    }

    // 5. Low Vitamin D
    const vitDResult = findResult('vitamind');
    if (vitDResult && vitDResult.classification === 'Low') {
        questions.push(`My Vitamin D level is low at ${getValStr(vitDResult)}. Would a short-term therapeutic supplement or a daily maintenance dose of Vitamin D3 be recommended?`);
    }

    // 6. Low Vitamin B12
    const vitB12Result = findResult('vitaminb12');
    if (vitB12Result && vitB12Result.classification === 'Low') {
        questions.push(`My Vitamin B12 is below range at ${getValStr(vitB12Result)}. Would oral B12 supplementation be suitable, or should we investigate dietary intake and absorption?`);
    }

    // 7. Elevated LDL / Cholesterol + No Statin
    const ldlResult = findResult('ldl');
    const cholResult = findResult('cholesterol');
    if (((ldlResult && ldlResult.classification === 'High') || (cholResult && cholResult.classification === 'High')) && !hasStatin) {
        const res = ldlResult || cholResult;
        if (res) {
            questions.push(`My ${res.name} is elevated at ${getValStr(res)}. Do you recommend focusing strictly on diet, exercise, and lifestyle optimizations first before discussing medical therapy?`);
        }
    }

    // 8. Elevated Creatinine / BUN
    const creatinineResult = findResult('creatinine');
    const bunResult = findResult('bun');
    if ((creatinineResult && creatinineResult.classification === 'High') || (bunResult && bunResult.classification === 'High')) {
        const res = creatinineResult || bunResult;
        if (res) {
            questions.push(`My ${res.name} is slightly elevated at ${getValStr(res)}. Could transient factors like hydration status or recent exercise impact this, or should we plan a repeat renal panel?`);
        }
    }

    // Fallback/Generic Tailored Questions based on remaining abnormal markers
    // Collect IDs of abnormal markers we already explicitly addressed
    const addressedIds = new Set<string>();
    if ((isAltHigh || isAstHigh) && hasStatin) {
        if (altResult) addressedIds.add('alt');
        if (astResult) addressedIds.add('ast');
    }
    if (isFbsHigh && isHba1cNormalOrNotPresent) {
        addressedIds.add('fbs');
    }
    if (isFerritinLow || isHemoglobinBorderlineOrLow) {
        if (ferritinResult) addressedIds.add('ferritin');
        if (hemoglobinResult) addressedIds.add('hemoglobin');
    }
    if (isTshHigh && hasThyroidMed) addressedIds.add('tsh');
    if (vitDResult && vitDResult.classification === 'Low') addressedIds.add('vitamind');
    if (vitB12Result && vitB12Result.classification === 'Low') addressedIds.add('vitaminb12');
    if (((ldlResult && ldlResult.classification === 'High') || (cholResult && cholResult.classification === 'High')) && !hasStatin) {
        if (ldlResult) addressedIds.add('ldl');
        if (cholResult) addressedIds.add('cholesterol');
    }
    if ((creatinineResult && creatinineResult.classification === 'High') || (bunResult && bunResult.classification === 'High')) {
        if (creatinineResult) addressedIds.add('creatinine');
        if (bunResult) addressedIds.add('bun');
    }

    const unaddressedAbnormals = abnormalResults.filter(r => !addressedIds.has(r.testId));

    for (const res of unaddressedAbnormals) {
        if (questions.length >= 4) break;
        if (res.classification === 'High') {
            questions.push(`My ${res.name} is elevated at ${getValStr(res)}. What are the most common lifestyle, diet, or health factors associated with this, and how should we monitor it?`);
        } else if (res.classification === 'Low') {
            questions.push(`My ${res.name} is below target at ${getValStr(res)}. Would you suggest dietary modifications, direct supplementation, or further testing to investigate this?`);
        }
    }

    // If still have fewer than 3 questions, let's look at any other abnormal results even if we already addressed them in a specific pattern, but make sure the question wording is unique
    if (questions.length < 3) {
        for (const res of abnormalResults) {
            if (questions.length >= 4) break;
            const alreadyMentioned = questions.some(q => q.toLowerCase().includes(res.name.toLowerCase()));
            if (!alreadyMentioned) {
                if (res.classification === 'High') {
                    questions.push(`My ${res.name} is currently high at ${getValStr(res)}. Could we discuss what clinical or lifestyle adjustments would help bring this back within target range?`);
                } else if (res.classification === 'Low') {
                    questions.push(`My ${res.name} is currently low at ${getValStr(res)}. What potential root causes should we look into, or is this a minor fluctuation?`);
                }
            }
        }
    }

    // Absolute fallback general clinical questions if there are 0 or very few abnormal biomarkers:
    const generalQuestions = [
        "Based on my overall results, are there any specific dietary or lifestyle optimizations you would recommend I prioritize over the next six months?",
        "How do my lipid panel and metabolic markers look overall, and does my current cardiovascular risk profile require any protective adjustments?",
        "Are there any baseline health biomarkers or screening panels that we didn't test this time that you would recommend adding to my next blood draw?",
        "Given my current medications and age, are there any mineral or vitamin interactions we should keep an eye on before my next laboratory panel?"
    ];

    for (const genQ of generalQuestions) {
        if (questions.length >= 3) break;
        questions.push(genQ);
    }

    return questions.slice(0, 4);
}
