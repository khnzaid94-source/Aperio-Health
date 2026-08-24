import { TestResult } from '../types';

export interface SymptomMapping {
    testId: string;
    relevantClassifications: ('Low' | 'High')[];
    physiologicalContext: string;
    customPrompt?: string;
}

export interface SymptomDefinition {
    id: string;
    name: string;
    icon: string;
    description: string;
    mappings: SymptomMapping[];
}

export interface MatchedSymptomPrompt {
    symptomId: string;
    symptomName: string;
    testId: string;
    measuredValueStr: string;
    classification: 'Low' | 'High';
    promptText: string;
    physiologicalContext: string;
}

export const SYMPTOMS: SymptomDefinition[] = [
    {
        id: 'fatigue',
        name: 'Fatigue & Low Energy',
        icon: '⚡',
        description: 'Persistent tiredness, lack of energy, or feeling unrefreshed after sleep',
        mappings: [
            {
                testId: 'ferritin',
                relevantClassifications: ['Low'],
                physiologicalContext: 'depleted iron stores affecting cellular oxygen storage and mitochondrial energy',
                customPrompt: 'You selected Fatigue, and Ferritin is {value}. Ask your doctor if depleted iron stores could be contributing to low energy.'
            },
            {
                testId: 'hemoglobin',
                relevantClassifications: ['Low'],
                physiologicalContext: 'reduced red blood cell oxygen-carrying capacity throughout systemic tissues',
                customPrompt: 'You selected Fatigue, and Hemoglobin is {value}. Ask your doctor if low hemoglobin oxygen transport could be a factor in your fatigue.'
            },
            {
                testId: 'vitamind',
                relevantClassifications: ['Low'],
                physiologicalContext: 'insufficient 25-hydroxy Vitamin D circulating levels impacting musculoskeletal energy',
                customPrompt: 'You selected Fatigue, and Vitamin D is {value}. Ask your doctor if Vitamin D deficiency could be linked to your fatigue.'
            },
            {
                testId: 'vitaminb12',
                relevantClassifications: ['Low'],
                physiologicalContext: 'impaired cellular DNA synthesis and neural cofactor availability',
                customPrompt: 'You selected Fatigue, and Vitamin B12 is {value}. Ask your doctor if Vitamin B12 levels or dietary absorption could be addressed.'
            },
            {
                testId: 'tsh',
                relevantClassifications: ['High'],
                physiologicalContext: 'slowing cellular metabolic rate associated with underactive thyroid signaling',
                customPrompt: 'You selected Fatigue, and TSH is elevated at {value}. Ask your doctor if subclinical thyroid slowing could be contributing to fatigue.'
            }
        ]
    },
    {
        id: 'dizziness',
        name: 'Dizziness / Lightheadedness',
        icon: '💫',
        description: 'Feeling unsteady, woozy, or lightheaded upon standing or exertion',
        mappings: [
            {
                testId: 'hemoglobin',
                relevantClassifications: ['Low'],
                physiologicalContext: 'diminished cerebral oxygen delivery during positional changes',
                customPrompt: 'You selected Dizziness, and Hemoglobin is {value}. Ask your doctor if lower oxygen-carrying capacity could be contributing to lightheadedness.'
            },
            {
                testId: 'hematocrit',
                relevantClassifications: ['Low'],
                physiologicalContext: 'reduced total red blood cell volume impacting orthostatic hemodynamics',
                customPrompt: 'You selected Dizziness, and Hematocrit is {value}. Ask your doctor if lower red cell volume could relate to feeling lightheaded.'
            },
            {
                testId: 'fbs',
                relevantClassifications: ['Low', 'High'],
                physiologicalContext: 'acute blood glucose fluctuations affecting brain energy availability',
                customPrompt: 'You selected Dizziness, and Fasting Blood Sugar is {value}. Ask your doctor if blood glucose fluctuations could be involved.'
            }
        ]
    },
    {
        id: 'cold_sensitivity',
        name: 'Cold Sensitivity / Chills',
        icon: '❄️',
        description: 'Feeling unusually cold, chilly hands or feet, or intolerance to cool temperatures',
        mappings: [
            {
                testId: 'tsh',
                relevantClassifications: ['High'],
                physiologicalContext: 'reduced metabolic thermogenesis regulated by the pituitary-thyroid axis',
                customPrompt: 'You selected Cold Sensitivity, and TSH is elevated at {value}. Ask your doctor if lower thyroid activity could be reducing heat production.'
            },
            {
                testId: 't4',
                relevantClassifications: ['Low'],
                physiologicalContext: 'lower circulating thyroxine availability for basal metabolic rate regulation',
                customPrompt: 'You selected Cold Sensitivity, and T4 is {value}. Ask your doctor if thyroid hormone balance could be influencing your cold sensitivity.'
            },
            {
                testId: 't3',
                relevantClassifications: ['Low'],
                physiologicalContext: 'reduced triiodothyronine stimulation of active cellular thermogenesis',
                customPrompt: 'You selected Cold Sensitivity, and T3 is {value}. Ask your doctor if active thyroid hormone levels could be related to feeling chilly.'
            },
            {
                testId: 'ferritin',
                relevantClassifications: ['Low'],
                physiologicalContext: 'low tissue iron levels required for efficient cellular heat generation',
                customPrompt: 'You selected Cold Sensitivity, and Ferritin is {value}. Ask your doctor if low iron storage could be affecting temperature regulation.'
            },
            {
                testId: 'hemoglobin',
                relevantClassifications: ['Low'],
                physiologicalContext: 'reduced peripheral microvascular perfusion and oxygen transport',
                customPrompt: 'You selected Cold Sensitivity, and Hemoglobin is {value}. Ask your doctor if reduced red cell count could be related to cold extremities.'
            }
        ]
    },
    {
        id: 'joint_stiffness',
        name: 'Joint & Muscle Stiffness',
        icon: '🦴',
        description: 'Morning joint aches, musculoskeletal stiffness, or joint discomfort',
        mappings: [
            {
                testId: 'uricacid',
                relevantClassifications: ['High'],
                physiologicalContext: 'elevated circulating urate with potential for microcrystalline joint irritation',
                customPrompt: 'You selected Joint Stiffness, and Uric Acid is {value}. Ask your doctor if uric acid levels could be contributing to joint discomfort.'
            },
            {
                testId: 'vitamind',
                relevantClassifications: ['Low'],
                physiologicalContext: 'Vitamin D insufficiency contributing to bone turnover stress or muscular aching',
                customPrompt: 'You selected Joint/Muscle Stiffness, and Vitamin D is {value}. Ask your doctor if Vitamin D deficiency could be linked to musculoskeletal soreness.'
            }
        ]
    },
    {
        id: 'frequent_thirst',
        name: 'Excessive Thirst / Dry Mouth',
        icon: '💧',
        description: 'Unquenchable thirst, frequent urination, or persistent mouth dryness',
        mappings: [
            {
                testId: 'fbs',
                relevantClassifications: ['High'],
                physiologicalContext: 'osmotic fluid shifts and renal glucose clearance driving increased fluid intake',
                customPrompt: 'You selected Excessive Thirst, and Fasting Blood Sugar is {value}. Ask your doctor if elevated glucose levels could be causing increased thirst.'
            },
            {
                testId: 'hba1c',
                relevantClassifications: ['High'],
                physiologicalContext: 'sustained glycemic elevation over recent months altering systemic osmotic balance',
                customPrompt: 'You selected Excessive Thirst, and HbA1c is {value}. Ask your doctor if multi-month glucose levels could be related to persistent thirst.'
            }
        ]
    },
    {
        id: 'muscle_cramps',
        name: 'Muscle Cramps & Spasms',
        icon: '🦵',
        description: 'Sudden leg or foot cramps, muscle twitching, or involuntary tightening',
        mappings: [
            {
                testId: 'vitamind',
                relevantClassifications: ['Low'],
                physiologicalContext: 'altered neuromuscular excitability and mineral homeostasis regulation',
                customPrompt: 'You selected Muscle Cramps, and Vitamin D is {value}. Ask your doctor if Vitamin D insufficiency affecting neuromuscular balance could be a factor.'
            },
            {
                testId: 'bun',
                relevantClassifications: ['High'],
                physiologicalContext: 'hydration shifts and pre-renal urea concentration changes affecting muscle hydration',
                customPrompt: 'You selected Muscle Cramps, and BUN is {value}. Ask your doctor if hydration balance or urea clearance shifts could be related to muscle cramping.'
            },
            {
                testId: 'creatinine',
                relevantClassifications: ['High'],
                physiologicalContext: 'intracellular water shifts or altered renal filtration clearance',
                customPrompt: 'You selected Muscle Cramps, and Creatinine is {value}. Ask your doctor if hydration status or kidney filtration markers could be involved.'
            }
        ]
    }
];

