import distData from '../../shared/distributions.json';

export interface StratumStats {
    n: number;
    mean: number;
    sd: number;
    p2_5: number;
    p50: number;
    p97_5: number;
    sigma_robust: number;
}

interface PopulationEntry {
    sex?: Record<string, Record<string, StratumStats>>;
    all?: Record<string, StratumStats>;
}

type DistributionFile = Record<string, PopulationEntry | { _meta: unknown }>;

const distributions = (distData as unknown) as DistributionFile;

export interface PatientContext {
    age?: number | null;
    gender?: string | null;
    date_of_birth?: string | null;
}

export function resolveSex(gender?: string | null): 'M' | 'F' | null {
    if (!gender) return null;
    const g = String(gender).trim().toLowerCase();
    if (g.startsWith('m')) return 'M';
    if (g.startsWith('f')) return 'F';
    return null;
}

export function ageFromDob(dob?: string | null): number | null {
    if (!dob) return null;
    const parts = String(dob).slice(0, 10).split('-').map((p) => parseInt(p, 10));
    if (parts.length !== 3 || parts.some((p) => isNaN(p))) return null;
    const today = new Date();
    let age = today.getFullYear() - parts[0];
    if (
        today.getMonth() + 1 < parts[1] ||
        (today.getMonth() + 1 === parts[1] && today.getDate() < parts[2])
    ) {
        age--;
    }
    return age >= 0 ? age : null;
}

export function resolveAgeBand(age?: number | null): string | null {
    if (age === null || age === undefined || isNaN(age)) return null;
    const clamped = Math.max(18, Math.min(Math.round(age), 200));
    if (clamped <= 39) return '18-39';
    if (clamped <= 59) return '40-59';
    return '60+';
}

export function getPopulationStats(
    testId: string,
    ctx?: PatientContext | null
): (StratumStats & { stratum: string }) | null {
    const entry = distributions[testId] as PopulationEntry | undefined;
    if (!entry || typeof entry !== 'object' || !('sex' in entry || 'all' in entry)) {
        return null;
    }

    const sex = resolveSex(ctx?.gender ?? null);
    const rawAge =
        ctx?.age ?? (ctx?.date_of_birth ? ageFromDob(ctx.date_of_birth) : null);
    const band = resolveAgeBand(rawAge);

    if (sex && band) {
        const st = entry.sex?.[sex]?.[band];
        if (st) return { ...st, stratum: `${sex} ${band}` };
    }

    const allSt = entry.all?.['18+'];
    if (allSt) return { ...allSt, stratum: 'adults 18+ (population average)' };

    return null;
}
