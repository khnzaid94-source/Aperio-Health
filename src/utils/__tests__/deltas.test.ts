import { describe, it, expect } from 'vitest';
import { computeDeltaAnalysis } from '../deltas';
import type { SavedReport, TestResult } from '../../types';

const result = (
  testId: string,
  value: number,
  min = 12,
  max = 16
): TestResult => ({
  testId,
  name: testId,
  category: 'Test',
  measuredValue: value,
  unit: '',
  referenceMin: min,
  referenceMax: max,
  classification: value < min ? 'Low' : value > max ? 'High' : 'Normal',
  urgency: 'Normal',
  explanation: ''
});

const report = (id: string, date: string, results: ReturnType<typeof result>[]): SavedReport => ({
  id,
  date,
  label: id,
  results
});

describe('computeDeltaAnalysis', () => {
  it('returns null when either report is missing', () => {
    expect(computeDeltaAnalysis(null, report('a', '2026-01-01', [result('hb', 13)]))).toBeNull();
    expect(computeDeltaAnalysis(report('a', '2026-01-01', [result('hb', 13)]), null)).toBeNull();
  });

  it('classifies normalization as improved and worsening as variance', () => {
    const prev = report('a', '2026-01-01', [result('hb', 10.5), result('cr', 0.9, 0.6, 1.2)]);
    const curr = report('b', '2026-06-01', [result('hb', 13.4), result('cr', 1.9, 0.6, 1.2)]);
    const d = computeDeltaAnalysis(prev, curr)!;

    expect(d.totalCompared).toBe(2);
    expect(d.improvedCount).toBe(1);
    expect(d.varianceCount).toBe(1);
    expect(d.deltas.find((x) => x.testId === 'hb')?.status).toBe('improved');
    expect(d.deltas.find((x) => x.testId === 'cr')?.status).toBe('variance');
    expect(d.deltas[0].status).toBe('variance');
  });

  it('detects range crossover as a variance', () => {
    const prev = report('a', '2026-01-01', [result('hb', 10)]);
    const curr = report('b', '2026-06-01', [result('hb', 18)]);
    const d = computeDeltaAnalysis(prev, curr)!;
    expect(d.deltas[0].explanation).toContain('Crossed healthy range');
  });

  it('treats in-range drift as stable', () => {
    const prev = report('a', '2026-01-01', [result('hb', 13.0)]);
    const curr = report('b', '2026-06-01', [result('hb', 13.4)]);
    const d = computeDeltaAnalysis(prev, curr)!;
    expect(d.stableCount).toBe(1);
    expect(d.varianceCount).toBe(0);
  });

  it('ignores biomarkers missing from the previous report', () => {
    const prev = report('a', '2026-01-01', [result('hb', 13)]);
    const curr = report('b', '2026-06-01', [result('hb', 13), result('new_marker', 5, 1, 3)]);
    const d = computeDeltaAnalysis(prev, curr)!;
    expect(d.totalCompared).toBe(1);
  });
});
