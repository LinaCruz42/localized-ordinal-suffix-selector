// Locale-specific ordinal suffix rules. Each rule set is an array of
// [modulus, remainder, suffix] triples. The first matching rule wins.
// The final entry should have modulus 0, which always matches.

const RULES = {
  en: [
    [100, 11, 'th'],
    [100, 12, 'th'],
    [100, 13, 'th'],
    [10, 1, 'st'],
    [10, 2, 'nd'],
    [10, 3, 'rd'],
    [0, 0, 'th'],
  ],
  fr: [
    [100, 1, 'er'],
    [100, 11, 'e'],
    [10, 1, 'er'],
    [0, 0, 'e'],
  ],
  de: [
    [0, 0, '.'],
  ],
  es: [
    [0, 0, '.o'],
  ],
  it: [
    [0, 0, '\u00b0'],
  ],
  pt: [
    [0, 0, '\u00ba'],
  ],
  nl: [
    [0, 0, 'e'],
  ],
  sv: [
    [100, 11, ':e'],
    [100, 12, ':e'],
    [100, 1, ':a'],
    [100, 2, ':a'],
    [10, 1, ':a'],
    [10, 2, ':a'],
    [0, 0, ':e'],
  ],
  da: [
    [0, 0, '.e'],
  ],
  no: [
    [0, 0, '.e'],
  ],
  fi: [
    [0, 0, '.nen'],
  ],
};

/**
 * Normalise a locale tag to a base language code.
 *
 * We deliberately do not pull in a full BCP 47 parser. Ordinal suffixes
 * depend on the language, not the region, so `en-GB` and `en-US` share
 * rules. Anything we do not recognise falls back to English.
 */
export function normaliseLocale(locale) {
  if (typeof locale !== 'string' || locale.length === 0) {
    return 'en';
  }
  const base = locale.toLowerCase().split(/[-_]/)[0];
  return Object.prototype.hasOwnProperty.call(RULES, base) ? base : 'en';
}

/**
 * Return the ordinal suffix for `n` in `locale`.
 *
 * The number is reduced modulo each rule's modulus before comparing the
 * remainder. A modulus of 0 is the catch-all and matches every number;
 * it is written last in each rule list so the first-match loop terminates.
 */
export function ordinalSuffix(n, locale = 'en') {
  if (typeof n !== 'number' || !Number.isFinite(n)) {
    throw new TypeError('n must be a finite number');
  }
  const lang = normaliseLocale(locale);
  const rules = RULES[lang];
  const abs = Math.abs(Math.trunc(n));
  for (const [mod, rem, suffix] of rules) {
    if (mod === 0 || abs % mod === rem) {
      return suffix;
    }
  }
  // Unreachable: every rule list ends with a modulus-0 catch-all.
  return '';
}

/**
 * Return the number with its ordinal suffix appended.
 *
 * The suffix is concatenated directly; callers who need a separator
 * (for example the German `.` or the Italian `\u00b0`) get it from the
 * rule itself rather than from this function.
 */
export function ordinalize(n, locale = 'en') {
  return String(n) + ordinalSuffix(n, locale);
}
