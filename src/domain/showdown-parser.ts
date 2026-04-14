import {
  EV_STAT_KEYS,
  MAX_EV,
  MAX_STAT_CHAMPIONS,
  MAX_TOTAL_CHAMPIONS,
  approximateEvFromChampions,
  type ConversionResult,
  type EvInput,
  championsPointsFromEv,
  sumChampionsInput,
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

const TRAINING_LINE_LABELS = ["EVs", "SPs"] as const;
const TRAINING_LINE_PATTERN = /^(EVs|SPs):\s*(.+)$/im;
const EV_SEGMENT_PATTERN = /^(\d+)\s+(HP|Atk|Def|SpA|SpD|Spe)$/i;

type ChampionsPointInput = Pick<ConversionResult, (typeof EV_STAT_KEYS)[number]>;

interface ShowdownTrainingLineMatch {
  format: "EVs" | "SPs";
  payload: string;
}

export type ShowdownTrainingParseResult =
  | {
    kind: "ok";
    evs: EvInput | null;
    format: "EVs" | "SPs";
    points: ChampionsPointInput;
  }
  | {
    kind: "not_found";
  }
  | {
    kind: "error";
    message: string;
  };

export function parseShowdownEvs(setText: string): EvInput | null {
  const parsed = parseShowdownTrainingLine(setText);
  if (parsed.kind !== "ok" || parsed.format !== "EVs") {
    return null;
  }

  return parsed.evs;
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
  if (!TRAINING_LINE_PATTERN.test(setText)) {
    return null;
  }

  return setText.replace(TRAINING_LINE_PATTERN, buildShowdownEvsLine(evs));
}

export function rewriteShowdownTrainingLine(setText: string, line: string): string | null {
  if (!TRAINING_LINE_PATTERN.test(setText)) {
    return null;
  }

  return setText.replace(TRAINING_LINE_PATTERN, line);
}

export function parseShowdownTrainingLine(setText: string): ShowdownTrainingParseResult {
  const lines = collectTrainingLines(setText);
  if (lines.length === 0) {
    return {
      kind: "not_found",
    };
  }

  if (lines.length > 1) {
    return {
      kind: "error",
      message: buildMultipleTrainingLineError(lines),
    };
  }

  const [line] = lines;
  if (!line) {
    return {
      kind: "not_found",
    };
  }

  if (line.format === "EVs") {
    const evs = parseLegacyEvPayload(line.payload);
    if (!evs) {
      return {
        kind: "error",
        message: "Showdown set has a malformed EVs line.",
      };
    }

    return {
      kind: "ok",
      evs,
      format: "EVs",
      points: Object.fromEntries(
        EV_STAT_KEYS.map((key) => [key, championsPointsFromEv(evs[key])]),
      ) as ChampionsPointInput,
    };
  }

  const points = parseChampionsSpPayload(line.payload);
  if (!points) {
    return {
      kind: "error",
      message: "Showdown set has a malformed SPs line.",
    };
  }

  const total = sumChampionsInput(points);
  if (total > MAX_TOTAL_CHAMPIONS) {
    return {
      kind: "error",
      message: `Showdown set SPs exceed the ${MAX_TOTAL_CHAMPIONS}-point cap.`,
    };
  }

  return {
    kind: "ok",
    evs: null,
    format: "SPs",
    points,
  };
}

function collectTrainingLines(setText: string): ShowdownTrainingLineMatch[] {
  const matches: ShowdownTrainingLineMatch[] = [];

  for (const rawLine of setText.split(/\n/)) {
    const match = rawLine.trim().match(TRAINING_LINE_PATTERN);
    if (!match) {
      continue;
    }

    const [, rawFormat, payload] = match;
    if (!rawFormat || !payload) {
      continue;
    }

    const normalizedFormat = TRAINING_LINE_LABELS.find((label) => label.toLowerCase() === rawFormat.toLowerCase());
    if (!normalizedFormat) {
      continue;
    }

    matches.push({
      format: normalizedFormat,
      payload,
    });
  }

  return matches;
}

function parseLegacyEvPayload(payload: string): EvInput | null {
  const evs: EvInput = { ...EMPTY_EVS };
  let parsedSegments = 0;

  for (const segment of payload.split("/")) {
    const match = segment.trim().match(EV_SEGMENT_PATTERN);
    if (!match) {
      continue;
    }

    const [, rawValue, rawStat] = match;
    if (!rawValue || !rawStat) {
      continue;
    }

    const key = SHOWDOWN_TO_INPUT_KEY[rawStat as keyof typeof SHOWDOWN_TO_INPUT_KEY];
    evs[key] = Math.max(0, Math.min(MAX_EV, Number.parseInt(rawValue, 10)));
    parsedSegments += 1;
  }

  return parsedSegments > 0 ? evs : null;
}

function parseChampionsSpPayload(payload: string): ChampionsPointInput | null {
  const points = { ...EMPTY_EVS };
  let parsedSegments = 0;

  for (const segment of payload.split("/")) {
    const match = segment.trim().match(EV_SEGMENT_PATTERN);
    if (!match) {
      continue;
    }

    const [, rawValue, rawStat] = match;
    if (!rawValue || !rawStat) {
      continue;
    }

    const key = SHOWDOWN_TO_INPUT_KEY[rawStat as keyof typeof SHOWDOWN_TO_INPUT_KEY];
    points[key] = Math.max(0, Math.min(MAX_STAT_CHAMPIONS, Number.parseInt(rawValue, 10)));
    parsedSegments += 1;
  }

  return parsedSegments > 0 ? points : null;
}

function buildMultipleTrainingLineError(lines: ShowdownTrainingLineMatch[]): string {
  const uniqueFormats = [...new Set(lines.map((line) => line.format))];
  if (uniqueFormats.length > 1) {
    return "Showdown set is malformed: include only one training line type, either EVs or SPs.";
  }

  return "Showdown set is malformed: include only one EVs/SPs line.";
}
