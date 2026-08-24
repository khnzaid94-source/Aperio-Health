import { CATALOG_INDEX } from '../constants/catalog';
import { SavedReport, TestResult } from '../types';

export interface BiomarkerDelta {
    testId: string;
    name: string;
    category: string;
    unit: string;
    prevValue: number;
    currValue: number;
    diff: number;
    referenceMin: number;
    referenceMax: number;
    status: 'improved' | 'variance' | 'stable';
    arrow: '↑' | '↓' | '→';
    diffSign: string;
    formattedTransition: string;
    explanation: string;
}

export interface DeltaAnalysis {
    latestLabel: string;
    latestDate: string;
    prevLabel: string;
    prevDate: string;
    deltas: BiomarkerDelta[];
    improvedCount: number;
    varianceCount: number;
    stableCount: number;
    totalCompared: number;
}

const EPSILON = 0.0001;

const formatNum = (v: number) =>
    Number.isInteger(v) ? v.toString() : Number(v.toFixed(2)).toString();

export function computeDeltaAnalysis(
    previous?: SavedReport | null,
    latest?: SavedReport | null
): DeltaAnalysis | null {
    if (!latest?.results || !previous?.results) {
        return null;
    }

    const prevMap = new Map<string, TestResult>();
    previous.results.forEach((r) => {
        if (r?.testId) prevMap.set(r.testId, r);
    });

    const deltas: BiomarkerDelta[] = [];
    let improvedCount = 0;
    let varianceCount = 0;
    let stableCount = 0;

    latest.results.forEach((curr) => {
        if (!curr?.testId || !prevMap.has(curr.testId)) return;

        const prev = prevMap.get(curr.testId)!;
        if (
            typeof curr.measuredValue !== 'number' ||
            isNaN(curr.measuredValue) ||
            typeof prev.measuredValue !== 'number' ||
            isNaN(prev.measuredValue)
        ) {
            return;
        }

        const catItem = CATALOG_INDEX.get(curr.testId);
        const min =
            typeof curr.referenceMin === 'number' && !isNaN(curr.referenceMin)
                ? curr.referenceMin
                : (catItem?.min ?? 0);
        const max =
            typeof curr.referenceMax === 'number' && !isNaN(curr.referenceMax)
                ? curr.referenceMax
                : (catItem?.max ?? 100);

        const getDistance = (val: number) => {
            if (val < min) return min - val;
            if (val > max) return val - max;
            return 0;
        };

        const prevDist = getDistance(prev.measuredValue);
        const currDist = getDistance(curr.measuredValue);
        const diff = curr.measuredValue - prev.measuredValue;

        let status: BiomarkerDelta['status'] = 'stable';
        let explanation = '';

        const crossedOver =
            (prev.measuredValue < min && curr.measuredValue > max) ||
            (prev.measuredValue > max && curr.measuredValue < min);

        if (crossedOver) {
            status = 'variance';
            explanation = 'Crossed healthy range from one abnormal side to the other.';
        } else if (prevDist === 0 && currDist === 0) {
            status = 'stable';
            explanation = 'Remained steady within normal reference bounds.';
        } else if (prevDist > 0 && currDist === 0) {
            status = 'improved';
            explanation = 'Normalized back into standard healthy range.';
        } else if (prevDist > 0 && currDist > 0 && currDist < prevDist - EPSILON) {
            status = 'improved';
            explanation = 'Moved closer toward normal reference range.';
        } else if (prevDist === 0 && currDist > 0) {
            status = 'variance';
            explanation = 'Moved outside normal reference boundaries.';
        } else if (prevDist > 0 && currDist > 0 && currDist > prevDist + EPSILON) {
            status = 'variance';
            explanation = 'Deviated further from normal reference baseline.';
        } else {
            status = 'stable';
            explanation = 'Maintained consistent level relative to baseline.';
        }

        if (status === 'improved') improvedCount++;
        else if (status === 'variance') varianceCount++;
        else stableCount++;

        const absDiff = Math.abs(diff);
        const formattedAbsDiff = formatNum(absDiff);

        let arrow: '↑' | '↓' | '→' = '→';
        let diffSign = '0';
        if (diff > EPSILON) {
            arrow = '↑';
            diffSign = `+${formattedAbsDiff}`;
        } else if (diff < -EPSILON) {
            arrow = '↓';
            diffSign = `-${formattedAbsDiff}`;
        }

        const unit = curr.unit || prev.unit || '';
        let formattedTransition = '';

        if (unit === '%') {
            formattedTransition = `${formatNum(prev.measuredValue)}% → ${formatNum(curr.measuredValue)}% (${arrow} ${diffSign}%)`;
        } else if (unit) {
            formattedTransition = `${formatNum(prev.measuredValue)} → ${formatNum(curr.measuredValue)} ${unit} (${arrow} ${diffSign} ${unit})`;
        } else {
            formattedTransition = `${formatNum(prev.measuredValue)} → ${formatNum(curr.measuredValue)} (${arrow} ${diffSign})`;
        }

        deltas.push({
            testId: curr.testId,
            name: curr.name || catItem?.name || curr.testId,
            category: curr.category || catItem?.category || '',
            unit,
            prevValue: prev.measuredValue,
            currValue: curr.measuredValue,
            diff,
            referenceMin: min,
            referenceMax: max,
            status,
            arrow,
            diffSign,
            formattedTransition,
            explanation
        });
    });

    deltas.sort((a, b) => {
        const priority = { variance: 0, improved: 1, stable: 2 };
        return priority[a.status] - priority[b.status];
    });

    return {
        latestLabel: latest.label || 'Visit B',
        latestDate: latest.date || 'Recent',
        prevLabel: previous.label || 'Visit A',
        prevDate: previous.date || 'Earlier',
        deltas,
        improvedCount,
        varianceCount,
        stableCount,
        totalCompared: deltas.length
    };
}
