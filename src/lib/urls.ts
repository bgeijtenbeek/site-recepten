function normalizeBase(base: string): string {
  const trimmed = base.trim();
  if (!trimmed || trimmed === '/') {
    return '/';
  }

  const withoutEdges = trimmed.replace(/^\/+|\/+$/g, '');
  if (!withoutEdges || withoutEdges.includes('..') || /[:?#]/.test(withoutEdges)) {
    throw new Error(`Ongeldig basispad: "${base}".`);
  }
  return `/${withoutEdges}/`;
}

function validateSegment(segment: string): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(segment)) {
    throw new Error(`Ongeldig URL-segment: "${segment}".`);
  }
  return segment;
}

export function withBase(path: string, base = '/'): string {
  if (/^[a-z][a-z\d+.-]*:/i.test(path) || path.startsWith('//') || path.includes('..')) {
    throw new Error(`Verwacht een intern pad, ontvangen: "${path}".`);
  }

  const cleanPath = path.replace(/^\/+/, '');
  return `${normalizeBase(base)}${cleanPath}`.replace(/\/{2,}/g, '/');
}

export function recipeUrl(id: string, base = '/'): string {
  return withBase(`recepten/${validateSegment(id)}/`, base);
}

export function mealTypeUrl(slug: string, base = '/'): string {
  return withBase(`maaltijdtypes/${validateSegment(slug)}/`, base);
}

export function kenmerkUrl(slug: string, base = '/'): string {
  return withBase(`kenmerken/${validateSegment(slug)}/`, base);
}
