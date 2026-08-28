export interface Rational {
  numerator: bigint;
  denominator: bigint;
}

const quantityError = (input: string) => new Error(`Ongeldige hoeveelheid: "${input}".`);

function greatestCommonDivisor(a: bigint, b: bigint): bigint {
  let left = a < 0n ? -a : a;
  let right = b < 0n ? -b : b;

  while (right !== 0n) {
    [left, right] = [right, left % right];
  }

  return left;
}

function reduceRational({ numerator, denominator }: Rational): Rational {
  if (denominator === 0n) {
    throw new Error('De noemer van een hoeveelheid mag niet nul zijn.');
  }

  const sign = denominator < 0n ? -1n : 1n;
  const divisor = greatestCommonDivisor(numerator, denominator);

  return {
    numerator: (numerator / divisor) * sign,
    denominator: (denominator / divisor) * sign,
  };
}

export function parseQuantity(input: string): Rational {
  const value = input.trim();
  let rational: Rational | undefined;

  const decimal = /^(\d+)(?:[.,](\d+))?$/.exec(value);
  if (decimal) {
    const decimals = decimal[2] ?? '';
    const denominator = 10n ** BigInt(decimals.length);
    rational = {
      numerator: BigInt(`${decimal[1]}${decimals}`),
      denominator,
    };
  }

  const fraction = /^(\d+)\s*\/\s*(\d+)$/.exec(value);
  if (!rational && fraction) {
    rational = { numerator: BigInt(fraction[1]), denominator: BigInt(fraction[2]) };
  }

  const mixed = /^(\d+)\s+(\d+)\s*\/\s*(\d+)$/.exec(value);
  if (!rational && mixed) {
    const whole = BigInt(mixed[1]);
    const numerator = BigInt(mixed[2]);
    const denominator = BigInt(mixed[3]);

    if (whole === 0n || numerator === 0n || numerator >= denominator) {
      throw quantityError(input);
    }

    rational = { numerator: whole * denominator + numerator, denominator };
  }

  if (!rational || rational.numerator <= 0n || rational.denominator <= 0n) {
    throw quantityError(input);
  }

  return reduceRational(rational);
}

function terminatingDecimalPlaces(denominator: bigint): number | undefined {
  let remainder = denominator;
  let twos = 0;
  let fives = 0;

  while (remainder % 2n === 0n) {
    remainder /= 2n;
    twos += 1;
  }
  while (remainder % 5n === 0n) {
    remainder /= 5n;
    fives += 1;
  }

  return remainder === 1n ? Math.max(twos, fives) : undefined;
}

export function formatRational(value: Rational): string {
  const rational = reduceRational(value);

  if (rational.numerator <= 0n || rational.denominator <= 0n) {
    throw new Error('Een hoeveelheid moet groter zijn dan nul.');
  }

  if (rational.denominator === 1n) {
    return rational.numerator.toString();
  }

  const places = terminatingDecimalPlaces(rational.denominator);
  if (places !== undefined) {
    const power = 10n ** BigInt(places);
    const scaled = (rational.numerator * power) / rational.denominator;
    const digits = scaled.toString().padStart(places + 1, '0');
    const whole = digits.slice(0, -places) || '0';
    const decimals = digits.slice(-places).replace(/0+$/, '');
    return decimals ? `${whole},${decimals}` : whole;
  }

  const whole = rational.numerator / rational.denominator;
  const remainder = rational.numerator % rational.denominator;
  return whole > 0n
    ? `${whole} ${remainder}/${rational.denominator}`
    : `${remainder}/${rational.denominator}`;
}

export function scaleQuantity(input: string, servings: number, baseServings = 4): string {
  if (!Number.isInteger(servings) || servings < 1 || servings > 12) {
    throw new Error('Het aantal personen moet een geheel getal van 1 tot en met 12 zijn.');
  }
  if (!Number.isInteger(baseServings) || baseServings < 1) {
    throw new Error('Het basisaantal personen moet een positief geheel getal zijn.');
  }

  const quantity = parseQuantity(input);
  return formatRational({
    numerator: quantity.numerator * BigInt(servings),
    denominator: quantity.denominator * BigInt(baseServings),
  });
}
