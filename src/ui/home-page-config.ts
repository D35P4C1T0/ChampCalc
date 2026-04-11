import {
  MAX_STAT_CHAMPIONS,
  canonicalEvFromChampions,
} from "../domain/ev-master.js";

export const HOME_PAGE_STATS = [
  { key: "hp", label: "HP" },
  { key: "attack", label: "Attack" },
  { key: "defense", label: "Defense" },
  { key: "specialAttack", label: "Sp. Atk" },
  { key: "specialDefense", label: "Sp. Def" },
  { key: "speed", label: "Speed" },
] as const;

const NATURE_STAT_ABBREVIATIONS = {
  attack: "Atk",
  defense: "Def",
  specialAttack: "SpA",
  specialDefense: "SpD",
  speed: "Spe",
} as const;

export const HOME_PAGE_NATURE_OPTIONS = [
  { name: "Hardy", increase: null, decrease: null },
  { name: "Lonely", increase: "attack", decrease: "defense" },
  { name: "Brave", increase: "attack", decrease: "speed" },
  { name: "Adamant", increase: "attack", decrease: "specialAttack" },
  { name: "Naughty", increase: "attack", decrease: "specialDefense" },
  { name: "Bold", increase: "defense", decrease: "attack" },
  { name: "Relaxed", increase: "defense", decrease: "speed" },
  { name: "Impish", increase: "defense", decrease: "specialAttack" },
  { name: "Lax", increase: "defense", decrease: "specialDefense" },
  { name: "Timid", increase: "speed", decrease: "attack" },
  { name: "Hasty", increase: "speed", decrease: "defense" },
  { name: "Jolly", increase: "speed", decrease: "specialAttack" },
  { name: "Naive", increase: "speed", decrease: "specialDefense" },
  { name: "Modest", increase: "specialAttack", decrease: "attack" },
  { name: "Mild", increase: "specialAttack", decrease: "defense" },
  { name: "Quiet", increase: "specialAttack", decrease: "speed" },
  { name: "Rash", increase: "specialAttack", decrease: "specialDefense" },
  { name: "Calm", increase: "specialDefense", decrease: "attack" },
  { name: "Gentle", increase: "specialDefense", decrease: "defense" },
  { name: "Sassy", increase: "specialDefense", decrease: "speed" },
  { name: "Careful", increase: "specialDefense", decrease: "specialAttack" },
] as const;

export const HOME_PAGE_EV_STEP = 1;
export const HOME_PAGE_TITLE = "ChampCalc | Pokemon Champions EV Calculator";
export const HOME_PAGE_DESCRIPTION =
  "Convert Pokemon Showdown EV spreads into the new 66-point Pokemon Champions format with live sliders and built-in set parsing.";
export const HOME_PAGE_SITE_NAME = "ChampCalc";
export const HOME_PAGE_PROJECT_GITHUB_URL = "https://github.com/D35P4C1T0/ChampCalc";
export const HOME_PAGE_POINT_TO_CANONICAL_EV = Array.from(
  { length: MAX_STAT_CHAMPIONS + 1 },
  (_, points) => canonicalEvFromChampions(points),
);
export const HOME_PAGE_PAYPAL_ICON = `
  <svg class="paypal-mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      fill="#003087"
      d="M9.24 3.33A1 1 0 0 1 10.22 2.5h5.19c1.75 0 3.03.39 3.85 1.16.82.78 1.11 1.92.87 3.43-.27 1.7-.95 3.03-2.04 3.98-1.08.95-2.52 1.42-4.33 1.42h-1.83a.75.75 0 0 0-.74.62l-.76 4.79a.84.84 0 0 1-.83.7H6.35a.62.62 0 0 1-.61-.73L9.24 3.33Z"
    />
    <path
      fill="#009CDE"
      d="M11.18 5.28a.86.86 0 0 1 .85-.72h3.66c1.23 0 2.15.27 2.73.81.58.54.79 1.35.62 2.42-.18 1.15-.65 2.05-1.39 2.69-.75.65-1.74.97-2.98.97H13.2a.78.78 0 0 0-.77.65L11.7 16.7a.78.78 0 0 1-.77.65H8.57l2.61-12.07Z"
    />
  </svg>
`;

export function renderNatureOptionLabel(
  nature: (typeof HOME_PAGE_NATURE_OPTIONS)[number],
): string {
  if (!nature.increase || !nature.decrease) {
    return `${nature.name} (neutral)`;
  }

  return `${nature.name} (+${NATURE_STAT_ABBREVIATIONS[nature.increase]}, -${NATURE_STAT_ABBREVIATIONS[nature.decrease]})`;
}
