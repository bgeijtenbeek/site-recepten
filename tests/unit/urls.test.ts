import { describe, expect, it } from 'vitest';

import { kenmerkUrl, mealTypeUrl, recipeUrl, withBase } from '../../src/lib/urls';

describe('base-aware internal URLs', () => {
  it('generates root-hosted links', () => {
    expect(recipeUrl('kip-kerrie', '/')).toBe('/recepten/kip-kerrie/');
    expect(mealTypeUrl('hoofdgerechten', '/')).toBe('/maaltijdtypes/hoofdgerechten/');
    expect(kenmerkUrl('kip', '/')).toBe('/kenmerken/kip/');
  });

  it('generates project-site links without doubled or missing slashes', () => {
    expect(recipeUrl('kip-kerrie', '/site-recepten/')).toBe('/site-recepten/recepten/kip-kerrie/');
    expect(mealTypeUrl('hoofdgerechten', 'site-recepten')).toBe('/site-recepten/maaltijdtypes/hoofdgerechten/');
    expect(kenmerkUrl('kip', '/site-recepten')).toBe('/site-recepten/kenmerken/kip/');
    expect(withBase('/favicon.svg', '/site-recepten/')).toBe('/site-recepten/favicon.svg');
  });

  it('rejects external URLs and path traversal', () => {
    expect(() => withBase('https://example.com', '/')).toThrow(/intern pad/i);
    expect(() => recipeUrl('../verborgen', '/')).toThrow(/segment/i);
  });
});
