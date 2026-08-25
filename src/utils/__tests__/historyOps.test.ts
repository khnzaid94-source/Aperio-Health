import { describe, it, expect } from 'vitest';
import { removeTestFromResults, shouldSeedDemoData } from '../historyOps';
import { TestResult } from '../../types';

const makeResult = (testId: string): TestResult =>
    ({
        testId,
        name: testId,
        category: 'QA',
        measuredValue: 1,
        unit: '',
        referenceMin: 0,
        referenceMax: 2,
        classification: 'Normal',
        urgency: 'Routine',
        explanation: ''
    }) as unknown as TestResult;

describe('removeTestFromResults', () => {
    it('removes only the matching testId', () => {
        const results = [makeResult('a'), makeResult('b'), makeResult('c')];
        const out = removeTestFromResults(results, 'b');
        expect(out.map((r) => r.testId)).toEqual(['a', 'c']);
    });

    it('keeps malformed entries without testId rather than deleting unidentifiable rows', () => {
        const results = [{ name: 'broken' }, makeResult('keep'), makeResult('drop')] as unknown as TestResult[];
        const out = removeTestFromResults(results, 'drop');
        expect(out.map((r) => r.testId ?? null)).toEqual([null, 'keep']);
    });

    it('returns the input unchanged when nothing matches', () => {
        const results = [makeResult('x')];
        expect(removeTestFromResults(results, 'y').map((r) => r.testId)).toEqual(['x']);
    });
});

describe('shouldSeedDemoData', () => {
    it('seeds only for demo accounts with no explicit clear and empty storage', () => {
        expect(shouldSeedDemoData(true, false, true)).toBe(true);
    });

    it.each([
        [false, false, true], // not a demo account
        [true, true, true], // explicit clear tombstone present
        [true, false, false] // storage already populated
    ])('blocks seeding when isDemo=%s cleared=%s storedEmpty=%s', (demo, cleared, empty) => {
        expect(shouldSeedDemoData(demo, cleared, empty)).toBe(false);
    });
});
