import catalogData from '../../shared/catalog.json';
import { CatalogEntry, ClassificationType, UrgencyType } from '../types';

interface RawCatalogEntry {
    id: string;
    name: string;
    category: string;
    unit: string;
    min: number;
    max: number;
    explanation_low: string;
    explanation_high: string;
}

const rawTests = ((catalogData as unknown) as { tests: RawCatalogEntry[] }).tests;

export const CATALOG: CatalogEntry[] = rawTests.map((t) => ({
    id: t.id,
    name: t.name,
    category: t.category,
    min: t.min,
    max: t.max,
    unit: t.unit,
    explanations: {
        low: t.explanation_low,
        high: t.explanation_high
    }
}));

export const CATALOG_INDEX: Map<string, CatalogEntry> = new Map(
    CATALOG.map((entry) => [entry.id, entry])
);

export function classifyValue(testId: string, value: number, customRange?: { min: number, max: number }): ClassificationType {
    const entry = CATALOG_INDEX.get(testId);
    if (!entry) return 'Normal';

    const min = customRange ? customRange.min : entry.min;
    const max = customRange ? customRange.max : entry.max;

    if (value < min) return 'Low';
    if (value > max) return 'High';
    return 'Normal';
}

export function getUrgency(
    testId: string,
    value: number,
    classification: ClassificationType,
    customRange?: { min: number, max: number }
): UrgencyType {
    if (classification === 'Normal') return 'Normal';

    const entry = CATALOG_INDEX.get(testId);
    if (!entry) return 'Normal';

    const min = customRange ? customRange.min : entry.min;
    const max = customRange ? customRange.max : entry.max;

    const rangeWidth = max - min;
    if (rangeWidth <= 0) return 'Monitor';

    let deviation = 0;
    if (classification === 'High') {
        deviation = (value - max) / rangeWidth;
    } else if (classification === 'Low') {
        deviation = (min - value) / rangeWidth;
    }

    // Margin threshold: 0.25 (25% outside the range)
    if (deviation > 0.25) {
        return 'Doctor';
    }
    return 'Monitor';
}
