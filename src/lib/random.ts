const EXCLUDED_INSPIRATION_TYPES = new Set(['Voorgerechten', 'Desserts']);

export type RandomSource = () => number;

export function createSeededRandom(seed: number): RandomSource {
  if (!Number.isFinite(seed)) {
    throw new Error('De willekeurige seed moet een eindig getal zijn.');
  }

  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function isInspirationEligible(recipe: { mealType: string }): boolean {
  return !EXCLUDED_INSPIRATION_TYPES.has(recipe.mealType);
}

function sampleWithoutReplacement<T>(
  items: ReadonlyArray<T>,
  count: number,
  random: RandomSource = Math.random,
): T[] {
  if (!Number.isInteger(count) || count < 0) {
    throw new Error('Het aantal willekeurige recepten moet een niet-negatief geheel getal zijn.');
  }

  const pool = [...items];
  const sampleSize = Math.min(count, pool.length);

  for (let index = pool.length - 1; index > pool.length - 1 - sampleSize; index -= 1) {
    const randomValue = random();
    if (!Number.isFinite(randomValue) || randomValue < 0 || randomValue >= 1) {
      throw new Error('De willekeurige bron moet een getal vanaf 0 en kleiner dan 1 opleveren.');
    }
    const selectedIndex = Math.floor(randomValue * (index + 1));
    [pool[index], pool[selectedIndex]] = [pool[selectedIndex], pool[index]];
  }

  return pool.slice(pool.length - sampleSize).reverse();
}

export function selectInspiration<T extends { mealType: string }>(
  recipes: ReadonlyArray<T>,
  count = 10,
  random: RandomSource = Math.random,
): T[] {
  return sampleWithoutReplacement(recipes.filter(isInspirationEligible), count, random);
}
