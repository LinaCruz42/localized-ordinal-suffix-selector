# localized-ordinal-suffix-selector

Returns the correct ordinal suffix for a cardinal number based on locale-specific plural rules.

```js
import { ordinalSuffix, ordinalize } from './src/index.js';

ordinalSuffix(1);        // 'st'
ordinalSuffix(11);       // 'th'
ordinalSuffix(1, 'fr');  // 'er'
ordinalSuffix(2, 'fr');  // 'e'
ordinalize(3, 'de');     // '3.'
```

## Why this exists

Formatting `1st`, `2nd`, `3rd` looks like a modulo-10 problem until you hit 11, 12 and 13. Other languages have their own traps: French only uses `er` for exactly one, Swedish switches between `:a` and `:e` depending on the last two digits, and German and Italian attach punctuation rather than letters. This library encodes those rules explicitly instead of trying to derive them from a general plural-forms engine.

The trade-off is coverage. A CLDR-based solution would handle every locale and every grammatical gender; this one ships a fixed table of ten languages and falls back to English for anything else. That keeps it dependency-free and small enough to read in one sitting, at the cost of not being a full internationalisation toolkit.

## API

The package exports three names from `src/index.js`:

- `ordinalSuffix(n, locale = 'en')` — returns the suffix string for the number `n`.
- `ordinalize(n, locale = 'en')` — returns `String(n)` with the suffix appended.
- `normaliseLocale(locale)` — reduces a locale tag to the base language code used for lookup.

`n` must be a finite number; anything else throws a `TypeError`. Fractional values are truncated toward zero, and negative values are reduced by their absolute value, so `ordinalSuffix(-1)` is `'st'`.

## The awkward edge

Locale tags are reduced to their base language: `en-GB`, `en_US` and `EN` all resolve to `en`. Region-specific ordinal conventions are not modelled. If you pass a language the table does not know, you silently get English rules rather than an error — check `normaliseLocale` first if you need to detect that case.

## Supported locales

`en`, `fr`, `de`, `es`, `it`, `pt`, `nl`, `sv`, `da`, `no`, `fi`.
