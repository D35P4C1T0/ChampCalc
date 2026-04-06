export const MAX_TOTAL_CHAMPIONS = 66;
export const MAX_TOTAL_EVS = 516;
export const MIN_EV = 0;
export const MAX_EV = 252;
export const MAX_STAT_CHAMPIONS = 32;
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
  const converted = Object.fromEntries(
    EV_STAT_KEYS.map((key) => [key, championsPointsFromEv(input[key])]),
  ) as Record<(typeof EV_STAT_KEYS)[number], number>;
  const total = sumChampionsInput(converted);

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

export function sumChampionsInput(
  input: Pick<ConversionResult, (typeof EV_STAT_KEYS)[number]>,
): number {
  return EV_STAT_KEYS.reduce((sum, key) => sum + input[key], 0);
}

export function clampChampionsInputToBudget(
  input: Pick<ConversionResult, (typeof EV_STAT_KEYS)[number]>,
  preferredKey?: (typeof EV_STAT_KEYS)[number],
): Record<(typeof EV_STAT_KEYS)[number], number> {
  const next = Object.fromEntries(
    EV_STAT_KEYS.map((key) => [key, clampChampionsValue(input[key])]),
  ) as Record<(typeof EV_STAT_KEYS)[number], number>;

  if (!preferredKey) {
    return next;
  }

  const otherTotal = EV_STAT_KEYS.reduce((sum, key) => {
    if (key === preferredKey) {
      return sum;
    }

    return sum + next[key];
  }, 0);
  const remaining = Math.max(0, MAX_TOTAL_CHAMPIONS - otherTotal);
  next[preferredKey] = Math.min(next[preferredKey], remaining);

  return next;
}

export function championsPointsFromEv(value: number): number {
  const ev = clampEvValue(value);
  return Math.min(MAX_STAT_CHAMPIONS, Math.floor((ev + 4) / 8));
}

export function approximateEvFromChampions(value: number): number {
  const points = clampChampionsValue(value);
  if (points <= 0) {
    return MIN_EV;
  }

  return Math.min(MAX_EV, 4 + (points - 1) * 8);
}

export const canonicalEvFromChampions = approximateEvFromChampions;

function clampEvValue(value: number): number {
  if (!Number.isFinite(value)) {
    return MIN_EV;
  }

  return Math.max(MIN_EV, Math.min(MAX_EV, Math.trunc(value)));
}

function clampChampionsValue(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(MAX_STAT_CHAMPIONS, Math.trunc(value)));
}
