import { describe, it, expect } from 'vitest';
import { INTERFACE_TRANSLATIONS, SUPPORTED_LANGUAGES } from '../../constants/translations';

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
});
