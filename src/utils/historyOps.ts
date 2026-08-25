import { TestResult } from '../types';

export function removeTestFromResults(results: TestResult[], testId: string): TestResult[] {
    return results.filter((r) => r?.testId !== testId);
}

export function shouldSeedDemoData(
    isDemoAccount: boolean,
    explicitClearFlag: boolean,
    storedIsEmpty: boolean
): boolean {
    return isDemoAccount && !explicitClearFlag && storedIsEmpty;
}
