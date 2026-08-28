import { describe, expect, it } from 'vitest';

import {
  formatRational,
  parseQuantity,
  scaleQuantity,
} from '../../src/lib/quantities';

describe('exact ingredient quantities', () => {
  it.each([
    ['2', { numerator: 2n, denominator: 1n }],
    ['1,5', { numerator: 3n, denominator: 2n }],
    ['0.25', { numerator: 1n, denominator: 4n }],
    ['3/6', { numerator: 1n, denominator: 2n }],
    ['1 1/2', { numerator: 3n, denominator: 2n }],
  ])('parses %s into a reduced rational', (input, expected) => {
    expect(parseQuantity(input)).toEqual(expected);
  });

  it.each(['', 'abc', '1/0', '0', '-1', '1 2/2', '1,2,3'])('rejects malformed or non-positive quantity %s', (input) => {
    expect(() => parseQuantity(input)).toThrow(/hoeveelheid/i);
  });

  it('formats whole numbers, Dutch decimals, and exact mixed fractions', () => {
    expect(formatRational({ numerator: 3n, denominator: 1n })).toBe('3');
    expect(formatRational({ numerator: 3n, denominator: 2n })).toBe('1,5');
    expect(formatRational({ numerator: 7n, denominator: 3n })).toBe('2 1/3');
  });

  it('scales the acceptance quantities from four to six servings', () => {
    expect(scaleQuantity('2', 6)).toBe('3');
    expect(scaleQuantity('300', 6)).toBe('450');
    expect(scaleQuantity('1', 6)).toBe('1,5');
  });

  it('keeps one third exact when scaling from four to five servings', () => {
    expect(scaleQuantity('1/3', 5)).toBe('5/12');
  });

  it('rejects invalid serving counts', () => {
    expect(() => scaleQuantity('1', 0)).toThrow(/personen/i);
    expect(() => scaleQuantity('1', 13)).toThrow(/personen/i);
    expect(() => scaleQuantity('1', 2.5)).toThrow(/personen/i);
  });
});
