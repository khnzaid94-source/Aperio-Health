import { SupportedLanguage } from '../types';
import {
    INTERFACE_TRANSLATIONS,
    CATEGORY_TRANSLATIONS,
    TEST_NAME_TRANSLATIONS,
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
