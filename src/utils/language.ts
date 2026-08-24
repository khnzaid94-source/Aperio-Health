import { SupportedLanguage } from '../types';
import {
    INTERFACE_TRANSLATIONS,
    CATEGORY_TRANSLATIONS,
    TEST_NAME_TRANSLATIONS,
    EXPLANATION_TRANSLATIONS
} from '../constants/translations';
import { CATALOG_INDEX } from '../constants/catalog';

export function getTranslation(key: string, lang: SupportedLanguage, params?: Record<string, string>): string {
    const langDict = INTERFACE_TRANSLATIONS[lang] || INTERFACE_TRANSLATIONS['en'];
    let text = langDict[key] || INTERFACE_TRANSLATIONS['en'][key] || key;

    if (params) {
        Object.entries(params).forEach(([pKey, pVal]) => {
            const safeKey = pKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            text = text.replace(new RegExp(`\\{${safeKey}\\}`, 'g'), () => pVal);
        });
    }

    return text;
}

export function getLocalizedTestName(testId: string, lang: SupportedLanguage): string {
    const nameMap = TEST_NAME_TRANSLATIONS[testId];
    if (nameMap && nameMap[lang]) {
        return nameMap[lang];
    }
    const catEntry = CATALOG_INDEX.get(testId);
    return catEntry ? catEntry.name : testId;
}

export function getLocalizedCategory(category: string, lang: SupportedLanguage): string {
    const catMap = CATEGORY_TRANSLATIONS[category];
    if (catMap && catMap[lang]) {
        return catMap[lang];
    }
    return category;
}

export function getLocalizedExplanation(
    testId: string,
    classification: 'Normal' | 'High' | 'Low',
    lang: SupportedLanguage
): string {
    const catEntry = CATALOG_INDEX.get(testId);
    const testName = catEntry ? catEntry.name : testId;

    if (classification === 'Normal') {
        if (lang === 'hi') {
            return `आपका ${testName} स्तर सामान्य संदर्भ सीमा के भीतर है। यह दर्शाता है कि यह बायोमार्कर संतुलित और स्वस्थ स्थिति में काम कर रहा है।`;
        }
        if (lang === 'mr') {
            return `तुमची ${testName} पातळी सामान्य मर्यादेत आहे. हे दर्शवते की हे बायोमार्कर निरोगी आणि संतुलित स्थितीत आहे.`;
        }
        if (lang === 'es') {
            return `Su nivel de ${testName} se encuentra dentro del rango de referencia estándar, lo que indica un equilibrio biológico saludable y un funcionamiento óptimo.`;
        }
        if (lang === 'fr') {
            return `Votre taux de ${testName} se situe dans la plage de référence normale, ce qui reflète un équilibre physiologique sain et un bon fonctionnement.`;
        }
        return `Your ${testName} level is within the standard healthy reference range. This represents balanced biological function with no immediate signs of deficiency or elevation.`;
    }

    const expObj = EXPLANATION_TRANSLATIONS[testId];
    const key = classification === 'Low' ? 'low' : 'high';

    if (expObj && expObj[key] && expObj[key][lang]) {
        return expObj[key][lang];
    }

    if (catEntry && catEntry.explanations) {
        return classification === 'Low' ? catEntry.explanations.low : catEntry.explanations.high;
    }

    return '';
}

export function getLanguageDirection(_lang: SupportedLanguage): 'ltr' {
    return 'ltr';
}

/**
 * Generates a 1-2 sentence retrospective summary comparing the first recorded value to the most recent value.
 * Strictly describes what has happened without future forecasting.
 */
export function generateRetrospectiveTrendSummary(
    testName: string,
    firstVal: number,
    latestVal: number,
    min: number,
    max: number,
    unit: string,
    lang: SupportedLanguage
): string {
    const diff = latestVal - firstVal;
    let changeText = '';
    
    if (Math.abs(diff) < 0.001) {
        changeText = 'remained constant';
    } else if (diff > 0) {
        changeText = `increased by ${Math.abs(diff).toFixed(1)} ${unit}`;
    } else {
        changeText = `decreased by ${Math.abs(diff).toFixed(1)} ${unit}`;
    }

    // Distance from normal range calculation
    const getDist = (val: number) => {
        if (val < min) return min - val;
        if (val > max) return val - max;
        return 0; // inside normal range
    };

    const firstDist = getDist(firstVal);
    const latestDist = getDist(latestVal);

    let normComparison = '';
    if (firstDist === 0 && latestDist === 0) {
        normComparison = 'and has remained safely within the normal range.';
    } else if (latestDist === 0) {
        normComparison = 'and is now within the normal range.';
    } else if (latestDist < firstDist) {
        normComparison = 'and is now closer to the normal reference range than at your initial reading.';
    } else if (latestDist > firstDist) {
        normComparison = 'and is now further from the normal reference range than at your initial reading.';
    } else {
        normComparison = 'and remains outside the normal range by a similar margin.';
    }

    if (lang === 'en') {
        return `Over your recorded history, your ${testName} level ${changeText} (from ${firstVal} ${unit} to ${latestVal} ${unit}), ${normComparison}`;
    }

    // Basic localized template fallback
    return `History Summary: Your ${testName} level went from ${firstVal} ${unit} to ${latestVal} ${unit} (${changeText}), ${normComparison}`;
}
