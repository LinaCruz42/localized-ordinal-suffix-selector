import test from 'node:test';
import assert from 'node:assert/strict';
import { normaliseLocale, ordinalSuffix, ordinalize } from '../src/index.js';

// English: the classic 11/12/13 exception must beat the last-digit rule.
test('english suffixes', () => {
  assert.equal(ordinalSuffix(1), 'st');
  assert.equal(ordinalSuffix(2), 'nd');
  assert.equal(ordinalSuffix(3), 'rd');
  assert.equal(ordinalSuffix(4), 'th');
  assert.equal(ordinalSuffix(11), 'th');
  assert.equal(ordinalSuffix(12), 'th');
  assert.equal(ordinalSuffix(13), 'th');
  assert.equal(ordinalSuffix(21), 'st');
  assert.equal(ordinalSuffix(22), 'nd');
  assert.equal(ordinalSuffix(23), 'rd');
  assert.equal(ordinalSuffix(111), 'th');
  assert.equal(ordinalSuffix(112), 'th');
  assert.equal(ordinalSuffix(113), 'th');
});

test('english defaults when locale omitted', () => {
  assert.equal(ordinalSuffix(1), 'st');
  assert.equal(ordinalize(3), '3rd');
});

test('french: only 1 is er, everything else e', () => {
  assert.equal(ordinalSuffix(1, 'fr'), 'er');
  assert.equal(ordinalSuffix(2, 'fr'), 'e');
  assert.equal(ordinalSuffix(21, 'fr'), 'er');
  assert.equal(ordinalSuffix(11, 'fr'), 'e');
});

test('german uses a period', () => {
  assert.equal(ordinalSuffix(1, 'de'), '.');
  assert.equal(ordinalize(5, 'de'), '5.');
});

test('swedish: 1,2 and 21,22 take :a, others :e', () => {
  assert.equal(ordinalSuffix(1, 'sv'), ':a');
  assert.equal(ordinalSuffix(2, 'sv'), ':a');
  assert.equal(ordinalSuffix(3, 'sv'), ':e');
  assert.equal(ordinalSuffix(21, 'sv'), ':a');
  assert.equal(ordinalSuffix(22, 'sv'), ':a');
  assert.equal(ordinalSuffix(11, 'sv'), ':e');
  assert.equal(ordinalSuffix(12, 'sv'), ':e');
});

test('locale tags are reduced to their base language', () => {
  assert.equal(normaliseLocale('en-GB'), 'en');
  assert.equal(normaliseLocale('fr_CA'), 'fr');
  assert.equal(normaliseLocale('SV'), 'sv');
  assert.equal(normaliseLocale(''), 'en');
  assert.equal(normaliseLocale(undefined), 'en');
});

test('unknown locales fall back to english', () => {
  assert.equal(ordinalSuffix(1, 'xx'), 'st');
  assert.equal(ordinalSuffix(2, 'zz-ZZ'), 'nd');
});

test('negative numbers use the absolute value for the rule', () => {
  assert.equal(ordinalSuffix(-1), 'st');
  assert.equal(ordinalSuffix(-11), 'th');
  assert.equal(ordinalSuffix(-22), 'nd');
});

test('non-integers are truncated toward zero', () => {
  assert.equal(ordinalSuffix(1.9), 'st');
  assert.equal(ordinalSuffix(2.1), 'nd');
});

test('non-finite numbers throw', () => {
  assert.throws(() => ordinalSuffix(NaN), TypeError);
  assert.throws(() => ordinalSuffix(Infinity), TypeError);
  assert.throws(() => ordinalSuffix('1'), TypeError);
});

test('ordinalize concatenates the number and suffix', () => {
  assert.equal(ordinalize(1), '1st');
  assert.equal(ordinalize(2, 'fr'), '2e');
  assert.equal(ordinalize(3, 'it'), '3\u00b0');
});
