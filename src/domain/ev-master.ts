export const EV_TO_CHAMPION_FACTOR = 0.12698412698412698;
export const MAX_TOTAL_CHAMPIONS = 66;
export const MAX_TOTAL_EVS = 516;
export const MIN_EV = 0;
export const MAX_EV = 252;
export const EV_STAT_KEYS = [
  "hp",
  "attack",
  "defense",
  "specialAttack",
  "specialDefense",
  "speed",
] as const;

export interface EvInput {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface ConversionResult {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  total: number;
  maxTotal: number;
  isOverCap: boolean;
}

export function convertEvToChampions(input: EvInput): ConversionResult {
  const total = Math.min(
    MAX_TOTAL_CHAMPIONS,
    toChampions(sumEvInput(input)),
  );
  const converted = Object.fromEntries(
    EV_STAT_KEYS.map((key) => [key, 0]),
  ) as Record<(typeof EV_STAT_KEYS)[number], number>;
  const exactValues = EV_STAT_KEYS.map((key, index) => {
    const exact = input[key] * EV_TO_CHAMPION_FACTOR;
    const base = Math.floor(exact);

    converted[key] = base;

    return {
      key,
      index,
      base,
      fraction: exact - base,
      raw: input[key],
    };
  });

  let remaining = total - exactValues.reduce((sum, item) => sum + item.base, 0);

  exactValues
    .sort((left, right) =>
      right.fraction - left.fraction ||
      right.raw - left.raw ||
      left.index - right.index,
    )
    .slice(0, Math.max(remaining, 0))
    .forEach((item) => {
      converted[item.key] += 1;
      remaining -= 1;
    });

  return {
    ...converted,
    total,
    maxTotal: MAX_TOTAL_CHAMPIONS,
    isOverCap: total > MAX_TOTAL_CHAMPIONS,
  };
}

export function sumEvInput(input: EvInput): number {
  return (
    input.hp +
    input.attack +
    input.defense +
    input.specialAttack +
    input.specialDefense +
    input.speed
  );
}

function toChampions(value: number): number {
  return Math.round(value * EV_TO_CHAMPION_FACTOR);
}
