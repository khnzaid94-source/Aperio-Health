import { describe, it, expect } from 'vitest';
import { INTERFACE_TRANSLATIONS, SUPPORTED_LANGUAGES } from '../../constants/translations';

const PARAM_RE = /\{(\w+)\}/g;

function paramsOf(value: string): string[] {
  return [...value.matchAll(PARAM_RE)].map((m) => m[1]).sort();
}

const sourceFiles = {
  ...import.meta.glob('/src/**/*.tsx', { query: '?raw', import: 'default', eager: true }),
  ...import.meta.glob('/src/**/*.ts', { query: '?raw', import: 'default', eager: true })
} as Record<string, string>;

describe('translation dictionaries', () => {
  const enKeys = Object.keys(INTERFACE_TRANSLATIONS.en).sort();

  it('english dictionary is non-empty', () => {
    expect(enKeys.length).toBeGreaterThan(50);
  });

  it.each(SUPPORTED_LANGUAGES.map((l) => [l.code, l.name]))(
    '%s (%s) has exactly the English key set',
    (code) => {
      const keys = Object.keys(
        (INTERFACE_TRANSLATIONS as Record<string, Record<string, string>>)[code]
      ).sort();
      expect(keys).toEqual(enKeys);
    }
  );

  it.each(SUPPORTED_LANGUAGES.filter((l) => l.code !== 'en').map((l) => l.code))(
    '%s values interpolate exactly the same {params} as English',
    (code) => {
      const dict = (INTERFACE_TRANSLATIONS as Record<string, Record<string, string>>)[code];
      const mismatches: string[] = [];
      for (const [key, enValue] of Object.entries(INTERFACE_TRANSLATIONS.en)) {
        if (!enValue.includes('{')) continue;
        if (paramsOf(enValue).join(',') !== paramsOf(dict[key] ?? '').join(',')) {
          mismatches.push(`${code}:${key}`);
        }
      }
      expect(mismatches).toEqual([]);
    }
  );

  it('no empty translation values in any language', () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      const dict =
        (INTERFACE_TRANSLATIONS as Record<string, Record<string, string>>)[lang.code] ?? {};
      for (const [key, value] of Object.entries(dict)) {
        expect(`${lang.code}:${key}: ${value}`.length > 0).toBe(true);
        expect(value.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('every statically referenced t()/getTranslation() key exists in the dictionary', () => {
    const missing: string[] = [];
    const callRe = /\b(?:t|getTranslation)\(\s*['"]([\w.]+)['"]/g;
    for (const [path, content] of Object.entries(sourceFiles)) {
      if (path.includes('__tests__')) continue;
      for (const m of content.matchAll(callRe)) {
        const key = m[1];
        if (!(key in INTERFACE_TRANSLATIONS.en)) {
          missing.push(`${key} (${path.split('/').pop()})`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it('keys rendered beside component icons carry no icon prefixes', () => {
    // These values render next to lucide icons in components; a leading emoji or
    // '+' in the translation value produces a double-icon (QA finding 2026-08-25).
    const componentIconKeys = [
      'hist.emptyCta',
      'jrn.logNewItem',
      'hist.tabTrends',
      'hist.tabCompare',
      'hist.subCards',
      'hist.subTable'
    ];
    const iconPrefix =
      // eslint-disable-next-line no-misleading-character-class -- intentionally matching variation-selector/ZWJ codepoints individually
      /^[+\u2190-\u21FF\u2600-\u27BF\uFE0F\u200D\u{1F000}-\u{1FAFF}\s]/u;
    const offenders: string[] = [];
    for (const lang of SUPPORTED_LANGUAGES) {
      const dict = (INTERFACE_TRANSLATIONS as Record<string, Record<string, string>>)[lang.code];
      for (const key of componentIconKeys) {
        if (iconPrefix.test(dict[key] ?? '')) offenders.push(`${lang.code}:${key}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