/**
 * Cross-references a specific biomarker result with user-selected symptoms.
 * Returns tailored educational discussion prompts without making medical diagnoses.
 */
export function findSymptomPromptsForBiomarker(
    result: TestResult,
    selectedSymptomIds: string[]
): MatchedSymptomPrompt[] {
    if (!selectedSymptomIds || selectedSymptomIds.length === 0) return [];
    if (result.classification === 'Normal') return [];

    const prompts: MatchedSymptomPrompt[] = [];
    const valStr = `${result.measuredValue} ${result.unit}`;

    for (const symptomId of selectedSymptomIds) {
        const symptom = SYMPTOMS.find(s => s.id === symptomId);
        if (!symptom) continue;

        const matchingMapping = symptom.mappings.find(
            m => m.testId === result.testId && m.relevantClassifications.includes(result.classification as 'Low' | 'High')
        );

        if (matchingMapping) {
            const promptText = matchingMapping.customPrompt
                ? matchingMapping.customPrompt.replace('{value}', valStr)
                : `You selected ${symptom.name}, and ${result.name} is ${result.classification.toLowerCase()} at ${valStr}. Ask your doctor if ${matchingMapping.physiologicalContext} could be contributing.`;

            prompts.push({
                symptomId: symptom.id,
                symptomName: symptom.name,
                testId: result.testId,
                measuredValueStr: valStr,
                classification: result.classification as 'Low' | 'High',
                promptText,
                physiologicalContext: matchingMapping.physiologicalContext
            });
        }
    }

    return prompts;
}
