import type { EvInput } from "./ev-master.js";

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
