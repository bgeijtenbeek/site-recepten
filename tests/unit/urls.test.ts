import { describe, expect, it } from 'vitest';

import { recipeUrl, withBase } from '../../src/lib/urls';

describe('base-aware internal URLs', () => {
  it('generates root-hosted links', () => {
    expect(recipeUrl('kip-kerrie', '/')).toBe('/recepten/kip-kerrie/');
  });

  it('normalizes optional prefixes without doubled or missing slashes', () => {
    expect(recipeUrl('kip-kerrie', '/voorbeeld/')).toBe('/voorbeeld/recepten/kip-kerrie/');
    expect(withBase('/favicon.svg', '/voorbeeld/')).toBe('/voorbeeld/favicon.svg');
  });

  it('rejects external URLs and path traversal', () => {
    expect(() => withBase('https://example.com', '/')).toThrow(/intern pad/i);
    expect(() => recipeUrl('../verborgen', '/')).toThrow(/segment/i);
  });
});
