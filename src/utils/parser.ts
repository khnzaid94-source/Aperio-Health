import { CATALOG_INDEX, classifyValue, getUrgency } from '../constants/catalog';
import { TestResult } from '../types';
import { getPopulationStats, PatientContext } from './population';

import synonymsData from '../../shared/test_synonyms.json';

interface SynonymFile {
    synonyms: Record<string, string[]>;
    short_abbreviations: string[];
    ultra_short_symbols: string[];
}

const synonymFile = (synonymsData as unknown) as SynonymFile;

const TEST_SYNONYMS: Record<string, string[]> = synonymFile.synonyms;

// Short abbreviations that require strict contextual validation
const SHORT_ABBREVIATIONS = new Set(synonymFile.short_abbreviations);

// Single letter or short 2-letter symbols requiring unit or section context
const ULTRA_SHORT_SYMBOLS = new Set(synonymFile.ultra_short_symbols);
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

export function parseLabReportText(text: string, patientContext?: PatientContext | null): TestResult[] {
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

        const catalogEntry = CATALOG_INDEX.get(matchedTestId!);
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
        let rangeSource: string = 'catalog';

        const popStats = getPopulationStats(matchedTestId!, patientContext);
        if (popStats && popStats.p97_5 > popStats.p2_5 && popStats.p2_5 > 0) {
            const catalogMid = (catalogEntry.min + catalogEntry.max) / 2;
            const popMid = (popStats.p2_5 + popStats.p97_5) / 2;
            const ratio = catalogMid > 0 ? popMid / catalogMid : 1;
            const unitScaleSane = ratio >= 0.25 && ratio <= 4;
            if (unitScaleSane) {
                refMin = popStats.p2_5;
                refMax = popStats.p97_5;
                rangeSource = 'nhanes_p2_5_p97_5';
            }
        }

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
            rangeOverridden,
            rangeSource
        });

        detectedTestIds.add(matchedTestId);
    }

    return results;
}
