import { describe, it, expect } from 'vitest';
import { parseLabReportText } from '../parser';

const MALE_30 = { gender: 'Male', age: 30 };
const FEMALE_30 = { gender: 'Female', age: 30 };

describe('parseLabReportText', () => {
  it('parses a standard panel with values and printed ranges', () => {
    const text = `LABORATORY REPORT
Specimen Date: 08/20/2026
Hemoglobin (Hb)      13.5 g/dL   (Range: 12.0 - 16.0)
White Blood Cell Count  7.2 x10^3/uL (4.0 - 11.0)
Total Cholesterol     210 mg/dL   (100 - 200)
Hemoglobin A1c        6.9 %`;
    const r = Object.fromEntries(parseLabReportText(text).map((x) => [x.testId, x]));

    expect(r.hemoglobin.measuredValue).toBe(13.5);
    expect(r.wbc.measuredValue).toBe(7.2);
    expect(r.cholesterol.classification).toBe('High');
    expect(r.hba1c.measuredValue).toBe(6.9);
  });

  it('rejects non-medical text', () => {
    expect(parseLabReportText('The quick brown fox jumps over 10k copies of p.m. notes')).toHaveLength(0);
  });

  it('auto-corrects dropped decimal points within tolerance', () => {
    const r = parseLabReportText('Serum Creatinine 7.5 mg/dL (0.6 - 1.2)');
    const creat = r.find((x) => x.testId === 'creatinine');
    expect(creat?.isAutoCorrected).toBe(true);
    expect(creat?.measuredValue).toBeCloseTo(0.75, 5);
  });

  it('never decimal-corrects huge WBC counts', () => {
    const r = parseLabReportText('Total Leukocyte Count 850000 /uL (4000 - 11000)');
    const wbc = r.find((x) => x.testId === 'wbc');
    expect(wbc?.isAutoCorrected).toBeFalsy();
  });

  it('parses OCR-collision names at the true match position', () => {
    const r = parseLabReportText('TotalCholesterol 180 mg/dL (Range 100-200)');
    expect(r.find((x) => x.testId === 'cholesterol')?.measuredValue).toBe(180);
  });

  it('prefers the printed lab range over population percentiles', () => {
    const text = 'Hemoglobin (Hb)      13.5 g/dL   (Range: 12.0 - 16.0)';
    const hb = parseLabReportText(text, MALE_30).find((x) => x.testId === 'hemoglobin');
    expect(hb?.rangeSource).toBe('catalog');
    expect(hb?.referenceMin).toBe(12.0);
    expect(hb?.referenceMax).toBe(16.0);
  });

  it('applies NHANES sex-specific percentiles when no printed range exists', () => {
    const text = 'Hemoglobin\n13.5 g/dL';
    const male = parseLabReportText(text, MALE_30).find((x) => x.testId === 'hemoglobin');
    expect(male?.rangeSource).toBe('nhanes_p2_5_p97_5');
    expect(male?.referenceMin).toBeCloseTo(13.2, 1);
    expect(male?.referenceMax).toBeGreaterThan(17);
    expect(male?.classification).toBe('Normal');
  });

  it('demonstrates real population sex differences (Hb 16.5)', () => {
    const text = 'Hemoglobin\n16.5 g/dL';
    const m = parseLabReportText(text, MALE_30).find((x) => x.testId === 'hemoglobin');
    const f = parseLabReportText(text, FEMALE_30).find((x) => x.testId === 'hemoglobin');
    expect(m?.classification).toBe('Normal');
    expect(f?.classification).toBe('High');
  });

  it('falls back to catalog ranges for markers without NHANES coverage', () => {
    const tsh = parseLabReportText('TSH 6.5 uIU/mL (0.4 - 4.0)', MALE_30).find(
      (x) => x.testId === 'tsh'
    );
    expect(tsh?.rangeSource).toBe('catalog');
    expect(tsh?.classification).toBe('High');
  });
});
