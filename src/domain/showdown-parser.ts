import {
  EV_STAT_KEYS,
  approximateEvFromChampions,
  type ConversionResult,
  type EvInput,
} from "./ev-master.js";

const EMPTY_EVS: EvInput = {
  hp: 0,
  attack: 0,
  defense: 0,
  specialAttack: 0,
  specialDefense: 0,
  speed: 0,
};

const SHOWDOWN_TO_INPUT_KEY = {
  HP: "hp",
  Atk: "attack",
  Def: "defense",
  SpA: "specialAttack",
  SpD: "specialDefense",
  Spe: "speed",
} as const;

const INPUT_TO_SHOWDOWN_STAT = {
  hp: "HP",
  attack: "Atk",
  defense: "Def",
  specialAttack: "SpA",
  specialDefense: "SpD",
  speed: "Spe",
} as const;

const EVS_LINE_PATTERN = /^EVs:\s*(.+)$/im;
const EV_SEGMENT_PATTERN = /^(\d+)\s+(HP|Atk|Def|SpA|SpD|Spe)$/i;

export function parseShowdownEvs(setText: string): EvInput | null {
  const evLineMatch = setText.match(EVS_LINE_PATTERN);
  if (!evLineMatch) {
    return null;
  }

  const evs: EvInput = { ...EMPTY_EVS };
  let parsedSegments = 0;

  const evLine = evLineMatch[1];
  if (!evLine) {
    return null;
  }

  for (const segment of evLine.split("/")) {
    const match = segment.trim().match(EV_SEGMENT_PATTERN);
    if (!match) {
      continue;
    }

    const [, rawValue, rawStat] = match;
    if (!rawValue || !rawStat) {
      continue;
    }

    const key = SHOWDOWN_TO_INPUT_KEY[rawStat as keyof typeof SHOWDOWN_TO_INPUT_KEY];
    evs[key] = Number.parseInt(rawValue, 10);
    parsedSegments += 1;
  }

  return parsedSegments > 0 ? evs : null;
}

export function buildShowdownEvsLine(evs: EvInput): string {
  const parts = EV_STAT_KEYS
    .filter((key) => evs[key] > 0)
    .map((key) => `${evs[key]} ${INPUT_TO_SHOWDOWN_STAT[key]}`);

  return `EVs: ${parts.length > 0 ? parts.join(" / ") : "0 HP"}`;
}

export function buildChampionsSpLine(
  points: Pick<ConversionResult, (typeof EV_STAT_KEYS)[number]>,
): string {
  const parts = EV_STAT_KEYS
    .filter((key) => points[key] > 0)
    .map((key) => `${points[key]} ${INPUT_TO_SHOWDOWN_STAT[key]}`);

  return `SPs: ${parts.length > 0 ? parts.join(" / ") : "0 HP"}`;
}

export function buildApproximateLegacyEvLine(
  points: Pick<ConversionResult, (typeof EV_STAT_KEYS)[number]>,
): string {
  const parts = EV_STAT_KEYS
    .filter((key) => points[key] > 0)
    .map((key) => `${approximateEvFromChampions(points[key])} ${INPUT_TO_SHOWDOWN_STAT[key]}`);

  return `EVs: ${parts.length > 0 ? parts.join(" / ") : "0 HP"}`;
}

export function rewriteShowdownEvsLine(setText: string, evs: EvInput): string | null {
  if (!EVS_LINE_PATTERN.test(setText)) {
    return null;
  }

  return setText.replace(EVS_LINE_PATTERN, buildShowdownEvsLine(evs));
}

export function rewriteShowdownTrainingLine(setText: string, line: string): string | null {
  if (!EVS_LINE_PATTERN.test(setText)) {
    return null;
  }

  return setText.replace(EVS_LINE_PATTERN, line);
}
