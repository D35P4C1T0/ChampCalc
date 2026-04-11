import {
  APP_DOWNLOAD_URL,
  APP_SHARE_MESSAGE,
  CREATOR_GITHUB_HANDLE,
  CREATOR_GITHUB_URL,
  DONATION_URL,
} from "../config/external-links.js";
import {
  EV_STAT_KEYS,
  MAX_STAT_CHAMPIONS,
  MAX_EV,
  MAX_TOTAL_CHAMPIONS,
  MAX_TOTAL_EVS,
  MIN_EV,
  canonicalEvFromChampions,
} from "../domain/ev-master.js";
import { MAX_SHOWDOWN_TEXT_LENGTH } from "../domain/input-sanitize.js";

const initialStats = [
  { key: "hp", label: "HP" },
  { key: "attack", label: "Attack" },
  { key: "defense", label: "Defense" },
  { key: "specialAttack", label: "Sp. Atk" },
  { key: "specialDefense", label: "Sp. Def" },
  { key: "speed", label: "Speed" },
] as const;

const natureStatAbbreviations = {
  attack: "Atk",
  defense: "Def",
  specialAttack: "SpA",
  specialDefense: "SpD",
  speed: "Spe",
} as const;

const natureOptions = [
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

const EV_STEP = 1;
const PAGE_TITLE = "ChampCalc | Pokemon Champions EV Calculator";
const PAGE_DESCRIPTION =
  "Convert Pokemon Showdown EV spreads into the new 66-point Pokemon Champions format with live sliders and built-in set parsing.";
const SITE_NAME = "ChampCalc";
const PROJECT_GITHUB_URL = "https://github.com/D35P4C1T0/ChampCalc";
const POINT_TO_CANONICAL_EV = Array.from(
  { length: MAX_STAT_CHAMPIONS + 1 },
  (_, points) => canonicalEvFromChampions(points),
);
const PAYPAL_ICON = `
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

interface RenderHomePageOptions {
  pageUrl?: string;
  scriptNonce: string;
}

export function renderHomePage({
  pageUrl,
  scriptNonce,
}: RenderHomePageOptions): string {
  const renderNatureOptionLabel = (
    nature: (typeof natureOptions)[number],
  ): string => {
    if (!nature.increase || !nature.decrease) {
      return `${nature.name} (neutral)`;
    }

    return `${nature.name} (+${natureStatAbbreviations[nature.increase]}, -${natureStatAbbreviations[nature.decrease]})`;
  };

  const statCards = initialStats
    .map(
      (stat, index) => `
        <div class="stat-card reveal" style="--delay:${index * 60}ms">
          <div class="stat-info">
            <label class="stat-name" for="${stat.key}">
              <span>${escapeHtml(stat.label)}</span>
              <span
                class="stat-nature-indicator"
                id="${stat.key}-nature-indicator"
                data-state="neutral"
                aria-hidden="true"
              ></span>
            </label>
            <span class="stat-base" id="${stat.key}-base">Base --</span>
            <span class="stat-value-wrap">
              <span
                class="ev-editor"
                data-ev-editor="${stat.key}"
                data-ev-label="${escapeHtml(stat.label)}"
              >
                <button
                  class="ev-pill"
                  data-ev-pill="${stat.key}"
                  type="button"
                  aria-label="Edit ${escapeHtml(stat.label)} EVs"
                >
                  <strong id="${stat.key}-value">${POINT_TO_CANONICAL_EV[0]}</strong>
                  <span>EV</span>
                </button>
                <input
                  class="ev-edit"
                  id="${stat.key}-edit"
                  data-ev-edit="${stat.key}"
                  type="number"
                  inputmode="numeric"
                  min="${MIN_EV}"
                  max="${MAX_EV}"
                  step="${EV_STEP}"
                  value="${POINT_TO_CANONICAL_EV[0]}"
                  aria-label="${escapeHtml(stat.label)} EVs"
                />
              </span>
            </span>
          </div>
          <div class="slider-wrap">
            <input
              id="${stat.key}"
              name="${stat.key}"
              type="range"
              min="0"
              max="${MAX_STAT_CHAMPIONS}"
              step="1"
              value="0"
            />
            <span class="slider-scale" aria-hidden="true">
              <span>0</span>
              <span>${MAX_STAT_CHAMPIONS}</span>
            </span>
          </div>
          <output id="${stat.key}-result" for="${stat.key}">0</output>
        </div>`,
    )
    .join("");

  const donationLabel = DONATION_URL ? "Open PayPal" : "PAYPAL_URL env not set";
  const canonicalUrl = pageUrl ? escapeHtml(pageUrl) : null;
  const structuredData = escapeHtml(
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      applicationCategory: "UtilitiesApplication",
      author: {
        "@type": "Person",
        name: CREATOR_GITHUB_HANDLE,
        url: CREATOR_GITHUB_URL,
      },
      description: PAGE_DESCRIPTION,
      name: SITE_NAME,
      operatingSystem: "Web",
      url: pageUrl,
    }),
  );

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="description" content="${escapeHtml(PAGE_DESCRIPTION)}" />
    <meta name="robots" content="index,follow" />
    <meta name="theme-color" content="#08121b" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#08121b" media="(prefers-color-scheme: dark)" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
    <meta property="og:title" content="${escapeHtml(PAGE_TITLE)}" />
    <meta property="og:description" content="${escapeHtml(PAGE_DESCRIPTION)}" />
    ${canonicalUrl ? `<meta property="og:url" content="${canonicalUrl}" />` : ""}
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(PAGE_TITLE)}" />
    <meta name="twitter:description" content="${escapeHtml(PAGE_DESCRIPTION)}" />
    ${canonicalUrl ? `<link rel="canonical" href="${canonicalUrl}" />` : ""}
    <title>${escapeHtml(PAGE_TITLE)}</title>
    <script type="application/ld+json" nonce="${escapeHtml(scriptNonce)}">${structuredData}</script>
    <style>
      :root,
      html,
      body {
        background-color: #08121b;
      }

      :root {
        --bg: #08121b;
        --bg-soft: #102130;
        --panel: rgba(10, 22, 34, 0.84);
        --panel-strong: rgba(14, 28, 42, 0.95);
        --line: rgba(166, 191, 214, 0.16);
        --line-strong: rgba(166, 191, 214, 0.28);
        --text: #ecf4fb;
        --muted: #8fa7bc;
        --accent: #67f0c2;
        --accent-strong: #1fd39a;
        --highlight: #ffcf66;
        --danger: #ff7a7a;
        --secondary-accent: #8dc8ff;
        --shadow: 0 24px 80px rgba(0, 0, 0, 0.34);
        --radius-xl: 28px;
        --radius-lg: 20px;
        --radius-md: 16px;
        --radius-sm: 12px;
        --content-width: 72rem;
        --font-display: "Avenir Next", "Futura", "Trebuchet MS", sans-serif;
        --font-body: "Avenir Next", "Segoe UI", sans-serif;
        --ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1);
        --ease-spring-soft: cubic-bezier(0.2, 0.9, 0.24, 1);
        --motion-fast: 180ms;
        --motion-medium: 260ms;
        --motion-slow: 420ms;
      }

      * {
        box-sizing: border-box;
      }

      html {
        height: 100%;
        min-height: 100%;
        background-color: #08121b;
        background:
          radial-gradient(circle at top left, rgba(31, 211, 154, 0.2), transparent 32%),
          radial-gradient(circle at top right, rgba(141, 200, 255, 0.18), transparent 36%),
          linear-gradient(180deg, #08121b 0%, #091823 42%, #071018 100%);
      }

      body {
        margin: 0;
        min-height: 100%;
        min-height: 100vh;
        min-height: 100svh;
        overflow-x: hidden;
        overscroll-behavior-y: none;
        color: var(--text);
        font-family: var(--font-body);
        background-color: #08121b;
        background:
          radial-gradient(circle at 10% 20%, rgba(255, 207, 102, 0.08), transparent 18%),
          radial-gradient(circle at 85% 12%, rgba(103, 240, 194, 0.12), transparent 22%);
      }

      body::after {
        content: "";
        position: fixed;
        inset: -25svh 0;
        pointer-events: none;
        z-index: -1;
        background:
          radial-gradient(circle at top left, rgba(31, 211, 154, 0.2), transparent 32%),
          radial-gradient(circle at top right, rgba(141, 200, 255, 0.18), transparent 36%),
          linear-gradient(180deg, #08121b 0%, #091823 42%, #071018 100%);
      }

      body::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        background-image:
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        background-size: 30px 30px;
        mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.35), transparent 75%);
      }

      .page {
        width: min(calc(100% - 1rem), var(--content-width));
        margin: 0 auto;
        min-height: 100svh;
        padding:
          max(0.5rem, env(safe-area-inset-top))
          0
          0;
      }

      .shell {
        position: relative;
        overflow: hidden;
        border: 1px solid var(--line);
        border-radius: var(--radius-xl);
        background: linear-gradient(180deg, rgba(14, 28, 42, 0.94), rgba(8, 18, 27, 0.98));
        box-shadow: var(--shadow);
        backdrop-filter: blur(18px);
      }

      .shell::before,
      .shell::after {
        content: "";
        position: absolute;
        pointer-events: none;
        border-radius: 999px;
        filter: blur(22px);
      }

      .shell::before {
        top: -4rem;
        right: -4rem;
        width: 12rem;
        height: 12rem;
        background: rgba(103, 240, 194, 0.18);
      }

      .shell::after {
        left: -4rem;
        bottom: -6rem;
        width: 14rem;
        height: 14rem;
        background: rgba(141, 200, 255, 0.12);
      }

      .hero {
        position: relative;
        padding: 0.9rem 0.8rem 0.75rem;
      }

      .hero-head {
        display: grid;
        gap: 0.75rem;
        position: relative;
        z-index: 7;
      }

      .hero-copy {
        min-width: 0;
      }

      .hero-subtitle {
        display: block;
      }

      .top-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
      }

      .action-menu {
        position: relative;
      }

      .action-menu[data-open="true"] {
        z-index: 8;
      }

      .action-trigger {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.72rem 0.9rem;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.04);
        color: var(--text);
        font: inherit;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
        transition:
          transform var(--motion-medium) var(--ease-out-soft),
          background var(--motion-medium) var(--ease-out-soft),
          border-color var(--motion-medium) var(--ease-out-soft),
          box-shadow var(--motion-medium) var(--ease-out-soft);
      }

      .action-trigger:focus-visible {
        outline: 2px solid var(--secondary-accent);
        outline-offset: 3px;
      }

      .action-caret {
        color: var(--muted);
        font-size: 0.72rem;
        transition: transform var(--motion-medium) var(--ease-out-soft);
      }

      .action-panel {
        display: none;
        position: absolute;
        top: calc(100% + 0.35rem);
        left: 0;
        z-index: 6;
        gap: 0.6rem;
        min-width: 14rem;
        padding: 0.8rem;
        border: 1px solid var(--line);
        border-radius: var(--radius-md);
        background: var(--panel-strong);
        box-shadow: 0 18px 48px rgba(0, 0, 0, 0.34);
        will-change: opacity, transform;
      }

      .action-menu.align-right .action-panel {
        left: auto;
        right: 0;
      }

      .action-menu[data-open="true"] .action-panel {
        display: grid;
      }

      .action-menu[data-open="true"] .action-caret {
        transform: rotate(180deg);
      }

      .action-panel h3 {
        margin: 0;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--muted);
      }

      .action-copy {
        margin-top: 0;
        margin-bottom: 0;
        color: var(--text);
        font-size: 1rem;
        font-weight: 600;
        letter-spacing: -0.02em;
      }

      .action-link {
        display: inline-flex;
        align-items: center;
        color: inherit;
        text-decoration: none;
        border-bottom: 1px solid rgba(236, 244, 251, 0.22);
        line-height: 1.1;
        transition:
          color var(--motion-fast) ease,
          border-color var(--motion-fast) ease;
      }

      .action-link:hover {
        color: var(--secondary-accent);
        border-color: rgba(141, 200, 255, 0.5);
      }

      .action-copy.muted {
        color: var(--muted);
        font-size: 0.88rem;
        font-weight: 500;
      }

      .action-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .hero h1 {
        margin: 0;
        max-width: 12ch;
        font-family: var(--font-display);
        font-size: clamp(2.1rem, 9vw, 5rem);
        line-height: 0.94;
        letter-spacing: -0.06em;
      }

      .hero p {
        margin: 0;
        max-width: 34rem;
        color: var(--muted);
        font-size: 0.94rem;
        line-height: 1.5;
      }

      .hero-grid {
        display: grid;
        gap: 0.7rem;
        margin-top: 0.6rem;
      }

      .summary-card {
        border: 1px solid var(--line);
        border-radius: var(--radius-lg);
        background: var(--panel);
        backdrop-filter: blur(14px);
        transition:
          transform var(--motion-medium) var(--ease-out-soft),
          border-color var(--motion-medium) var(--ease-out-soft),
          background var(--motion-medium) var(--ease-out-soft),
          box-shadow var(--motion-medium) var(--ease-out-soft);
      }

      .summary-card {
        padding: 0.72rem;
      }

      .summary-label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 0.42rem;
        color: var(--muted);
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .summary-value {
        display: flex;
        align-items: baseline;
        gap: 0.45rem;
      }

      .summary-value strong {
        font-family: var(--font-display);
        font-size: clamp(1.7rem, 9.4vw, 3.3rem);
        line-height: 0.95;
        letter-spacing: -0.08em;
      }

      .summary-value span {
        color: var(--muted);
        font-size: 0.84rem;
      }

      .progress {
        position: relative;
        height: 0.74rem;
        overflow: hidden;
        border-radius: 999px;
        background: rgba(143, 167, 188, 0.16);
      }

      .progress > span {
        position: absolute;
        inset: 0 auto 0 0;
        width: 0%;
        border-radius: inherit;
        background: linear-gradient(90deg, var(--accent), var(--highlight));
        transition:
          width 260ms cubic-bezier(0.22, 1, 0.36, 1),
          filter 260ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .summary-meta {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 0.42rem;
        color: var(--muted);
        font-size: 0.74rem;
      }

      .budget-bar {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 0.38rem;
        color: var(--muted);
        font-size: 0.71rem;
      }

      .app {
        position: relative;
        padding: 0 0.8rem 0.8rem;
      }

      .calculator {
        border: 1px solid var(--line);
        border-radius: var(--radius-lg);
        background: var(--panel);
        padding: 0.72rem;
        transition:
          transform var(--motion-medium) var(--ease-out-soft),
          border-color var(--motion-medium) var(--ease-out-soft),
          background var(--motion-medium) var(--ease-out-soft),
          box-shadow var(--motion-medium) var(--ease-out-soft);
      }

      .section-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 0.55rem;
      }

      .section-head > :first-child {
        flex: 1 1 auto;
        min-width: 0;
      }

      .section-head h2 {
        margin: 0;
        font-size: 0.94rem;
      }

      .section-head p {
        margin: 0.22rem 0 0;
        color: var(--muted);
        font-size: 0.76rem;
        line-height: 1.28;
      }

      .stat-grid {
        display: grid;
        gap: 0.48rem;
        margin-top: 0.56rem;
      }

      .setup-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.5fr) minmax(9.5rem, 0.72fr);
        gap: 0.48rem;
        margin-bottom: 0.5rem;
      }

      .setup-field {
        display: grid;
        gap: 0.22rem;
        min-width: 0;
      }

      .setup-label {
        color: var(--muted);
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .setup-input,
      .setup-select {
        width: 100%;
        min-height: 2.42rem;
        margin: 0;
        padding: 0.56rem 0.72rem;
        border: 1px solid var(--line);
        border-radius: 0.9rem;
        outline: none;
        background: rgba(255, 255, 255, 0.04);
        color: var(--text);
        font: 500 0.88rem/1.2 "SFMono-Regular", "Menlo", "Consolas", monospace;
        font-variant-ligatures: none;
        font-feature-settings: "liga" 0, "clig" 0, "calt" 0;
        text-transform: none;
        text-rendering: geometricPrecision;
        unicode-bidi: plaintext;
        -webkit-font-smoothing: antialiased;
        letter-spacing: normal;
        word-spacing: normal;
      }

      .setup-input::placeholder {
        color: rgba(143, 167, 188, 0.82);
      }

      .setup-input:focus,
      .setup-select:focus {
        border-color: rgba(103, 240, 194, 0.42);
        box-shadow: 0 0 0 4px rgba(103, 240, 194, 0.08);
      }

      .setup-select {
        appearance: none;
        background-image:
          linear-gradient(45deg, transparent 50%, rgba(236, 244, 251, 0.8) 50%),
          linear-gradient(135deg, rgba(236, 244, 251, 0.8) 50%, transparent 50%);
        background-position:
          calc(100% - 1.1rem) calc(50% - 0.15rem),
          calc(100% - 0.8rem) calc(50% - 0.15rem);
        background-size: 0.38rem 0.38rem, 0.38rem 0.38rem;
        background-repeat: no-repeat;
        padding-right: 2.1rem;
      }

      .picker {
        position: relative;
      }

      .picker-row {
        display: flex;
        align-items: center;
        gap: 0.48rem;
        min-width: 0;
      }

      .picker-row .picker {
        flex: 1 1 auto;
        min-width: 0;
      }

      .pokemon-selected-sprite-shell {
        display: none;
        align-items: center;
        justify-content: center;
        width: 2.42rem;
        height: 2.42rem;
        border: 1px solid rgba(166, 191, 214, 0.24);
        border-radius: 999px;
        background: rgba(8, 18, 27, 0.78);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.06),
          0 10px 22px rgba(0, 0, 0, 0.18);
        flex: 0 0 auto;
      }

      .pokemon-selected-sprite-shell[data-visible="true"] {
        display: inline-flex;
      }

      .pokemon-selected-sprite {
        width: 1.82rem;
        height: 1.82rem;
        object-fit: contain;
        image-rendering: pixelated;
        filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.22));
      }

      .picker-menu {
        display: none;
        position: absolute;
        top: calc(100% + 0.28rem);
        left: 0;
        right: 0;
        z-index: 9;
        max-height: 16rem;
        overflow: auto;
        padding: 0.3rem;
        border: 1px solid var(--line);
        border-radius: 0.95rem;
        background: rgba(10, 22, 34, 0.98);
        box-shadow: 0 18px 36px rgba(0, 0, 0, 0.28);
      }

      .picker[data-open="true"] .picker-menu {
        display: grid;
        gap: 0.18rem;
      }

      .picker-empty {
        padding: 0.58rem 0.64rem;
        color: var(--muted);
        font-size: 0.8rem;
        font-weight: 600;
      }

      .picker-option {
        width: 100%;
        min-height: 0;
        padding: 0.52rem 0.6rem;
        border: 0;
        border-radius: 0.72rem;
        background: transparent;
        color: var(--text);
        font: 500 0.83rem/1.25 "SFMono-Regular", "Menlo", "Consolas", monospace;
        font-variant-ligatures: none;
        font-feature-settings: "liga" 0, "clig" 0, "calt" 0;
        text-align: left;
        box-shadow: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: none;
        text-rendering: geometricPrecision;
        unicode-bidi: plaintext;
        -webkit-font-smoothing: antialiased;
        letter-spacing: normal;
        word-spacing: normal;
      }

      .picker-option:hover,
      .picker-option[data-active="true"] {
        background: rgba(255, 255, 255, 0.08);
        box-shadow: none;
        transform: none;
      }

      .showdown-import-bar {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.7rem;
      }

      .showdown-import-btn {
        min-width: 11.4rem;
        flex: 0 0 auto;
      }

      .showdown-import-status {
        display: inline-block;
        order: -1;
        color: var(--muted);
        font-size: 0.8rem;
        font-weight: 700;
        text-align: right;
        min-width: 0;
        max-width: min(20rem, 42vw);
      }

      .showdown-import-status.warning {
        color: var(--danger);
      }

      .showdown-import-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: "SFMono-Regular", "Menlo", "Consolas", monospace;
        font-weight: 500;
        font-variant-ligatures: none;
        font-feature-settings: "liga" 0, "clig" 0, "calt" 0;
        text-transform: none;
        text-rendering: geometricPrecision;
        unicode-bidi: plaintext;
        -webkit-font-smoothing: antialiased;
      }

      .showdown-preview {
        min-height: 10.5rem;
        resize: vertical;
        font: 600 0.82rem/1.45 "SFMono-Regular", "Menlo", "Consolas", monospace;
      }

      .stat-card {
        display: grid;
        grid-template-columns: minmax(5.2rem, auto) minmax(0, 1fr) auto;
        align-items: center;
        gap: 0.34rem 0.62rem;
        padding: 0.5rem 0.56rem;
        border: 1px solid var(--line);
        border-radius: var(--radius-md);
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent),
          rgba(255, 255, 255, 0.015);
        transition:
          border-color var(--motion-fast) ease,
          transform var(--motion-medium) var(--ease-out-soft),
          background var(--motion-medium) var(--ease-out-soft),
          box-shadow var(--motion-medium) var(--ease-out-soft);
      }

      .stat-card:focus-within {
        border-color: var(--line-strong);
        transform: translateY(-2px);
        background:
          linear-gradient(180deg, rgba(103, 240, 194, 0.07), transparent),
          rgba(255, 255, 255, 0.02);
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.14);
      }

      .stat-info {
        display: grid;
        gap: 0.18rem;
        min-width: 0;
      }

      .stat-value-wrap {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        min-width: 0;
      }

      .stat-name {
        display: inline-flex;
        align-items: center;
        gap: 0.28rem;
        font-size: 0.84rem;
        font-weight: 700;
        cursor: pointer;
        letter-spacing: -0.01em;
      }

      .stat-nature-indicator {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 1em;
        color: var(--muted);
        font-size: 0.68rem;
        line-height: 1;
        opacity: 0;
        transform: translateY(1px);
        transition:
          opacity var(--motion-fast) ease,
          color var(--motion-fast) ease,
          transform var(--motion-fast) ease;
      }

      .stat-nature-indicator[data-state="up"] {
        color: var(--accent);
        opacity: 1;
      }

      .stat-nature-indicator[data-state="down"] {
        color: #ff9a9a;
        opacity: 1;
      }

      .stat-base {
        color: var(--muted);
        font-size: 0.62rem;
        font-weight: 600;
        letter-spacing: 0.02em;
      }

      .ev-editor {
        position: relative;
        display: inline-grid;
        min-width: 4.25rem;
      }

      .ev-pill {
        display: inline-flex;
        align-items: baseline;
        justify-content: center;
        gap: 0.24rem;
        min-height: auto;
        padding: 0.22rem 0.46rem;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.04);
        color: var(--muted);
        font-size: 0.66rem;
        font-weight: 700;
        box-shadow: none;
        cursor: text;
      }

      .ev-pill:hover {
        transform: none;
        box-shadow: none;
        border-color: var(--line-strong);
        background: rgba(255, 255, 255, 0.06);
      }

      .ev-pill:focus-visible {
        outline: 2px solid rgba(141, 200, 255, 0.55);
        outline-offset: 2px;
      }

      .ev-pill strong {
        color: var(--text);
        font-size: 0.78rem;
        font-variant-numeric: tabular-nums;
      }

      .ev-edit {
        position: absolute;
        inset: 0;
        width: 100%;
        margin: 0;
        padding: 0.22rem 0.46rem;
        border: 1px solid rgba(103, 240, 194, 0.34);
        border-radius: 999px;
        outline: none;
        background: rgba(3, 10, 16, 0.92);
        color: var(--text);
        font: 700 0.78rem/1 var(--font-body);
        font-variant-numeric: tabular-nums;
        text-align: center;
        opacity: 0;
        pointer-events: none;
        transform: scale(0.98);
        transition:
          opacity var(--motion-fast) ease,
          transform var(--motion-fast) ease,
          border-color var(--motion-fast) ease,
          box-shadow var(--motion-fast) ease;
      }

      .ev-edit:focus {
        border-color: rgba(103, 240, 194, 0.52);
        box-shadow: 0 0 0 4px rgba(103, 240, 194, 0.08);
      }

      .ev-edit::-webkit-outer-spin-button,
      .ev-edit::-webkit-inner-spin-button {
        margin: 0;
        -webkit-appearance: none;
      }

      .ev-editor[data-editing="true"] .ev-pill {
        opacity: 0;
        pointer-events: none;
        transform: scale(0.98);
      }

      .ev-editor[data-editing="true"] .ev-edit {
        opacity: 1;
        pointer-events: auto;
        transform: scale(1);
      }

      .slider-wrap {
        display: grid;
        gap: 0.18rem;
        min-width: 0;
      }

      .stat-card input {
        width: 100%;
        margin: 0;
        accent-color: var(--accent);
      }

      .stat-card input:focus {
        outline: none;
      }

      .stat-card input[type="range"] {
        height: 1.45rem;
        background: transparent;
        --ratio: 0;
      }

      .stat-card input[type="range"]::-webkit-slider-runnable-track {
        height: 0.44rem;
        border-radius: 999px;
        background:
          linear-gradient(
            90deg,
            #1e86ff 0%,
            #1e86ff calc(var(--ratio) * 100%),
            rgba(243, 247, 252, 0.94) calc(var(--ratio) * 100%),
            rgba(243, 247, 252, 0.94) 100%
          );
      }

      .stat-card input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 1.18rem;
        height: 1.18rem;
        margin-top: -0.37rem;
        border: 3px solid #f5f8fc;
        border-radius: 50%;
        background: #727284;
        box-shadow: 0 5px 14px rgba(0, 0, 0, 0.26);
      }

      .stat-card input[type="range"]::-moz-range-track {
        height: 0.44rem;
        border: 0;
        border-radius: 999px;
        background:
          linear-gradient(
            90deg,
            #1e86ff 0%,
            #1e86ff calc(var(--ratio) * 100%),
            rgba(243, 247, 252, 0.94) calc(var(--ratio) * 100%),
            rgba(243, 247, 252, 0.94) 100%
          );
      }

      .stat-card input[type="range"]::-moz-range-thumb {
        width: 1.18rem;
        height: 1.18rem;
        border: 3px solid #f5f8fc;
        border-radius: 50%;
        background: #727284;
        box-shadow: 0 5px 14px rgba(0, 0, 0, 0.26);
      }

      .slider-scale {
        display: flex;
        justify-content: space-between;
        color: var(--muted);
        font-size: 0.62rem;
        font-variant-numeric: tabular-nums;
      }

      .stat-card output {
        min-width: 2ch;
        font-family: var(--font-display);
        font-size: 1.18rem;
        letter-spacing: -0.04em;
        font-variant-numeric: tabular-nums;
        text-align: right;
      }

      .toolbar {
        display: grid;
        gap: 0.5rem;
        margin-top: 0.55rem;
      }

      .button-row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        width: min(100%, 20.5rem);
        gap: 0.6rem;
        justify-self: end;
      }

      button,
      .share-link {
        appearance: none;
        border: 0;
        border-radius: 999px;
        min-height: 2.72rem;
        padding: 0.72rem 0.88rem;
        font: inherit;
        font-weight: 700;
        font-size: 0.92rem;
        text-align: center;
        text-decoration: none;
        cursor: pointer;
        transition:
          transform var(--motion-medium) var(--ease-out-soft),
          opacity var(--motion-medium) var(--ease-out-soft),
          background var(--motion-medium) var(--ease-out-soft),
          border-color var(--motion-medium) var(--ease-out-soft),
          box-shadow var(--motion-medium) var(--ease-out-soft);
      }

      button:hover,
      .share-link:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);
      }

      .primary-btn {
        color: #062019;
        background: linear-gradient(135deg, var(--accent), #9af4db);
      }

      .ghost-btn,
      .share-link {
        color: var(--text);
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.04);
      }

      .ghost-btn.danger {
        color: #ffd7d7;
        border-color: rgba(255, 122, 122, 0.36);
        background: rgba(255, 122, 122, 0.12);
      }

      .ghost-btn.danger:hover {
        border-color: rgba(255, 122, 122, 0.52);
        background: rgba(255, 122, 122, 0.18);
      }

      .share-link[hidden] {
        display: none;
      }

      .chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.45rem;
        padding: 0.48rem 0.7rem;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.04);
        color: var(--muted);
        font-size: 0.82rem;
        text-decoration: none;
        transition:
          transform var(--motion-medium) var(--ease-out-soft),
          background var(--motion-medium) var(--ease-out-soft),
          border-color var(--motion-medium) var(--ease-out-soft),
          box-shadow var(--motion-medium) var(--ease-out-soft),
          color var(--motion-medium) var(--ease-out-soft);
      }

      .chip svg {
        width: 1rem;
        height: 1rem;
        fill: currentColor;
      }

      .paypal-mark {
        display: block;
        width: 1.08rem;
        height: 1.08rem;
        overflow: visible;
        shape-rendering: geometricPrecision;
      }

      .chip.icon-only {
        width: 3rem;
        min-width: 3rem;
        padding: 0;
      }

      .chip:hover {
        transform: translateY(-1px);
        border-color: var(--line-strong);
        box-shadow: 0 10px 22px rgba(0, 0, 0, 0.14);
      }

      .chip.primary {
        color: #062019;
        border-color: transparent;
        background: linear-gradient(135deg, var(--accent), #9af4db);
      }

      .footer-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 3rem;
        padding: 0.85rem 1rem;
        border: 1px solid var(--line);
        border-radius: 999px;
        color: var(--text);
        background: rgba(255, 255, 255, 0.04);
        font-weight: 700;
        text-decoration: none;
        transition:
          transform var(--motion-medium) var(--ease-out-soft),
          background var(--motion-medium) var(--ease-out-soft),
          border-color var(--motion-medium) var(--ease-out-soft),
          box-shadow var(--motion-medium) var(--ease-out-soft);
      }

      .footer-link:hover {
        transform: translateY(-1px);
        border-color: var(--line-strong);
        box-shadow: 0 10px 22px rgba(0, 0, 0, 0.14);
      }

      .footer-link.primary {
        border: 0;
        color: #062019;
        background: linear-gradient(135deg, var(--accent), #9af4db);
      }

      .footer-link.icon-only {
        width: 3rem;
        min-width: 3rem;
        padding: 0;
      }

      .footer-link.icon-only svg {
        width: 1.1rem;
        height: 1.1rem;
        fill: currentColor;
      }

      .help-fab {
        position: absolute;
        left: 0.9rem;
        bottom: 0.9rem;
        z-index: 5;
        width: 3rem;
        min-width: 3rem;
        min-height: 3rem;
        padding: 0;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: rgba(10, 22, 34, 0.9);
        color: var(--text);
        box-shadow: 0 18px 38px rgba(0, 0, 0, 0.22);
        backdrop-filter: blur(14px);
      }

      .help-fab:hover {
        border-color: var(--line-strong);
        background: rgba(18, 33, 48, 0.96);
      }

      .help-fab span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        font-size: 1rem;
        font-weight: 800;
        line-height: 1;
      }

      .tips-list {
        margin: 0;
        padding-left: 1.1rem;
        color: var(--muted);
        display: grid;
        gap: 0.5rem;
        font-size: 0.88rem;
        line-height: 1.5;
      }

      .reset-modal {
        width: min(calc(100% - 1.5rem), 24rem);
        margin: auto;
        padding: 0;
        border: 1px solid var(--line);
        border-radius: var(--radius-lg);
        background: linear-gradient(180deg, rgba(14, 28, 42, 0.98), rgba(8, 18, 27, 0.98));
        color: var(--text);
        box-shadow: 0 28px 80px rgba(0, 0, 0, 0.4);
        opacity: 0;
        transform: translateY(18px) scale(0.975);
        transition:
          opacity var(--motion-medium) var(--ease-out-soft),
          transform var(--motion-medium) var(--ease-spring-soft);
        will-change: opacity, transform;
      }

      .reset-modal::backdrop {
        background: rgba(3, 10, 16, 0.72);
        backdrop-filter: blur(8px);
        animation: modal-backdrop-out var(--motion-fast) ease forwards;
      }

      .reset-modal-content {
        display: grid;
        gap: 0.8rem;
        padding: 1rem;
        opacity: 0;
        transform: translateY(10px);
        transition:
          opacity var(--motion-medium) var(--ease-out-soft),
          transform var(--motion-medium) var(--ease-spring-soft);
      }

      .reset-modal h3 {
        margin: 0;
        font-size: 1rem;
        letter-spacing: -0.03em;
      }

      .reset-modal p {
        margin: 0;
        color: var(--muted);
        line-height: 1.5;
      }

      .modal-field {
        display: grid;
        gap: 0.45rem;
      }

      .modal-label {
        color: var(--muted);
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      .modal-input {
        width: 100%;
        margin: 0;
        padding: 0.82rem 0.9rem;
        border: 1px solid rgba(103, 240, 194, 0.26);
        border-radius: var(--radius-sm);
        outline: none;
        background: rgba(3, 10, 16, 0.86);
        color: var(--text);
        font: 700 1rem/1.1 var(--font-body);
        font-variant-numeric: tabular-nums;
      }

      .modal-input:focus {
        border-color: rgba(103, 240, 194, 0.52);
        box-shadow: 0 0 0 4px rgba(103, 240, 194, 0.08);
      }

      .modal-input::-webkit-outer-spin-button,
      .modal-input::-webkit-inner-spin-button {
        margin: 0;
        -webkit-appearance: none;
      }

      .modal-textarea {
        min-height: 10.5rem;
        resize: vertical;
        font: 600 0.82rem/1.45 "SFMono-Regular", "Menlo", "Consolas", monospace;
      }

      .modal-toggle-group {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.55rem;
      }

      .modal-toggle {
        min-height: 2.65rem;
        padding: 0.62rem 0.75rem;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.04);
        color: var(--muted);
        font-size: 0.82rem;
        font-weight: 700;
        letter-spacing: 0.01em;
        box-shadow: none;
      }

      .modal-toggle[data-active="true"] {
        color: #062019;
        border-color: transparent;
        background: linear-gradient(135deg, var(--accent), #9af4db);
      }

      .modal-toggle:hover {
        box-shadow: none;
      }

      .modal-note {
        color: var(--muted);
        font-size: 0.78rem;
        line-height: 1.45;
      }

      .modal-help {
        position: relative;
        flex: 0 0 auto;
      }

      .modal-toggle-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 0.6rem;
      }

      .modal-help-trigger {
        min-height: 2rem;
        width: 2rem;
        min-width: 2rem;
        padding: 0;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.04);
        color: var(--muted);
        font-size: 0.92rem;
        font-weight: 800;
        line-height: 1;
        box-shadow: none;
      }

      .modal-help-trigger:hover,
      .modal-help-trigger:focus-visible {
        color: var(--text);
        border-color: var(--line-strong);
        background: rgba(255, 255, 255, 0.08);
        box-shadow: none;
      }

      .modal-help-panel {
        position: absolute;
        right: 0;
        top: calc(100% + 0.55rem);
        width: min(18rem, calc(100vw - 2rem));
        padding: 0.75rem 0.8rem;
        border: 1px solid var(--line);
        border-radius: var(--radius-sm);
        background: rgba(10, 22, 34, 0.98);
        box-shadow: 0 16px 34px rgba(0, 0, 0, 0.28);
        opacity: 0;
        transform: translateY(-4px) scale(0.985);
        pointer-events: none;
        transition:
          opacity var(--motion-medium) var(--ease-out-soft),
          transform var(--motion-medium) var(--ease-spring-soft);
      }

      .modal-help:hover .modal-help-panel,
      .modal-help:focus-within .modal-help-panel {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      .reset-modal-actions {
        display: grid;
        gap: 0.6rem;
      }

      .reset-modal[open][data-visible="true"] {
        opacity: 1;
        transform: translateY(0) scale(1);
      }

      .reset-modal[open][data-visible="true"] .reset-modal-content {
        opacity: 1;
        transform: translateY(0);
      }

      .reset-modal[open][data-visible="true"]::backdrop {
        animation: modal-backdrop-in var(--motion-medium) var(--ease-out-soft) forwards;
      }

      @media (hover: hover) and (pointer: fine) {
        .summary-card:hover,
        .calculator:hover {
          transform: translateY(-1px);
          border-color: var(--line-strong);
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.14);
        }

        .action-panel {
          display: grid;
          position: absolute;
          top: calc(100% + 0.35rem);
          left: 0;
          z-index: 6;
          opacity: 0;
          transform: translateY(-6px) scale(0.985);
          pointer-events: none;
          transition:
            opacity var(--motion-medium) var(--ease-out-soft),
            transform var(--motion-medium) var(--ease-spring-soft);
          transform-origin: top left;
        }

        .action-menu.align-right .action-panel {
          left: auto;
          right: 0;
          transform-origin: top right;
        }

        .action-menu[data-open="true"] .action-panel {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        .action-menu[data-open="true"] .action-trigger {
          transform: translateY(-1px);
          border-color: var(--line-strong);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.16);
        }

        .action-menu[data-open="true"] .action-caret {
          transform: rotate(180deg);
        }
      }

      .warning {
        color: var(--danger);
      }

      @supports (padding: max(0px)) {
        .page {
          padding-left: max(0px, env(safe-area-inset-left));
          padding-right: max(0px, env(safe-area-inset-right));
        }
      }

      .reveal {
        opacity: 0;
        transform: translateY(14px) scale(0.988);
        animation: rise 760ms var(--ease-out-soft) forwards;
        animation-delay: var(--delay, 0ms);
        will-change: opacity, transform;
      }

      @keyframes rise {
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes modal-backdrop-in {
        from {
          background: rgba(3, 10, 16, 0);
          backdrop-filter: blur(0);
        }

        to {
          background: rgba(3, 10, 16, 0.72);
          backdrop-filter: blur(8px);
        }
      }

      @keyframes modal-backdrop-out {
        from {
          background: rgba(3, 10, 16, 0.72);
          backdrop-filter: blur(8px);
        }

        to {
          background: rgba(3, 10, 16, 0);
          backdrop-filter: blur(0);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 1ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 1ms !important;
          scroll-behavior: auto !important;
        }
      }

      @media (max-width: 559px) {
        .page {
          width: 100%;
          padding:
            env(safe-area-inset-top)
            0
            0;
        }

        .shell {
          border-left: 0;
          border-right: 0;
          border-bottom: 0;
          border-radius: 0;
          box-shadow: none;
        }

        .hero {
          padding: 0.68rem 0.78rem 0.48rem;
        }

        .hero-head {
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: start;
          gap: 0.52rem 0.72rem;
        }

        .hero h1 {
          font-size: clamp(1.4rem, 6.8vw, 1.95rem);
          line-height: 0.98;
        }

        .hero-subtitle {
          display: none;
        }

        .top-actions {
          justify-self: end;
          align-self: start;
        }

        .hero-grid {
          position: sticky;
          top: max(0.35rem, env(safe-area-inset-top));
          z-index: 3;
          margin-top: 0.55rem;
        }

        .summary-card {
          padding: 0.76rem 0.8rem;
          border-radius: 18px;
          background: rgba(10, 22, 34, 0.92);
        }

        .summary-label {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 0.35rem 0.6rem;
          margin-bottom: 0.42rem;
          font-size: 0.68rem;
        }

        .summary-value {
          gap: 0.42rem;
        }

        .summary-value strong {
          font-size: clamp(1.6rem, 10vw, 2.1rem);
        }

        .summary-value span {
          font-size: 0.8rem;
        }

        .progress {
          height: 0.72rem;
        }

        .summary-meta,
        .budget-bar {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 0.3rem 0.6rem;
          margin-top: 0.42rem;
          font-size: 0.71rem;
        }

        .summary-meta span:last-child,
        .budget-bar span:last-child {
          text-align: right;
        }

        .app {
          padding: 0 0.78rem 0.78rem;
        }

        .calculator {
          padding: 0.74rem;
          border-radius: 18px;
        }

        .section-head {
          margin-bottom: 0.55rem;
        }

        .section-head h2 {
          font-size: 0.92rem;
        }

        .section-head p {
          display: none;
        }

        .stat-card,
        .action-panel {
          border-radius: 14px;
        }

        .stat-grid {
          gap: 0.56rem;
          margin-top: 0.66rem;
        }

        .stat-card {
          grid-template-columns: minmax(4.8rem, auto) minmax(0, 1fr) auto;
          gap: 0.28rem 0.48rem;
          padding: 0.48rem 0.54rem;
        }

        .stat-info {
          gap: 0.14rem;
        }

        .stat-name {
          font-size: 0.78rem;
        }

        .stat-value-wrap {
          gap: 0.26rem;
        }

        .ev-pill {
          padding: 0.18rem 0.4rem;
          font-size: 0.62rem;
        }

        .ev-pill strong {
          font-size: 0.72rem;
        }

        .stat-card output {
          font-size: 1rem;
        }

        .slider-wrap {
          gap: 0.14rem;
        }

        .slider-scale {
          font-size: 0.56rem;
        }

        .stat-card input[type="range"] {
          height: 1.28rem;
        }

        .stat-card input[type="range"]::-webkit-slider-runnable-track,
        .stat-card input[type="range"]::-moz-range-track {
          height: 0.38rem;
        }

        .stat-card input[type="range"]::-webkit-slider-thumb,
        .stat-card input[type="range"]::-moz-range-thumb {
          width: 1rem;
          height: 1rem;
        }

        .toolbar {
          gap: 0.5rem;
          margin-top: 0.62rem;
        }

        .setup-grid {
          grid-template-columns: 1fr;
          gap: 0.56rem;
        }

        .picker-row {
          align-items: stretch;
        }

        .picker-menu {
          left: calc(-2.9rem - 0.48rem);
          right: auto;
          width: min(calc(100vw - 1.56rem), calc(100% + 2.9rem + 0.48rem));
        }

        .picker-option {
          padding: 0.58rem 0.64rem;
          white-space: normal;
          overflow: visible;
          text-overflow: clip;
          line-height: 1.3;
        }

        .showdown-import-bar {
          align-items: stretch;
          flex-direction: column;
          justify-content: flex-start;
          width: 100%;
          margin-top: 0.2rem;
        }

        .showdown-import-btn {
          min-width: 0;
          width: 100%;
        }

        .showdown-import-status {
          display: none;
        }

        .button-row {
          gap: 0.5rem;
        }

        button,
        .share-link,
        .footer-link {
          min-height: 2.75rem;
          padding: 0.74rem 0.85rem;
          font-size: 0.88rem;
        }

        .top-actions {
          display: grid;
          gap: 0.55rem;
          position: relative;
          z-index: 6;
        }

        .action-trigger {
          width: 100%;
          justify-content: space-between;
          font-size: 0.74rem;
        }

        .action-panel {
          width: min(16rem, calc(100vw - 1.3rem));
          min-width: 0;
        }

        .reset-modal-content {
          padding: 0.9rem;
        }

        .help-fab {
          left: 0.78rem;
          bottom: 0.78rem;
          width: 2.8rem;
          min-width: 2.8rem;
          min-height: 2.8rem;
        }
      }

      @media (max-width: 820px) {
        .action-caret {
          display: none;
        }

        .top-actions {
          grid-template-columns: repeat(2, auto);
          justify-content: end;
        }

        .action-trigger {
          min-width: 3.1rem;
          min-height: 3.1rem;
          padding: 0.6rem 0.72rem;
          justify-content: center;
          border-radius: 1rem;
          font-size: 0.72rem;
          letter-spacing: 0.04em;
        }
      }

      @media (min-width: 760px) {
        .page {
          width: min(calc(100% - 1.5rem), var(--content-width));
          padding:
            max(0.9rem, env(safe-area-inset-top))
            0
            0;
        }

        .hero {
          padding: 1.6rem 1.4rem 1rem;
        }

        .hero-head {
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: start;
          gap: 1rem;
        }

        .app {
          padding-left: 1.4rem;
          padding-right: 1.4rem;
        }

        .summary-card {
          min-height: 100%;
          padding: 0.82rem 0.88rem;
        }

        .summary-label {
          margin-bottom: 0.5rem;
        }

        .summary-value strong {
          font-size: clamp(1.8rem, 4.6vw, 2.6rem);
        }

        .summary-value span {
          font-size: 0.82rem;
        }

        .summary-meta,
        .budget-bar {
          margin-top: 0.46rem;
        }

        .calculator {
          padding: 0.84rem 0.88rem 0.88rem;
        }

        .section-head {
          margin-bottom: 0.7rem;
        }

        .stat-grid {
          grid-template-columns: 1fr 1fr;
          gap: 0.62rem;
          margin-top: 0.68rem;
        }

        .stat-card {
          grid-template-columns: minmax(5rem, auto) minmax(0, 1fr) auto;
          gap: 0.32rem 0.62rem;
          padding: 0.56rem 0.62rem;
        }

        .stat-info {
          gap: 0.16rem;
        }

        .toolbar {
          grid-template-columns: 1fr auto;
          align-items: center;
        }

        .button-row {
          width: 100%;
          max-width: 21.5rem;
        }

        .top-actions {
          display: flex;
          gap: 0.7rem;
          justify-content: flex-end;
          align-self: start;
        }

        .action-trigger {
          width: auto;
          justify-content: flex-start;
          font-size: 0.78rem;
        }

        .action-panel {
          margin-top: 0;
        }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="shell">
        <header class="hero">
          <div class="hero-head">
            <div class="hero-copy">
              <h1 class="reveal" style="--delay:60ms">Champions EV calculator</h1>
              <p class="hero-subtitle reveal" style="--delay:110ms">
                Convert Showdown EVs into the new ${MAX_TOTAL_CHAMPIONS}-point Champions format
                with live sliders and instant set parsing.
              </p>
            </div>
            <div class="top-actions">
              <article class="action-menu reveal" style="--delay:20ms" data-action-menu data-action-kind="creator">
                <button class="action-trigger" type="button" aria-haspopup="true" aria-expanded="false">
                  <span>Creator</span>
                  <span class="action-caret" aria-hidden="true">▾</span>
                </button>
                <div class="action-panel">
                  <div class="action-row">
                    <p class="action-copy">
                      <a
                        class="action-link"
                        href="${escapeHtml(CREATOR_GITHUB_URL)}"
                        target="_blank"
                        rel="noreferrer"
                      >
                        ${escapeHtml(CREATOR_GITHUB_HANDLE)}
                      </a>
                    </p>
                    <a
                      class="footer-link icon-only"
                      href="${escapeHtml(PROJECT_GITHUB_URL)}"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="View ChampCalc on GitHub"
                      title="View ChampCalc on GitHub"
                    >
                      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.5 7.5 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
              <article class="action-menu align-right reveal" style="--delay:80ms" data-action-menu data-action-kind="donate">
                <button class="action-trigger" type="button" aria-haspopup="true" aria-expanded="false">
                  <span>Donate</span>
                  <span class="action-caret" aria-hidden="true">▾</span>
                </button>
                <div class="action-panel">
                  <div class="action-row">
                    <p class="action-copy ${DONATION_URL ? "" : "muted"}">
                      PayPal
                    </p>
                  ${
                    DONATION_URL
                      ? `<a
                          class="chip primary icon-only"
                          id="donate-chip"
                          href="${escapeHtml(DONATION_URL)}"
                          target="_blank"
                          rel="noreferrer"
                          aria-label="${escapeHtml(donationLabel)} with PayPal"
                          title="${escapeHtml(donationLabel)} with PayPal"
                        >
                          ${PAYPAL_ICON}
                        </a>`
                      : `<button
                          class="chip icon-only"
                          id="donate-chip"
                          type="button"
                          aria-label="${escapeHtml(donationLabel)}"
                          title="${escapeHtml(donationLabel)}"
                        >
                          ${PAYPAL_ICON}
                        </button>`
                  }
                  </div>
                </div>
              </article>
            </div>
          </div>
          <div class="hero-grid">
            <section class="summary-card reveal" style="--delay:180ms" aria-labelledby="summary-title">
              <div class="summary-label">
                <span id="summary-title">Total stat points</span>
              </div>
              <div class="summary-value">
                <strong id="total-value">0</strong>
                <span>/ ${MAX_TOTAL_CHAMPIONS}</span>
              </div>
              <div class="progress" aria-hidden="true">
                <span id="progress-bar"></span>
              </div>
              <div class="summary-meta">
                <span id="summary-hint">0 points remaining</span>
              </div>
              <div class="budget-bar">
                <span id="ev-total">0 / ${MAX_TOTAL_EVS} EVs</span>
                <span id="ev-hint">${MAX_TOTAL_EVS} EVs left</span>
              </div>
            </section>
          </div>
        </header>

        <main class="app">
          <section class="calculator reveal" style="--delay:300ms" aria-labelledby="calculator-title">
            <div class="section-head">
              <div>
                <h2 id="calculator-title">Stat inputs</h2>
                <p>Pick a Pokemon, choose a nature, import a set, or use the sliders.</p>
              </div>
              <div class="showdown-import-bar">
                <button class="ghost-btn showdown-import-btn" id="showdown-import-btn" type="button">
                  <span>Import Showdown set</span>
                </button>
                <span class="showdown-import-status" id="showdown-import-status">
                  <span class="showdown-import-label" id="showdown-import-label">No Showdown set imported</span>
                </span>
              </div>
            </div>

            <form id="calculator-form" novalidate>
              <div class="setup-grid">
                <label class="setup-field" for="pokemon-search">
                  <span class="setup-label">Pokemon</span>
                  <div class="picker-row">
                    <span
                      class="pokemon-selected-sprite-shell"
                      id="pokemon-selected-sprite-shell"
                      data-visible="false"
                      aria-hidden="true"
                    >
                      <img
                        class="pokemon-selected-sprite"
                        id="pokemon-selected-sprite"
                        alt=""
                        hidden
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <div class="picker" id="pokemon-picker" data-open="false">
                      <input
                        class="setup-input"
                        id="pokemon-search"
                        type="text"
                        autocomplete="off"
                        spellcheck="false"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded="false"
                        aria-controls="pokemon-results"
                        placeholder="Search Pokemon or forms..."
                      />
                      <div class="picker-menu" id="pokemon-results" role="listbox"></div>
                    </div>
                  </div>
                </label>
                <label class="setup-field" for="nature-select">
                  <span class="setup-label">Nature</span>
                  <select class="setup-select" id="nature-select" aria-label="Pokemon nature">
                    ${natureOptions
                      .map(
                        (nature) =>
                          `<option value="${escapeHtml(nature.name)}">${escapeHtml(renderNatureOptionLabel(nature))}</option>`,
                      )
                      .join("")}
                  </select>
                </label>
              </div>

              <div class="stat-grid">
                ${statCards}
              </div>

              <div class="toolbar">
                <div class="button-row">
                  <button class="ghost-btn" id="export-btn" type="button">Export</button>
                  <button class="ghost-btn danger" id="reset-btn" type="button">Reset</button>
                </div>
                <!--
                  Reserved for the future Export to Champions flow.
                  The old Share summary button markup is kept here as reference until export is implemented.
                <a
                  class="share-link"
                  id="share-link"
                  href="#"
                  ${APP_SHARE_MESSAGE ? "" : "hidden"}
                >
                  Share summary
                </a>
                -->
              </div>
            </form>
          </section>
        </main>

        <button
          class="help-fab"
          id="tips-btn"
          type="button"
          aria-label="Show tips and keybindings"
          title="Show tips and keybindings"
        >
          <span>?</span>
        </button>
      </div>
    </div>

    <dialog class="reset-modal" id="reset-modal" aria-labelledby="reset-modal-title">
      <div class="reset-modal-content">
        <h3 id="reset-modal-title">Reset all values?</h3>
        <p>This will clear the sliders and pasted Showdown set.</p>
        <div class="reset-modal-actions">
          <button class="ghost-btn" id="reset-cancel-btn" type="button">Cancel</button>
          <button class="primary-btn" id="reset-confirm-btn" type="button">Reset now</button>
        </div>
      </div>
    </dialog>

    <dialog class="reset-modal" id="showdown-import-modal" aria-labelledby="showdown-import-modal-title">
      <div class="reset-modal-content">
        <h3 id="showdown-import-modal-title">Paste a Showdown set</h3>
        <p>Paste the full set text. We will preview it before importing.</p>
        <label class="modal-field" for="showdown-import-input">
          <span class="modal-label">Showdown set</span>
          <textarea
            class="modal-input modal-textarea showdown-preview"
            id="showdown-import-input"
            maxlength="${MAX_SHOWDOWN_TEXT_LENGTH}"
            spellcheck="false"
            placeholder="Pikachu @ Light Ball&#10;Ability: Static&#10;EVs: 252 Atk / 4 SpD / 252 Spe&#10;Jolly Nature&#10;- Volt Tackle"
          ></textarea>
        </label>
        <p class="modal-note" id="showdown-import-feedback">
          Paste a full Showdown set with an EVs line to preview it.
        </p>
        <div class="reset-modal-actions">
          <button class="ghost-btn" id="showdown-import-cancel-btn" type="button">Cancel</button>
          <button class="primary-btn" id="showdown-import-preview-btn" type="button">Preview import</button>
        </div>
      </div>
    </dialog>

    <dialog class="reset-modal" id="showdown-confirm-modal" aria-labelledby="showdown-confirm-modal-title">
      <div class="reset-modal-content">
        <h3 id="showdown-confirm-modal-title">Import Showdown set?</h3>
        <p id="showdown-confirm-copy">This will replace the current stat values with the spread from the pasted set.</p>
        <label class="modal-field" for="showdown-confirm-preview">
          <span class="modal-label">Set preview</span>
          <textarea
            class="modal-input modal-textarea showdown-preview"
            id="showdown-confirm-preview"
            readonly
            spellcheck="false"
          ></textarea>
        </label>
        <div class="reset-modal-actions">
          <button class="ghost-btn" id="showdown-confirm-cancel-btn" type="button">Cancel</button>
          <button class="primary-btn" id="showdown-confirm-import-btn" type="button">Import set</button>
        </div>
      </div>
    </dialog>

    <dialog class="reset-modal" id="creator-modal" aria-labelledby="creator-modal-title">
      <div class="reset-modal-content">
        <h3 id="creator-modal-title">Creator</h3>
        <div class="action-row">
          <p class="action-copy">
            <a
              class="action-link"
              href="${escapeHtml(CREATOR_GITHUB_URL)}"
              target="_blank"
              rel="noreferrer"
            >
              ${escapeHtml(CREATOR_GITHUB_HANDLE)}
            </a>
          </p>
          <a
            class="footer-link icon-only"
            href="${escapeHtml(PROJECT_GITHUB_URL)}"
            target="_blank"
            rel="noreferrer"
            aria-label="View ChampCalc on GitHub"
            title="View ChampCalc on GitHub"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.5 7.5 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"></path>
            </svg>
          </a>
        </div>
        <div class="reset-modal-actions">
          <button class="primary-btn" id="creator-close-btn" type="button">Close</button>
        </div>
      </div>
    </dialog>

    <dialog class="reset-modal" id="donate-info-modal" aria-labelledby="donate-info-modal-title">
      <div class="reset-modal-content">
        <h3 id="donate-info-modal-title">Donate</h3>
        <div class="action-row">
          <p class="action-copy ${DONATION_URL ? "" : "muted"}">PayPal</p>
          ${
            DONATION_URL
              ? `<a
                  class="chip primary icon-only"
                  id="donate-modal-chip"
                  href="${escapeHtml(DONATION_URL)}"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="${escapeHtml(donationLabel)} with PayPal"
                  title="${escapeHtml(donationLabel)} with PayPal"
                >
                  ${PAYPAL_ICON}
                </a>`
              : `<button
                  class="chip icon-only"
                  id="donate-modal-chip"
                  type="button"
                  aria-label="${escapeHtml(donationLabel)}"
                  title="${escapeHtml(donationLabel)}"
                >
                  ${PAYPAL_ICON}
                </button>`
          }
        </div>
        <div class="reset-modal-actions">
          <button class="primary-btn" id="donate-info-close-btn" type="button">Close</button>
        </div>
      </div>
    </dialog>

    <dialog class="reset-modal" id="export-modal" aria-labelledby="export-modal-title">
      <div class="reset-modal-content">
        <h3 id="export-modal-title">Export spread</h3>
        <p>Choose whether to export canonical Champions SPs or an approximate legacy EV rewrite.</p>
        <div class="modal-toggle-row">
          <div class="modal-toggle-group" role="radiogroup" aria-label="Export format">
            <button
              class="modal-toggle"
              id="export-mode-champions"
              data-export-mode="champions"
              data-active="true"
              role="radio"
              aria-checked="true"
              autofocus
              type="button"
            >
              Champions SP
            </button>
            <button
              class="modal-toggle"
              id="export-mode-legacy"
              data-export-mode="legacy"
              data-active="false"
              role="radio"
              aria-checked="false"
              type="button"
            >
              Legacy EV
            </button>
          </div>
          <div class="modal-help">
            <button
              class="modal-help-trigger"
              type="button"
              aria-label="Export format help"
              title="Export format help"
            >
              ?
            </button>
            <div class="modal-help-panel" role="tooltip">
              <p class="modal-note" id="export-note">
                Champions SP export uses the direct Champions point spread.
                Legacy EV export is an approximation layer for older tools and Showdown-style text.
                Final battle stats depend on species, nature, and the real Champions stat formula.
              </p>
            </div>
          </div>
        </div>
        <label class="modal-field" for="export-output">
          <span class="modal-label">Export text</span>
          <textarea
            class="modal-input modal-textarea"
            id="export-output"
            readonly
            spellcheck="false"
          ></textarea>
        </label>
        <div class="reset-modal-actions">
          <button class="ghost-btn" id="export-copy-btn" type="button">Copy export</button>
          <button class="primary-btn" id="export-close-btn" type="button">Close</button>
        </div>
      </div>
    </dialog>

    <dialog class="reset-modal" id="donation-modal" aria-labelledby="donation-modal-title">
      <div class="reset-modal-content">
        <h3 id="donation-modal-title">PAYPAL_URL env not set</h3>
        <p>This deployment does not have a PayPal URL configured yet.</p>
        <div class="reset-modal-actions">
          <button class="primary-btn" id="donation-close-btn" type="button">Got it</button>
        </div>
      </div>
    </dialog>

    <dialog class="reset-modal" id="ev-modal" aria-labelledby="ev-modal-title">
      <div class="reset-modal-content">
        <h3 id="ev-modal-title">Set EV value</h3>
        <p id="ev-modal-copy">Type a precise EV value. If the total overflows, it will be adjusted automatically.</p>
        <label class="modal-field" for="ev-modal-input">
          <span class="modal-label">EV value</span>
          <input
            class="modal-input"
            id="ev-modal-input"
            type="number"
            inputmode="numeric"
            pattern="[0-9]*"
            enterkeyhint="done"
            min="${MIN_EV}"
            max="${MAX_EV}"
            step="${EV_STEP}"
            value="${MIN_EV}"
          />
        </label>
        <div class="reset-modal-actions">
          <button class="ghost-btn" id="ev-modal-cancel-btn" type="button">Cancel</button>
          <button class="primary-btn" id="ev-modal-confirm-btn" type="button">Apply</button>
        </div>
      </div>
    </dialog>

    <dialog class="reset-modal" id="tips-modal" aria-labelledby="tips-modal-title">
      <div class="reset-modal-content">
        <h3 id="tips-modal-title">Tips and keybindings</h3>
        <p>Useful shortcuts and mobile-friendly flows to move faster without losing accuracy.</p>
        <ul class="tips-list">
          <li>Pick a Pokemon and nature first if you want the live stat preview to reflect the real Champions formula for that species.</li>
          <li>Click an EV pill to type a precise value. On mobile, it opens the EV edit modal.</li>
          <li>Double-click a stat label like HP, Attack, or Defense to reset just that stat to 0.</li>
          <li>Double-click the big total stat points number to reset the whole spread to 0.</li>
          <li>Ctrl+click on Windows or Linux, or Cmd+click on macOS, sets that stat to the maximum useful EV value.</li>
          <li>Use Import Showdown set to bring in a full set. On mobile, pasting a valid full set outside a field opens the import confirmation modal.</li>
          <li>Imported Showdown sets keep the whole set text for export, including nicknames when present, and the badge tries to show the matching Pokemon sprite.</li>
          <li>Inside the Showdown import modal, Ctrl+Enter or Cmd+Enter previews the pasted set immediately.</li>
          <li>If you export without importing a set first, the app builds a starter Showdown-style export with the selected Pokemon, current nature, and SP or EV line.</li>
          <li>Use the export toggle to switch between canonical Champions SPs and approximate legacy EV breakpoints for older tools.</li>
        </ul>
        <div class="reset-modal-actions">
          <button class="primary-btn" id="tips-close-btn" type="button">Close</button>
        </div>
      </div>
    </dialog>

    <dialog class="reset-modal" id="intro-modal" aria-labelledby="intro-modal-title">
      <div class="reset-modal-content">
        <h3 id="intro-modal-title">Welcome to ChampCalc</h3>
        <p>
          This tool converts legacy EV spreads into the Pokemon Champions stat-point format and lets you
          import full Showdown sets for quick editing and export.
        </p>
        <p>
          If you want to discover more shortcuts and features, use the <strong>?</strong> button in the
          bottom corner of the page.
        </p>
        <div class="reset-modal-actions">
          <button class="primary-btn" id="intro-close-btn" type="button">Let’s go</button>
        </div>
      </div>
    </dialog>

    <script type="module" nonce="${escapeHtml(scriptNonce)}">
      const maxStatPoints = ${JSON.stringify(MAX_STAT_CHAMPIONS)};
      const maxTotal = ${JSON.stringify(MAX_TOTAL_CHAMPIONS)};
      const pointToEv = ${JSON.stringify(POINT_TO_CANONICAL_EV)};
      const natureProfiles = ${JSON.stringify(natureOptions)};
      // Reserved for the future Export to Champions flow.
      // const shareMessage = ${JSON.stringify(APP_SHARE_MESSAGE)};
      // const downloadUrl = ${JSON.stringify(APP_DOWNLOAD_URL)};

      const statKeys = ${JSON.stringify(EV_STAT_KEYS)};
      const maxShowdownTextLength = ${JSON.stringify(MAX_SHOWDOWN_TEXT_LENGTH)};
      const introSeenStorageKey = "champcalc:intro-seen:v1";
      const pokemonListCacheKey = "champcalc:pokemon-list:v2";
      const pokemonDetailsCachePrefix = "champcalc:pokemon-details:v2:";
      const selectedPokemonStorageKey = "champcalc:selected-pokemon:v2";
      const selectedNatureStorageKey = "champcalc:selected-nature:v1";
      const spriteCachePrefix = "champcalc:pokemon-sprite:v2:";
      const pokemonListCacheTtlMs = 1000 * 60 * 60 * 24 * 7;
      const pokemonDetailsCacheTtlMs = 1000 * 60 * 60 * 24 * 30;
      const spriteCacheTtlMs = 1000 * 60 * 60 * 24 * 30;
      const form = document.querySelector("#calculator-form");
      const totalValue = document.querySelector("#total-value");
      const summaryHint = document.querySelector("#summary-hint");
      const progressBar = document.querySelector("#progress-bar");
      const evTotal = document.querySelector("#ev-total");
      const evHint = document.querySelector("#ev-hint");
      const donateChip = document.querySelector("#donate-chip");
      const donateModalChip = document.querySelector("#donate-modal-chip");
      // Reserved for the future Export to Champions flow.
      // const shareLink = document.querySelector("#share-link");
      const creatorModal = document.querySelector("#creator-modal");
      const creatorCloseButton = document.querySelector("#creator-close-btn");
      const donateInfoModal = document.querySelector("#donate-info-modal");
      const donateInfoCloseButton = document.querySelector("#donate-info-close-btn");
      const exportButton = document.querySelector("#export-btn");
      const resetButton = document.querySelector("#reset-btn");
      const donationModal = document.querySelector("#donation-modal");
      const donationCloseButton = document.querySelector("#donation-close-btn");
      const evModal = document.querySelector("#ev-modal");
      const evModalTitle = document.querySelector("#ev-modal-title");
      const evModalInput = document.querySelector("#ev-modal-input");
      const evModalCancelButton = document.querySelector("#ev-modal-cancel-btn");
      const evModalConfirmButton = document.querySelector("#ev-modal-confirm-btn");
      const exportModal = document.querySelector("#export-modal");
      const exportCopyButton = document.querySelector("#export-copy-btn");
      const exportCloseButton = document.querySelector("#export-close-btn");
      const exportOutput = document.querySelector("#export-output");
      const exportNote = document.querySelector("#export-note");
      const exportModeButtons = Array.from(document.querySelectorAll("[data-export-mode]"));
      const resetModal = document.querySelector("#reset-modal");
      const resetCancelButton = document.querySelector("#reset-cancel-btn");
      const resetConfirmButton = document.querySelector("#reset-confirm-btn");
      const tipsButton = document.querySelector("#tips-btn");
      const tipsModal = document.querySelector("#tips-modal");
      const tipsCloseButton = document.querySelector("#tips-close-btn");
      const introModal = document.querySelector("#intro-modal");
      const introCloseButton = document.querySelector("#intro-close-btn");
      const showdownImportButton = document.querySelector("#showdown-import-btn");
      const showdownImportLabel = document.querySelector("#showdown-import-label");
      const showdownImportStatus = document.querySelector("#showdown-import-status");
      const showdownImportModal = document.querySelector("#showdown-import-modal");
      const showdownImportInput = document.querySelector("#showdown-import-input");
      const showdownImportFeedback = document.querySelector("#showdown-import-feedback");
      const showdownImportCancelButton = document.querySelector("#showdown-import-cancel-btn");
      const showdownImportPreviewButton = document.querySelector("#showdown-import-preview-btn");
      const showdownConfirmModal = document.querySelector("#showdown-confirm-modal");
      const showdownConfirmCopy = document.querySelector("#showdown-confirm-copy");
      const showdownConfirmPreview = document.querySelector("#showdown-confirm-preview");
      const showdownConfirmCancelButton = document.querySelector("#showdown-confirm-cancel-btn");
      const showdownConfirmImportButton = document.querySelector("#showdown-confirm-import-btn");
      const pokemonPicker = document.querySelector("#pokemon-picker");
      const pokemonSearch = document.querySelector("#pokemon-search");
      const pokemonResults = document.querySelector("#pokemon-results");
      const selectedPokemonSpriteShell = document.querySelector("#pokemon-selected-sprite-shell");
      const selectedPokemonSprite = document.querySelector("#pokemon-selected-sprite");
      const natureSelect = document.querySelector("#nature-select");
      const actionMenus = Array.from(document.querySelectorAll("[data-action-menu]"));
      const evEditors = Array.from(document.querySelectorAll("[data-ev-editor]"));
      const modalCloseTimers = new WeakMap();
      const compactActionUi = window.matchMedia("(max-width: 820px)");
      let exportMode = "champions";
      let activeEvEditor = null;
      let importedShowdownText = "";
      let pendingShowdownText = "";
      let pokemonEntries = [];
      let filteredPokemonEntries = [];
      let activePokemonResultIndex = -1;
      let selectedPokemon = null;
      let pokemonListRequest = null;
      const pokemonDetailsRequests = new Map();
      const pokemonDetailsMemoryCache = new Map();
      const spriteMemoryCache = new Map();
      let latestPokemonLookupId = 0;

      const showdownToInputKey = {
        HP: "hp",
        Atk: "attack",
        Def: "defense",
        SpA: "specialAttack",
        SpD: "specialDefense",
        Spe: "speed",
      };

      const inputToShowdownStat = {
        hp: "HP",
        attack: "Atk",
        defense: "Def",
        specialAttack: "SpA",
        specialDefense: "SpD",
        speed: "Spe",
      };

      const pokemonApiStatToInputKey = {
        hp: "hp",
        attack: "attack",
        defense: "defense",
        "special-attack": "specialAttack",
        "special-defense": "specialDefense",
        speed: "speed",
      };

      const neutralNatureNames = new Set(["hardy", "docile", "serious", "bashful", "quirky"]);
      const lineFeed = String.fromCharCode(10);
      const carriageReturn = String.fromCharCode(13);

      function readPoints(key) {
        const input = document.getElementById(key);
        const parsed = sanitizeUnsignedIntegerInput(input.value || "0");
        return Number.isNaN(parsed) ? 0 : parsed;
      }

      function escapeHtmlForHtml(value) {
        return String(value)
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#39;");
      }

      function sanitizeUnsignedIntegerInput(value) {
        if (typeof value === "number") {
          if (!Number.isFinite(value)) {
            return Number.NaN;
          }

          return Math.trunc(value);
        }

        const text = String(value ?? "").trim();
        if (!text) {
          return Number.NaN;
        }

        for (const char of text) {
          if (char < "0" || char > "9") {
            return Number.NaN;
          }
        }

        return Number.parseInt(text, 10);
      }

      function sanitizeShowdownText(value) {
        const source = String(value ?? "").normalize("NFKC");
        let normalized = "";
        for (let index = 0; index < source.length; index += 1) {
          const char = source[index];
          const code = char.charCodeAt(0);
          if (code === 13) {
            normalized += lineFeed;
            if (source.charCodeAt(index + 1) === 10) {
              index += 1;
            }
            continue;
          }

          normalized += char;
        }

        let cleaned = "";
        for (const char of normalized) {
          const code = char.charCodeAt(0);
          const isBlockedControl = (code >= 0x00 && code <= 0x08) ||
            code === 0x0b ||
            code === 0x0c ||
            (code >= 0x0e && code <= 0x1f) ||
            code === 0x7f;
          if (!isBlockedControl) {
            cleaned += char;
          }
        }

        return cleaned.trim().slice(0, maxShowdownTextLength);
      }

      function clampEvValue(value) {
        const parsed = sanitizeUnsignedIntegerInput(value);
        if (Number.isNaN(parsed)) {
          return ${MIN_EV};
        }

        return Math.max(${MIN_EV}, Math.min(${MAX_EV}, parsed));
      }

      function clampPointsValue(value) {
        const parsed = sanitizeUnsignedIntegerInput(value);
        if (Number.isNaN(parsed)) {
          return 0;
        }

        return Math.max(0, Math.min(maxStatPoints, parsed));
      }

      function pointsFromLegacyEv(value) {
        const ev = clampEvValue(value);
        return Math.min(maxStatPoints, Math.floor((ev + 4) / 8));
      }

      function legacyEvFromPoints(value) {
        return pointToEv[clampPointsValue(value)] ?? ${MIN_EV};
      }

      function readAllPoints() {
        return {
          hp: readPoints("hp"),
          attack: readPoints("attack"),
          defense: readPoints("defense"),
          specialAttack: readPoints("specialAttack"),
          specialDefense: readPoints("specialDefense"),
          speed: readPoints("speed"),
        };
      }

      function totalPoints(values) {
        return Object.values(values).reduce((sum, value) => sum + value, 0);
      }

      function totalLegacyEquivalentEvs(points) {
        return Object.values(points).reduce((sum, value) => sum + legacyEvFromPoints(value), 0);
      }

      function parseShowdownEvs(text) {
        const line = text
          .split(lineFeed)
          .map((candidate) => candidate.trim())
          .find((candidate) => candidate.toLowerCase().startsWith("evs:"));

        if (!line) {
          return null;
        }

        const values = {
          hp: 0,
          attack: 0,
          defense: 0,
          specialAttack: 0,
          specialDefense: 0,
          speed: 0,
        };

        let parsedSegments = 0;

        const payload = line.slice(4).trim();
        for (const segment of payload.split("/")) {
          const parts = segment.trim().split(" ").filter(Boolean);
          if (parts.length !== 2) {
            continue;
          }

          const value = sanitizeUnsignedIntegerInput(parts[0]);
          const statToken = parts[1];
          const key = showdownToInputKey[statToken];
          if (!key || Number.isNaN(value)) {
            continue;
          }

          values[key] = Math.max(${MIN_EV}, Math.min(${MAX_EV}, value));
          parsedSegments += 1;
        }

        return parsedSegments > 0 ? values : null;
      }

      function convertLegacyEvsToPoints(values) {
        return Object.fromEntries(
          statKeys.map((key) => [key, pointsFromLegacyEv(values[key])]),
        );
      }

      function buildTrainingLine(prefix, values, valueForKey) {
        const parts = statKeys
          .filter((key) => values[key] > 0)
          .map((key) => String(valueForKey(key)) + " " + inputToShowdownStat[key]);

        return prefix + ": " + (parts.length > 0 ? parts.join(" / ") : "0 HP");
      }

      function buildChampionsExportLine(points) {
        return buildTrainingLine("SPs", points, (key) => clampPointsValue(points[key]));
      }

      function buildLegacyExportLine(points) {
        return buildTrainingLine("EVs", points, (key) => legacyEvFromPoints(points[key]));
      }

      function rewriteOrAppendTrainingLine(text, line) {
        const trimmed = text.trim();
        if (!trimmed) {
          return line;
        }

        const lines = trimmed.split(lineFeed);
        const trainingLineIndex = lines.findIndex((entry) => {
          const normalized = entry.trim().toLowerCase();
          return normalized.startsWith("evs:") || normalized.startsWith("sps:");
        });
        if (trainingLineIndex >= 0) {
          lines[trainingLineIndex] = line;
          return lines.join(lineFeed);
        }

        return trimmed + lineFeed + line;
      }

      function buildStarterShowdownSet(line) {
        const pokemonName = selectedPokemon?.displayName?.trim()
          || humanizePokemonName(selectedPokemon?.apiName ?? "").trim();

        if (!pokemonName) {
          return line;
        }

        const natureName = getNatureProfile()?.name ?? "Hardy";
        return [
          pokemonName,
          natureName + " Nature",
          line,
        ].join(lineFeed);
      }

      function getShowdownTitle(text) {
        const firstLine = text
          .split(lineFeed)
          .map((line) => line.trim())
          .find(Boolean);

        return firstLine || "Imported Showdown set";
      }

      function parseShowdownLead(text) {
        const firstLine = text
          .split(lineFeed)
          .map((line) => line.trim())
          .find(Boolean);

        if (!firstLine) {
          return {
            displayName: "",
            speciesName: "",
            title: "Imported Showdown set",
          };
        }

        const base = firstLine.split("@")[0]?.trim() ?? "";
        const openParenIndex = base.lastIndexOf("(");
        const hasWrappedSpecies = openParenIndex > 0 && base.endsWith(")");
        if (hasWrappedSpecies) {
          const nickname = base.slice(0, openParenIndex).trim();
          const speciesName = base.slice(openParenIndex + 1, -1).trim();

          return {
            displayName: nickname || speciesName,
            speciesName,
            title: firstLine,
          };
        }

        return {
          displayName: base,
          speciesName: base,
          title: firstLine,
        };
      }

      function setShowdownImportStatus(message, isWarning = false, title = "") {
        if (!(showdownImportStatus instanceof HTMLElement)) {
          return;
        }

        if (showdownImportLabel instanceof HTMLElement) {
          showdownImportLabel.textContent = message;
        }
        showdownImportStatus.classList.toggle("warning", isWarning);
        showdownImportStatus.title = title;
      }

      function setShowdownImportFeedback(message, isWarning = false) {
        if (!(showdownImportFeedback instanceof HTMLElement)) {
          return;
        }

        showdownImportFeedback.textContent = message;
        showdownImportFeedback.classList.toggle("warning", isWarning);
      }

      function syncShowdownImportInput() {
        if (!(showdownImportInput instanceof HTMLTextAreaElement)) {
          return;
        }

        showdownImportInput.value = sanitizeShowdownText(importedShowdownText);
      }

      function parseWholeShowdownSet(text) {
        const trimmed = sanitizeShowdownText(text);
        if (!trimmed) {
          return null;
        }

        const nonEmptyLines = trimmed
          .split(lineFeed)
          .map((line) => line.trim())
          .filter(Boolean);

        if (nonEmptyLines.length < 2) {
          return null;
        }

        const evs = parseShowdownEvs(trimmed);
        if (!evs) {
          return null;
        }

        const points = convertLegacyEvsToPoints(evs);
        return {
          evs,
          natureName: parseShowdownNature(trimmed),
          points,
          text: trimmed,
          ...parseShowdownLead(trimmed),
          total: totalPoints(points),
        };
      }

      function parseShowdownNature(text) {
        const line = text
          .split(lineFeed)
          .map((candidate) => candidate.trim())
          .find((candidate) => candidate.toLowerCase().endsWith(" nature"));
        if (!line) {
          return "";
        }

        const normalized = line.slice(0, -7).trim().toLowerCase();
        if (neutralNatureNames.has(normalized)) {
          return "Hardy";
        }

        const profile = natureProfiles.find((candidate) => candidate.name.toLowerCase() === normalized);
        return profile?.name ?? "";
      }

      function normalizePokemonApiName(name) {
        if (!name) {
          return "";
        }

        const normalized = name
          .trim()
          .toLowerCase()
          .normalize("NFD")
          .replaceAll("♀", "-f")
          .replaceAll("♂", "-m")
          .replaceAll("'", "")
          .replaceAll("’", "")
          .replaceAll(":", "")
          .replaceAll(".", "");

        let withoutMarks = "";
        for (const char of normalized) {
          const code = char.charCodeAt(0);
          if (code < 0x0300 || code > 0x036f) {
            withoutMarks += char;
          }
        }

        let compacted = "";
        let previousWasDash = false;
        for (const char of withoutMarks) {
          const code = char.charCodeAt(0);
          const isWhitespace = code === 9 || code === 10 || code === 12 || code === 13 || code === 32;
          const nextChar = isWhitespace ? "-" : char;
          if (nextChar === "-") {
            if (!previousWasDash) {
              compacted += "-";
            }
            previousWasDash = true;
          } else {
            compacted += nextChar;
            previousWasDash = false;
          }
        }

        let start = 0;
        let end = compacted.length;
        while (start < end && compacted[start] === "-") {
          start += 1;
        }
        while (end > start && compacted[end - 1] === "-") {
          end -= 1;
        }

        return compacted.slice(start, end);
      }

      function normalizePokemonSearchText(value) {
        const normalized = String(value ?? "")
          .toLowerCase()
          .normalize("NFD")
          .replaceAll("♀", " female ")
          .replaceAll("♂", " male ")
          .replaceAll("'", "")
          .replaceAll("’", "")
          .replaceAll(":", "")
          .replaceAll(".", "");

        let withoutMarks = "";
        for (const char of normalized) {
          const code = char.charCodeAt(0);
          if (code < 0x0300 || code > 0x036f) {
            withoutMarks += char;
          }
        }

        let cleaned = "";
        let previousWasSpace = false;
        for (const char of withoutMarks) {
          const isAlphaNumeric = (char >= "a" && char <= "z") || (char >= "0" && char <= "9");
          if (isAlphaNumeric) {
            cleaned += char;
            previousWasSpace = false;
            continue;
          }

          if (!previousWasSpace) {
            cleaned += " ";
            previousWasSpace = true;
          }
        }

        return cleaned.trim();
      }

      function getStorageItem(key) {
        if (!key || !("localStorage" in window)) {
          return "";
        }

        try {
          const value = window.localStorage.getItem(key);
          return typeof value === "string" ? value : "";
        } catch {
          return "";
        }
      }

      function setStorageItem(key, value) {
        if (!key || !("localStorage" in window)) {
          return;
        }

        try {
          window.localStorage.setItem(key, value);
        } catch {
          // Ignore quota or privacy-mode failures.
        }
      }

      function readJsonStorage(key) {
        const raw = getStorageItem(key);
        if (!raw) {
          return null;
        }

        try {
          return JSON.parse(raw);
        } catch {
          return null;
        }
      }

      function writeJsonStorage(key, value) {
        setStorageItem(key, JSON.stringify(value));
      }

      function readCacheEnvelope(key) {
        const raw = readJsonStorage(key);
        if (
          raw &&
          typeof raw === "object" &&
          "value" in raw &&
          typeof raw.updatedAt === "number"
        ) {
          return raw;
        }

        if (raw === null) {
          return null;
        }

        return {
          updatedAt: 0,
          value: raw,
        };
      }

      function writeCacheEnvelope(key, value) {
        writeJsonStorage(key, {
          updatedAt: Date.now(),
          value,
        });
      }

      function isFreshCache(updatedAt, ttlMs) {
        return typeof updatedAt === "number" && updatedAt > 0 && Date.now() - updatedAt <= ttlMs;
      }

      function humanizePokemonName(apiName) {
        const normalized = normalizePokemonApiName(apiName);
        if (!normalized) {
          return "";
        }

        const directLabels = {
          "mr-mime": "Mr. Mime",
          "mr-rime": "Mr. Rime",
          "mime-jr": "Mime Jr.",
          "farfetchd": "Farfetch'd",
          "sirfetchd": "Sirfetch'd",
          "type-null": "Type: Null",
          "jangmo-o": "Jangmo-o",
          "hakamo-o": "Hakamo-o",
          "kommo-o": "Kommo-o",
          "ho-oh": "Ho-Oh",
          "porygon-z": "Porygon-Z",
          "wo-chien": "Wo-Chien",
          "chien-pao": "Chien-Pao",
          "ting-lu": "Ting-Lu",
          "chi-yu": "Chi-Yu",
        };

        if (directLabels[normalized]) {
          return directLabels[normalized];
        }

        if (!normalized.includes("-")) {
          return normalized.charAt(0).toUpperCase() + normalized.slice(1);
        }

        const tokenLabels = {
          alola: "Alola",
          attack: "Attack",
          autumn: "Autumn",
          black: "Black",
          blue: "Blue",
          complete: "Complete",
          cornerstone: "Cornerstone",
          defense: "Defense",
          dusk: "Dusk",
          embodied: "Embodied",
          eternal: "Eternal",
          fan: "Fan",
          female: "Female",
          fire: "Fire",
          frost: "Frost",
          full: "Full",
          galar: "Galar",
          gmax: "Gmax",
          heat: "Heat",
          hearthflame: "Hearthflame",
          hero: "Hero",
          hisui: "Hisui",
          ice: "Ice",
          iceface: "Ice Face",
          incarnate: "Incarnate",
          low: "Low",
          male: "Male",
          mega: "Mega",
          midnight: "Midnight",
          mimikyu: "Mimikyu",
          mow: "Mow",
          neutral: "Neutral",
          ordinary: "Ordinary",
          origin: "Origin",
          paldea: "Paldea",
          pirouette: "Pirouette",
          pompom: "Pom-Pom",
          power: "Power",
          primal: "Primal",
          rapid: "Rapid",
          rider: "Rider",
          school: "School",
          shadow: "Shadow",
          single: "Single",
          sky: "Sky",
          speed: "Speed",
          spring: "Spring",
          stellar: "Stellar",
          strike: "Strike",
          summer: "Summer",
          super: "Super",
          therian: "Therian",
          totem: "Totem",
          ultra: "Ultra",
          wash: "Wash",
          wellspring: "Wellspring",
          white: "White",
          winter: "Winter",
          x: "X",
          y: "Y",
          zen: "Zen",
        };

        return normalized
          .split("-")
          .map((part) => tokenLabels[part] ?? (part ? part.charAt(0).toUpperCase() + part.slice(1) : ""))
          .join(" ");
      }

      function buildPokemonEntry(apiName) {
        const normalizedApiName = normalizePokemonApiName(apiName);
        const displayName = humanizePokemonName(normalizedApiName);

        return {
          apiName: normalizedApiName,
          displayName,
          searchText: normalizePokemonSearchText(displayName + " " + normalizedApiName.replaceAll("-", " ")),
        };
      }

      function isValidBaseStats(value) {
        if (!value || typeof value !== "object") {
          return false;
        }

        return statKeys.every((key) => {
          const stat = value[key];
          return Number.isInteger(stat) && stat >= 1;
        });
      }

      function buildPokemonDetailsFromBody(body) {
        const baseStats = Object.fromEntries(statKeys.map((key) => [key, 0]));
        const stats = Array.isArray(body?.stats) ? body.stats : [];

        for (const entry of stats) {
          const apiStatKey = entry?.stat?.name;
          const key = pokemonApiStatToInputKey[apiStatKey];
          const baseValue = sanitizeUnsignedIntegerInput(entry?.base_stat);
          if (key && !Number.isNaN(baseValue)) {
            baseStats[key] = baseValue;
          }
        }

        const spriteUrl = extractSpriteUrlFromPokemonBody(body);
        return isValidBaseStats(baseStats)
          ? {
              apiName: normalizePokemonApiName(body?.name ?? ""),
              baseStats,
              spriteUrl,
            }
          : null;
      }

      function readCachedPokemonList() {
        const cached = readCacheEnvelope(pokemonListCacheKey);
        const value = Array.isArray(cached?.value)
          ? cached.value
          : Array.isArray(cached)
            ? cached
            : [];

        return {
          entries: value
          .map((name) => buildPokemonEntry(name))
          .filter((entry) => entry.apiName && entry.displayName),
          fresh: isFreshCache(cached?.updatedAt, pokemonListCacheTtlMs),
        };
      }

      function writeCachedPokemonList(entries) {
        if (!Array.isArray(entries) || entries.length === 0) {
          return;
        }

        writeCacheEnvelope(
          pokemonListCacheKey,
          entries.map((entry) => entry.apiName),
        );
      }

      function readCachedPokemonDetails(apiName) {
        const normalized = normalizePokemonApiName(apiName);
        const memoryCached = pokemonDetailsMemoryCache.get(normalized);
        if (memoryCached) {
          return {
            details: memoryCached,
            fresh: true,
          };
        }

        const cached = readCacheEnvelope(pokemonDetailsCachePrefix + normalized);
        const value = cached?.value ?? cached;
        if (!value || normalizePokemonApiName(value.apiName ?? normalized) !== normalized || !isValidBaseStats(value.baseStats)) {
          return {
            details: null,
            fresh: false,
          };
        }

        const details = {
          apiName: normalized,
          baseStats: value.baseStats,
          spriteUrl: typeof value.spriteUrl === "string" ? value.spriteUrl : "",
        };
        pokemonDetailsMemoryCache.set(normalized, details);

        return {
          details,
          fresh: isFreshCache(cached?.updatedAt, pokemonDetailsCacheTtlMs),
        };
      }

      function writeCachedPokemonDetails(apiName, details) {
        if (!apiName || !details || !isValidBaseStats(details.baseStats)) {
          return;
        }

        const normalized = normalizePokemonApiName(apiName);
        const record = {
          apiName: normalized,
          baseStats: details.baseStats,
          spriteUrl: typeof details.spriteUrl === "string" ? details.spriteUrl : "",
        };
        pokemonDetailsMemoryCache.set(normalized, record);

        writeCacheEnvelope(pokemonDetailsCachePrefix + normalized, record);
      }

      function extractSpriteUrlFromPokemonBody(body) {
        return body?.sprites?.front_default ||
          body?.sprites?.versions?.["generation-viii"]?.icons?.front_default ||
          body?.sprites?.other?.showdown?.front_default ||
          "";
      }

      function readCachedSpriteUrl(name) {
        if (!name) {
          return {
            url: "",
            fresh: false,
          };
        }

        const normalized = normalizePokemonApiName(name);
        const memoryCached = spriteMemoryCache.get(normalized);
        if (memoryCached) {
          return {
            url: memoryCached,
            fresh: true,
          };
        }

        const detailRecord = readCachedPokemonDetails(normalized);
        if (detailRecord.details?.spriteUrl) {
          spriteMemoryCache.set(normalized, detailRecord.details.spriteUrl);
          return {
            url: detailRecord.details.spriteUrl,
            fresh: detailRecord.fresh,
          };
        }

        try {
          const cached = readCacheEnvelope(spriteCachePrefix + normalized);
          const value = typeof cached?.value === "string"
            ? cached.value
            : typeof cached === "string"
              ? cached
              : (() => {
                  const legacyValue = getStorageItem(spriteCachePrefix + normalized);
                  return legacyValue.startsWith("https://") || legacyValue.startsWith("http://")
                    ? legacyValue
                    : "";
                })();
          if (value) {
            spriteMemoryCache.set(normalized, value);
          }

          return {
            url: value,
            fresh: isFreshCache(cached?.updatedAt, spriteCacheTtlMs),
          };
        } catch {
          return {
            url: "",
            fresh: false,
          };
        }
      }

      function writeCachedSpriteUrl(name, url) {
        if (!name || !url || !("localStorage" in window)) {
          return;
        }

        const normalized = normalizePokemonApiName(name);
        spriteMemoryCache.set(normalized, url);

        try {
          writeCacheEnvelope(spriteCachePrefix + normalized, url);
        } catch {
          // Ignore quota or privacy-mode failures.
        }
      }

      function queuePokemonListRefresh() {
        if (pokemonListRequest) {
          return pokemonListRequest;
        }

        pokemonListRequest = fetch("https://pokeapi.co/api/v2/pokemon?limit=100000")
          .then(async (response) => {
            if (!response.ok) {
              throw new Error("pokemon list fetch failed");
            }

            const body = await response.json();
            const entries = Array.isArray(body?.results)
              ? body.results
                  .map((result) => buildPokemonEntry(result?.name))
                  .filter((entry) => entry.apiName && entry.displayName)
                  .sort((left, right) => left.displayName.localeCompare(right.displayName))
              : [];

            if (entries.length > 0) {
              pokemonEntries = entries;
              writeCachedPokemonList(entries);
              if (pokemonPicker instanceof HTMLElement && pokemonPicker.dataset.open === "true" && pokemonSearch instanceof HTMLInputElement) {
                renderPokemonResults(pokemonSearch.value);
              }
            }

            return pokemonEntries;
          })
          .catch(() => pokemonEntries)
          .finally(() => {
            pokemonListRequest = null;
          });

        return pokemonListRequest;
      }

      function queuePokemonDetailsRefresh(apiName) {
        const normalized = normalizePokemonApiName(apiName);
        if (!normalized) {
          return Promise.resolve(null);
        }

        const pendingRequest = pokemonDetailsRequests.get(normalized);
        if (pendingRequest) {
          return pendingRequest;
        }

        const request = fetch("https://pokeapi.co/api/v2/pokemon/" + encodeURIComponent(normalized))
          .then(async (response) => {
            if (!response.ok) {
              return null;
            }

            const body = await response.json();
            const details = buildPokemonDetailsFromBody(body);
            if (details) {
              writeCachedPokemonDetails(normalized, details);
              if (details.spriteUrl) {
                writeCachedSpriteUrl(normalized, details.spriteUrl);
              }

              if (selectedPokemon?.apiName === normalized) {
                selectedPokemon = {
                  apiName: normalized,
                  displayName: selectedPokemon.displayName || humanizePokemonName(normalized),
                  baseStats: details.baseStats,
                };
                updateBaseStatDisplays(false);
                updateSelectedPokemonSprite(details.spriteUrl || "");
                compute();
              }
            }

            return details;
          })
          .catch(() => null)
          .finally(() => {
            pokemonDetailsRequests.delete(normalized);
          });

        pokemonDetailsRequests.set(normalized, request);
        return request;
      }

      function maybeWarmSelectedPokemonDetails() {
        const savedPokemonApiName = getStorageItem(selectedPokemonStorageKey);
        if (!savedPokemonApiName) {
          return;
        }

        const cached = readCachedPokemonDetails(savedPokemonApiName);
        if (!cached.details) {
          return;
        }

        selectedPokemon = {
          apiName: cached.details.apiName,
          displayName: humanizePokemonName(cached.details.apiName),
          baseStats: cached.details.baseStats,
        };
        updateBaseStatDisplays(false);
        updateSelectedPokemonSprite(cached.details.spriteUrl || "");
      }

      function hasSeenIntroModal() {
        if (!("localStorage" in window)) {
          return true;
        }

        try {
          return window.localStorage.getItem(introSeenStorageKey) === "true";
        } catch {
          return true;
        }
      }

      function markIntroModalSeen() {
        if (!("localStorage" in window)) {
          return;
        }

        try {
          window.localStorage.setItem(introSeenStorageKey, "true");
        } catch {
          // Ignore storage failures.
        }
      }

      function buildPokemonApiCandidates(name) {
        const normalized = normalizePokemonApiName(name);
        if (!normalized) {
          return [];
        }

        const candidates = new Set([normalized]);
        const aliasMap = {
          "mr-mime": ["mr-mime"],
          "mr-rime": ["mr-rime"],
          "mime-jr": ["mime-jr"],
          "farfetchd": ["farfetchd"],
          "sirfetchd": ["sirfetchd"],
          "type-null": ["type-null"],
          "jangmo-o": ["jangmo-o"],
          "hakamo-o": ["hakamo-o"],
          "kommo-o": ["kommo-o"],
          "ho-oh": ["ho-oh"],
          "porygon-z": ["porygon-z"],
          "wo-chien": ["wo-chien"],
          "chien-pao": ["chien-pao"],
          "ting-lu": ["ting-lu"],
          "chi-yu": ["chi-yu"],
          "great-tusk": ["great-tusk"],
          "brute-bonnet": ["brute-bonnet"],
          "scream-tail": ["scream-tail"],
          "flutter-mane": ["flutter-mane"],
          "slither-wing": ["slither-wing"],
          "sandy-shocks": ["sandy-shocks"],
          "iron-treads": ["iron-treads"],
          "iron-bundle": ["iron-bundle"],
          "iron-hands": ["iron-hands"],
          "iron-jugulis": ["iron-jugulis"],
          "iron-moth": ["iron-moth"],
          "iron-thorns": ["iron-thorns"],
          "iron-valiant": ["iron-valiant"],
          "walking-wake": ["walking-wake"],
          "gouging-fire": ["gouging-fire"],
          "raging-bolt": ["raging-bolt"],
          "iron-boulder": ["iron-boulder"],
          "iron-crown": ["iron-crown"],
          "terapagos-stellar": ["terapagos-stellar"],
          "calyrex-shadow": ["calyrex-shadow-rider"],
          "calyrex-ice": ["calyrex-ice-rider"],
          "urshifu-single-strike": ["urshifu-single-strike"],
          "urshifu-rapid-strike": ["urshifu-rapid-strike"],
          "zygarde-10": ["zygarde-10-power-construct", "zygarde-10"],
          "zygarde-complete": ["zygarde-complete"],
          "necrozma-dawn-wings": ["necrozma-dawn"],
          "necrozma-dusk-mane": ["necrozma-dusk"],
          "landorus-therian": ["landorus-therian"],
          "tornadus-therian": ["tornadus-therian"],
          "thundurus-therian": ["thundurus-therian"],
          "enamorus-therian": ["enamorus-therian"],
          "basculegion-f": ["basculegion-female", "basculegion"],
          "basculegion-m": ["basculegion-male", "basculegion"],
          "indeedee-f": ["indeedee-female", "indeedee"],
          "indeedee-m": ["indeedee-male", "indeedee"],
          "ogerpon-cornerstone": ["ogerpon-cornerstone-mask"],
          "ogerpon-hearthflame": ["ogerpon-hearthflame-mask"],
          "ogerpon-wellspring": ["ogerpon-wellspring-mask"],
        };

        for (const alias of aliasMap[normalized] ?? []) {
          candidates.add(alias);
        }

        if (normalized.endsWith("-totem")) {
          candidates.add(normalized.slice(0, -6));
        }

        if (normalized.startsWith("mimikyu-")) {
          candidates.add("mimikyu-disguised");
        }

        if (normalized.startsWith("eiscue-")) {
          candidates.add("eiscue-ice");
        }

        if (normalized.startsWith("morpeko-")) {
          candidates.add("morpeko-full-belly");
        }

        return Array.from(candidates);
      }

      function getNatureProfile() {
        const selectedName = natureSelect instanceof HTMLSelectElement
          ? natureSelect.value
          : natureProfiles[0]?.name ?? "Hardy";

        return natureProfiles.find((profile) => profile.name === selectedName) ?? natureProfiles[0];
      }

      function getNatureMultiplier(statKey) {
        if (statKey === "hp") {
          return 1;
        }

        const profile = getNatureProfile();
        if (profile.increase === statKey) {
          return 1.1;
        }

        if (profile.decrease === statKey) {
          return 0.9;
        }

        return 1;
      }

      function updateNatureIndicators() {
        const profile = getNatureProfile();

        for (const key of statKeys) {
          const indicator = document.getElementById(key + "-nature-indicator");
          if (!(indicator instanceof HTMLElement)) {
            continue;
          }

          let state = "neutral";
          let symbol = "";

          if (profile.increase === key) {
            state = "up";
            symbol = "↑";
          } else if (profile.decrease === key) {
            state = "down";
            symbol = "↓";
          }

          indicator.dataset.state = state;
          indicator.textContent = symbol;
          indicator.title = state === "up"
            ? profile.name + " boosts this stat"
            : state === "down"
              ? profile.name + " lowers this stat"
              : "";
        }
      }

      function calculateDisplayedStat(statKey, points) {
        if (!selectedPokemon || !isValidBaseStats(selectedPokemon.baseStats)) {
          return null;
        }

        const clampedPoints = clampPointsValue(points);
        const baseStat = selectedPokemon.baseStats[statKey];
        if (!Number.isFinite(baseStat)) {
          return null;
        }

        if (statKey === "hp") {
          return baseStat + clampedPoints + 75;
        }

        return Math.floor(getNatureMultiplier(statKey) * (baseStat + clampedPoints + 20));
      }

      function updateBaseStatDisplays(isLoading = false) {
        for (const key of statKeys) {
          const target = document.getElementById(key + "-base");
          if (!(target instanceof HTMLElement)) {
            continue;
          }

          const value = selectedPokemon?.baseStats?.[key];
          target.textContent = isLoading
            ? "Base ..."
            : Number.isFinite(value)
              ? "Base " + String(value)
              : "Base --";
        }
      }

      function updateSelectedPokemonSprite(spriteUrl = "") {
        if (!(selectedPokemonSpriteShell instanceof HTMLElement) || !(selectedPokemonSprite instanceof HTMLImageElement)) {
          return;
        }

        if (spriteUrl) {
          selectedPokemonSprite.src = spriteUrl;
          selectedPokemonSprite.hidden = false;
          selectedPokemonSpriteShell.dataset.visible = "true";
          return;
        }

        selectedPokemonSprite.removeAttribute("src");
        selectedPokemonSprite.hidden = true;
        selectedPokemonSpriteShell.dataset.visible = "false";
      }

      function setPokemonPickerOpen(isOpen) {
        if (!(pokemonPicker instanceof HTMLElement) || !(pokemonSearch instanceof HTMLInputElement)) {
          return;
        }

        pokemonPicker.dataset.open = isOpen ? "true" : "false";
        pokemonSearch.setAttribute("aria-expanded", isOpen ? "true" : "false");

        if (!isOpen) {
          activePokemonResultIndex = -1;
          pokemonSearch.removeAttribute("aria-activedescendant");
        }
      }

      function renderPokemonMessage(message) {
        if (!(pokemonResults instanceof HTMLElement)) {
          return;
        }

        const emptyState = document.createElement("div");
        emptyState.className = "picker-empty";
        emptyState.textContent = message;
        pokemonResults.replaceChildren(emptyState);
        activePokemonResultIndex = -1;
      }

      function updateActivePokemonResult() {
        if (!(pokemonResults instanceof HTMLElement) || !(pokemonSearch instanceof HTMLInputElement)) {
          return;
        }

        const options = Array.from(pokemonResults.querySelectorAll(".picker-option"));
        for (const [index, option] of options.entries()) {
          if (!(option instanceof HTMLButtonElement)) {
            continue;
          }

          const isActive = index === activePokemonResultIndex;
          option.dataset.active = isActive ? "true" : "false";
          if (isActive) {
            pokemonSearch.setAttribute("aria-activedescendant", option.id);
            option.scrollIntoView({ block: "nearest" });
          }
        }

        if (activePokemonResultIndex < 0 || activePokemonResultIndex >= options.length) {
          pokemonSearch.removeAttribute("aria-activedescendant");
        }
      }

      function scorePokemonMatch(query, entry) {
        if (!query) {
          return 0;
        }

        if (entry.searchText === query) {
          return 1000;
        }

        if (entry.searchText.startsWith(query)) {
          return 900 - Math.max(0, entry.searchText.length - query.length);
        }

        const containsIndex = entry.searchText.indexOf(query);
        if (containsIndex >= 0) {
          return 750 - containsIndex;
        }

        const compactQuery = query.split(" ").join("");
        const compactCandidate = entry.searchText.split(" ").join("");
        let queryIndex = 0;
        let spread = 0;

        for (let candidateIndex = 0; candidateIndex < compactCandidate.length; candidateIndex += 1) {
          if (compactCandidate[candidateIndex] === compactQuery[queryIndex]) {
            spread += candidateIndex;
            queryIndex += 1;
            if (queryIndex >= compactQuery.length) {
              break;
            }
          }
        }

        return queryIndex === compactQuery.length
          ? 500 - spread
          : -1;
      }

      function renderPokemonResults(query = "") {
        if (!(pokemonResults instanceof HTMLElement)) {
          return;
        }

        const normalizedQuery = normalizePokemonSearchText(query);
        const pool = pokemonEntries;
        const matches = normalizedQuery
          ? pool
              .map((entry) => ({
                entry,
                score: scorePokemonMatch(normalizedQuery, entry),
              }))
              .filter((match) => match.score >= 0)
              .sort((left, right) => right.score - left.score || left.entry.displayName.localeCompare(right.entry.displayName))
              .slice(0, 14)
              .map((match) => match.entry)
          : pool.slice(0, 14);

        filteredPokemonEntries = matches;
        pokemonResults.replaceChildren();

        if (matches.length === 0) {
          renderPokemonMessage(normalizedQuery ? "No Pokemon match that search yet." : "Start typing to search Pokemon.");
          return;
        }

        activePokemonResultIndex = -1;

        matches.forEach((entry, index) => {
          const option = document.createElement("button");
          option.type = "button";
          option.className = "picker-option";
          option.id = "pokemon-option-" + String(index);
          option.setAttribute("role", "option");
          option.setAttribute("aria-selected", selectedPokemon?.apiName === entry.apiName ? "true" : "false");
          option.textContent = entry.displayName;
          option.addEventListener("mousedown", (event) => {
            event.preventDefault();
          });
          option.addEventListener("click", () => {
            void selectPokemonByApiName(entry.apiName);
          });
          pokemonResults.appendChild(option);
        });
      }

      async function loadPokemonList() {
        if (pokemonEntries.length > 0) {
          return pokemonEntries;
        }

        const cachedEntries = readCachedPokemonList();
        if (cachedEntries.entries.length > 0) {
          pokemonEntries = cachedEntries.entries.sort((left, right) => left.displayName.localeCompare(right.displayName));
          if (!cachedEntries.fresh) {
            void queuePokemonListRefresh();
          }
          return pokemonEntries;
        }

        return queuePokemonListRefresh();
      }

      async function loadPokemonDetails(apiName) {
        const normalized = normalizePokemonApiName(apiName);
        if (!normalized) {
          return null;
        }

        const cached = readCachedPokemonDetails(normalized);
        if (cached.details) {
          if (!cached.fresh) {
            void queuePokemonDetailsRefresh(normalized);
          }
          return cached.details;
        }

        return queuePokemonDetailsRefresh(normalized);
      }

      async function openPokemonPicker() {
        if (!(pokemonSearch instanceof HTMLInputElement)) {
          return;
        }

        setPokemonPickerOpen(true);
        if (pokemonEntries.length === 0) {
          renderPokemonMessage("Loading Pokemon...");
          const entries = await loadPokemonList();
          if (entries.length === 0) {
            renderPokemonMessage("Pokemon list unavailable right now.");
            return;
          }
        }

        renderPokemonResults(pokemonSearch.value);
      }

      function findPokemonEntryByName(name) {
        const candidates = buildPokemonApiCandidates(name);
        if (candidates.length === 0 || pokemonEntries.length === 0) {
          return null;
        }

        for (const candidate of candidates) {
          const entry = pokemonEntries.find((item) => item.apiName === candidate);
          if (entry) {
            return entry;
          }
        }

        const normalizedSearch = normalizePokemonSearchText(name);
        return pokemonEntries.find((entry) => entry.searchText === normalizedSearch) ?? null;
      }

      async function selectPokemonByApiName(apiName, options = {}) {
        const normalized = normalizePokemonApiName(apiName);
        if (!normalized) {
          return false;
        }

        if (pokemonEntries.length === 0) {
          await loadPokemonList();
        }

        const entry = pokemonEntries.find((candidate) => candidate.apiName === normalized) ?? buildPokemonEntry(normalized);
        if (!(pokemonSearch instanceof HTMLInputElement)) {
          return false;
        }

        pokemonSearch.value = entry.displayName;
        setPokemonPickerOpen(false);
        selectedPokemon = {
          apiName: entry.apiName,
          displayName: entry.displayName,
          baseStats: null,
        };
        updateBaseStatDisplays(true);
        updateSelectedPokemonSprite("");
        compute();

        const lookupId = ++latestPokemonLookupId;
        let details = null;
        try {
          details = await loadPokemonDetails(normalized);
        } catch {
          details = null;
        }

        if (lookupId !== latestPokemonLookupId) {
          return false;
        }

        if (!details || !isValidBaseStats(details.baseStats)) {
          selectedPokemon = null;
          updateBaseStatDisplays(false);
          updateSelectedPokemonSprite("");
          compute();
          return false;
        }

        selectedPokemon = {
          apiName: entry.apiName,
          displayName: entry.displayName,
          baseStats: details.baseStats,
        };
        updateBaseStatDisplays(false);
        updateSelectedPokemonSprite(details.spriteUrl || "");
        compute();

        if (options.persist !== false) {
          setStorageItem(selectedPokemonStorageKey, entry.apiName);
        }

        return true;
      }

      async function selectPokemonFromSpecies(speciesName, options = {}) {
        if (!speciesName) {
          return false;
        }

        if (pokemonEntries.length === 0) {
          await loadPokemonList();
        }

        const match = findPokemonEntryByName(speciesName);
        if (!match) {
          return false;
        }

        return selectPokemonByApiName(match.apiName, options);
      }

      function previewShowdownImport(text) {
        const parsed = parseWholeShowdownSet(text);
        if (!parsed) {
          return false;
        }

        pendingShowdownText = parsed.text;

        if (showdownConfirmCopy instanceof HTMLElement) {
          showdownConfirmCopy.textContent = parsed.total > maxTotal
            ? "This set parses correctly, but its Champions spread is over the 66-point cap."
            : "This will replace the current stat values with the spread from the pasted set.";
        }

        if (showdownConfirmPreview instanceof HTMLTextAreaElement) {
          showdownConfirmPreview.value = parsed.text;
        }

        return true;
      }

      function commitPendingShowdownImport() {
        const parsed = parseWholeShowdownSet(pendingShowdownText);
        if (!parsed) {
          return;
        }

        importedShowdownText = parsed.text;
        applyPoints(parsed.points);
        if (natureSelect instanceof HTMLSelectElement && parsed.natureName) {
          natureSelect.value = parsed.natureName;
          setStorageItem(selectedNatureStorageKey, parsed.natureName);
        }
        setShowdownImportStatus(
          parsed.displayName || parsed.speciesName || parsed.title,
          parsed.total > maxTotal,
          parsed.title,
        );
        if (parsed.speciesName) {
          void selectPokemonFromSpecies(parsed.speciesName);
        }
        compute();
      }

      function clearImportedShowdownSet() {
        importedShowdownText = "";
        pendingShowdownText = "";
        syncShowdownImportInput();

        if (showdownConfirmPreview instanceof HTMLTextAreaElement) {
          showdownConfirmPreview.value = "";
        }

        setShowdownImportStatus("No Showdown set imported");
        setShowdownImportFeedback("Paste a full Showdown set with an EVs line to preview it.");
      }

      function isEditableTarget(target) {
        return target instanceof HTMLElement && (
          target.isContentEditable ||
          target.closest("input, textarea, select, [contenteditable='true']")
        );
      }

      function applyPoints(values) {
        for (const [key, value] of Object.entries(values)) {
          const input = document.getElementById(key);
          const points = clampPointsValue(value);
          input.value = String(points);

          const preciseInput = document.querySelector('[data-ev-edit="' + key + '"]');
          if (preciseInput instanceof HTMLInputElement) {
            preciseInput.value = String(legacyEvFromPoints(points));
          }
        }
      }

      function resetAllPoints() {
        applyPoints(Object.fromEntries(statKeys.map((key) => [key, 0])));
        compute();
      }

      function applyUserEditedPoints(values, preferredKey) {
        const nextValues = { ...values };

        if (preferredKey && preferredKey in nextValues) {
          const otherTotal = statKeys.reduce((sum, key) => {
            if (key === preferredKey) {
              return sum;
            }

            return sum + clampPointsValue(nextValues[key]);
          }, 0);
          const remaining = Math.max(0, maxTotal - otherTotal);
          nextValues[preferredKey] = Math.min(clampPointsValue(nextValues[preferredKey]), remaining);
        }

        applyPoints(nextValues);
      }

      function setDirectPointsValue(key, value) {
        const nextValues = readAllPoints();
        nextValues[key] = clampPointsValue(value);
        applyUserEditedPoints(nextValues, key);
        compute();
      }

      function setEvEditorOpen(editor, isOpen) {
        editor.dataset.editing = isOpen ? "true" : "false";
      }

      function commitEvEditor(editor) {
        const key = editor.dataset.evEditor;
        const preciseInput = editor.querySelector("[data-ev-edit]");
        if (!key || !(preciseInput instanceof HTMLInputElement)) {
          return;
        }

        const nextValues = readAllPoints();
        nextValues[key] = pointsFromLegacyEv(preciseInput.value);
        applyUserEditedPoints(nextValues, key);
        compute();
        setEvEditorOpen(editor, false);
      }

      function cancelEvEditor(editor) {
        const key = editor.dataset.evEditor;
        const preciseInput = editor.querySelector("[data-ev-edit]");
        if (!key || !(preciseInput instanceof HTMLInputElement)) {
          return;
        }

        preciseInput.value = String(legacyEvFromPoints(readPoints(key)));
        setEvEditorOpen(editor, false);
      }

      function useEvModal() {
        return compactActionUi.matches;
      }

      function openEvModal(editor) {
        const key = editor.dataset.evEditor;
        const label = editor.dataset.evLabel;
        if (!key || !label || !(evModalInput instanceof HTMLInputElement) || !(evModalTitle instanceof HTMLElement)) {
          return;
        }

        activeEvEditor = editor;
        evModalTitle.textContent = "Set " + label + " EVs";
        evModalInput.value = String(legacyEvFromPoints(readPoints(key)));
        openModal(evModal);

        window.requestAnimationFrame(() => {
          evModalInput.focus();
          evModalInput.select();
        });
      }

      function closeEvModal() {
        closeModal(evModal);
      }

      function commitEvModal() {
        if (!(activeEvEditor instanceof HTMLElement) || !(evModalInput instanceof HTMLInputElement)) {
          return;
        }

        const key = activeEvEditor.dataset.evEditor;
        if (!key) {
          return;
        }

        const nextValues = readAllPoints();
        nextValues[key] = pointsFromLegacyEv(evModalInput.value);
        applyUserEditedPoints(nextValues, key);
        compute();
        closeEvModal();
      }

      function setExportCopyLabel(label) {
        if (!(exportCopyButton instanceof HTMLButtonElement)) {
          return;
        }

        exportCopyButton.textContent = label;
        if (label !== "Copy export") {
          window.setTimeout(() => {
            exportCopyButton.textContent = "Copy export";
          }, 1600);
        }
      }

      async function copyText(text) {
        if (navigator.clipboard?.writeText) {
          try {
            await navigator.clipboard.writeText(text);
            return true;
          } catch {
            // Fall through to legacy copy path.
          }
        }

        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.top = "0";
        textarea.style.left = "0";
        textarea.style.opacity = "0";
        textarea.style.pointerEvents = "none";
        textarea.style.fontSize = "16px";
        document.body.appendChild(textarea);

        const selection = document.getSelection();
        const originalRange = selection && selection.rangeCount > 0
          ? selection.getRangeAt(0)
          : null;

        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);

        let copied = false;

        try {
          copied = document.execCommand("copy");
        } catch {
          copied = false;
        }

        document.body.removeChild(textarea);

        if (originalRange && selection) {
          selection.removeAllRanges();
          selection.addRange(originalRange);
        }

        return copied;
      }

      function setExportMode(nextMode) {
        exportMode = nextMode === "legacy" ? "legacy" : "champions";

        for (const button of exportModeButtons) {
          if (!(button instanceof HTMLButtonElement)) {
            continue;
          }

          const isActive = button.dataset.exportMode === exportMode;
          button.dataset.active = isActive ? "true" : "false";
          button.setAttribute("aria-checked", isActive ? "true" : "false");
        }
      }

      function buildExportText() {
        const points = readAllPoints();
        const line = exportMode === "legacy"
          ? buildLegacyExportLine(points)
          : buildChampionsExportLine(points);

        if (!importedShowdownText.trim()) {
          return buildStarterShowdownSet(line);
        }

        return rewriteOrAppendTrainingLine(importedShowdownText, line);
      }

      function refreshExportModal() {
        if (!(exportOutput instanceof HTMLTextAreaElement)) {
          return;
        }

        exportOutput.value = buildExportText();
      }

      function compute() {
        const points = readAllPoints();
        const total = totalPoints(points);
        const totalInputEvs = totalLegacyEquivalentEvs(points);

        updateNatureIndicators();

        for (const key of statKeys) {
          const pointValue = points[key];
          const legacyEvValue = legacyEvFromPoints(pointValue);
          const displayedStat = calculateDisplayedStat(key, pointValue);

          const input = document.getElementById(key);
          const output = document.getElementById(key + "-result");
          const valueOutput = document.getElementById(key + "-value");
          if (input instanceof HTMLInputElement) {
            input.style.setProperty("--ratio", String(pointValue / maxStatPoints));
          }
          if (valueOutput instanceof HTMLElement) {
            valueOutput.textContent = String(legacyEvValue);
          }
          if (output instanceof HTMLElement) {
            output.textContent = displayedStat === null ? "--" : String(displayedStat);
          }
        }

        const remaining = maxTotal - total;
        const cappedProgress = Math.max(0, Math.min(total / maxTotal, 1));
        const overCap = total > maxTotal;

        totalValue.textContent = String(total);
        summaryHint.textContent = overCap
          ? String(Math.abs(remaining)) + " over the limit"
          : String(remaining) + " points remaining";
        summaryHint.classList.toggle("warning", overCap);
        progressBar.style.width = String(cappedProgress * 100) + "%";
        progressBar.style.filter = overCap ? "saturate(0.95) hue-rotate(-38deg)" : "none";
        evTotal.textContent = String(totalInputEvs) + " / " + ${MAX_TOTAL_EVS} + " EVs";
        evHint.textContent = String(${MAX_TOTAL_EVS} - totalInputEvs) + " EVs left";

        if (exportModal.hasAttribute("open")) {
          refreshExportModal();
        }

        /*
          Reserved for the future Export to Champions flow.

          const shareText = shareMessage + "\\n" +
            "Spread: " + statKeys.map((key) => key + "=" + readPoints(key)).join(", ") + "\\n" +
            "Total EVs: " + totalInputEvs + " / " + ${MAX_TOTAL_EVS} + "\\n" +
            "Result: " + total + " / " + maxTotal +
            (downloadUrl ? "\\n" + downloadUrl : "");

          shareLink.onclick = async (event) => {
            event.preventDefault();

            if (navigator.share) {
              try {
                await navigator.share({
                  title: "Champions EV calculator",
                  text: shareText,
                });
                return;
              } catch (error) {
                if (error instanceof DOMException && error.name === "AbortError") {
                  return;
                }
              }
            }

            const copied = await copyText(shareText);
            if (copied) {
              setShareLabel("Copied summary");
              return;
            }

            window.prompt("Copy this summary:", shareText);
            setShareLabel("Copy manually");
          };
        */
      }

      function openModal(modal) {
        const existingTimer = modalCloseTimers.get(modal);
        if (existingTimer) {
          window.clearTimeout(existingTimer);
        }

        if (modal.hasAttribute("open") && modal.dataset.closing !== "true") {
          return;
        }

        modal.dataset.closing = "false";

        if (typeof modal.showModal === "function") {
          try {
            modal.showModal();
          } catch {
            modal.setAttribute("open", "");
          }
        } else {
          modal.setAttribute("open", "");
        }

        window.requestAnimationFrame(() => {
          modal.dataset.visible = "true";
        });
      }

      function finishClosingModal(modal) {
        if (typeof modal.close === "function") {
          modal.close();
        } else {
          modal.removeAttribute("open");
        }

        delete modal.dataset.visible;
        delete modal.dataset.closing;
        modalCloseTimers.delete(modal);

        if (modal === donationModal) {
          const donationMenu = donateChip?.closest("[data-action-menu]");
          if (donationMenu instanceof HTMLElement) {
            setActionMenuOpen(donationMenu, false);

            const donationTrigger = donationMenu.querySelector(".action-trigger");
            if (donationTrigger instanceof HTMLElement) {
              donationTrigger.blur();
            }
          }

          if (donateChip instanceof HTMLElement) {
            donateChip.blur();
          }

          window.requestAnimationFrame(() => {
            const activeElement = document.activeElement;
            if (activeElement instanceof HTMLElement) {
              activeElement.blur();
            }
          });
        }

        if (modal === evModal) {
          activeEvEditor = null;
        }

        if (modal === showdownConfirmModal) {
          pendingShowdownText = "";
        }
      }

      function closeModal(modal) {
        if (!modal.hasAttribute("open") || modal.dataset.closing === "true") {
          return;
        }

        modal.dataset.visible = "false";
        modal.dataset.closing = "true";

        const timer = window.setTimeout(() => {
          finishClosingModal(modal);
        }, 220);

        modalCloseTimers.set(modal, timer);
      }

      function setActionMenuOpen(menu, isOpen) {
        menu.dataset.open = isOpen ? "true" : "false";

        const trigger = menu.querySelector(".action-trigger");
        if (trigger instanceof HTMLButtonElement) {
          trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
        }
      }

      function collapseActionMenu(menu) {
        setActionMenuOpen(menu, false);

        const trigger = menu.querySelector(".action-trigger");
        if (trigger instanceof HTMLElement) {
          trigger.blur();
        }

        const activeElement = document.activeElement;
        if (activeElement instanceof HTMLElement && menu.contains(activeElement)) {
          activeElement.blur();
        }
      }

      function closeActionMenus(exceptMenu = null) {
        for (const menu of actionMenus) {
          if (menu !== exceptMenu) {
            collapseActionMenu(menu);
          }
        }
      }

      function useActionModals() {
        return compactActionUi.matches;
      }

      function openActionModal(kind) {
        if (kind === "creator") {
          openModal(creatorModal);
          return;
        }

        if (kind === "donate") {
          openModal(donateInfoModal);
        }
      }

      form.addEventListener("input", (event) => {
        const target = event.target;
        if (target instanceof HTMLInputElement && statKeys.includes(target.id)) {
          const key = target.id;
          const nextValues = readAllPoints();
          nextValues[key] = clampPointsValue(target.value);
          applyUserEditedPoints(nextValues, key);
        }
        compute();
      });
      if (pokemonSearch instanceof HTMLInputElement) {
        pokemonSearch.addEventListener("focus", () => {
          void openPokemonPicker();
        });

        pokemonSearch.addEventListener("input", () => {
          void openPokemonPicker();
        });

        pokemonSearch.addEventListener("keydown", (event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            if (filteredPokemonEntries.length === 0) {
              return;
            }

            setPokemonPickerOpen(true);
            activePokemonResultIndex = Math.min(activePokemonResultIndex + 1, filteredPokemonEntries.length - 1);
            updateActivePokemonResult();
            return;
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            if (filteredPokemonEntries.length === 0) {
              return;
            }

            setPokemonPickerOpen(true);
            activePokemonResultIndex = Math.max(activePokemonResultIndex - 1, 0);
            updateActivePokemonResult();
            return;
          }

          if (event.key === "Enter" && pokemonPicker instanceof HTMLElement && pokemonPicker.dataset.open === "true") {
            const nextIndex = activePokemonResultIndex >= 0
              ? activePokemonResultIndex
              : filteredPokemonEntries.length > 0
                ? 0
                : -1;

            if (nextIndex >= 0 && nextIndex < filteredPokemonEntries.length) {
              event.preventDefault();
              void selectPokemonByApiName(filteredPokemonEntries[nextIndex].apiName);
            }
            return;
          }

          if (event.key === "Escape") {
            setPokemonPickerOpen(false);
          }
        });
      }
      if (natureSelect instanceof HTMLSelectElement) {
        const savedNature = getStorageItem(selectedNatureStorageKey);
        if (natureProfiles.some((profile) => profile.name === savedNature)) {
          natureSelect.value = savedNature;
        }

        natureSelect.addEventListener("change", () => {
          setStorageItem(selectedNatureStorageKey, natureSelect.value);
          compute();
        });
      }
      for (const editor of evEditors) {
        setEvEditorOpen(editor, false);

        const trigger = editor.querySelector("[data-ev-pill]");
        const preciseInput = editor.querySelector("[data-ev-edit]");
        const key = editor.dataset.evEditor;
        const statLabel = key
          ? document.querySelector('.stat-name[for="' + key + '"]')
          : null;

        if (!(trigger instanceof HTMLButtonElement) || !(preciseInput instanceof HTMLInputElement) || !key) {
          continue;
        }

        trigger.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();

          if (event.ctrlKey || event.metaKey) {
            setDirectPointsValue(key, maxStatPoints);
            return;
          }

          if (useEvModal()) {
            openEvModal(editor);
            return;
          }

          preciseInput.value = String(legacyEvFromPoints(readPoints(key)));
          setEvEditorOpen(editor, true);
          window.requestAnimationFrame(() => {
            preciseInput.focus();
            preciseInput.select();
          });
        });

        preciseInput.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commitEvEditor(editor);
            preciseInput.blur();
            return;
          }

          if (event.key === "Escape") {
            event.preventDefault();
            cancelEvEditor(editor);
            trigger.focus();
          }
        });

        preciseInput.addEventListener("blur", () => {
          if (editor.dataset.editing === "true") {
            commitEvEditor(editor);
          }
        });

        if (statLabel instanceof HTMLLabelElement) {
          statLabel.addEventListener("dblclick", (event) => {
            event.preventDefault();
            event.stopPropagation();
            setDirectPointsValue(key, 0);
          });
        }
      }
      exportButton.addEventListener("click", () => {
        refreshExportModal();
        openModal(exportModal);
      });
      if (showdownImportButton instanceof HTMLButtonElement) {
        showdownImportButton.addEventListener("click", () => {
          syncShowdownImportInput();
          setShowdownImportFeedback("Paste a full Showdown set with an EVs line to preview it.");
          openModal(showdownImportModal);
        });
      }
      if (showdownImportCancelButton instanceof HTMLButtonElement) {
        showdownImportCancelButton.addEventListener("click", () => {
          closeModal(showdownImportModal);
        });
      }
      if (showdownImportPreviewButton instanceof HTMLButtonElement) {
        showdownImportPreviewButton.addEventListener("click", () => {
          const text = showdownImportInput instanceof HTMLTextAreaElement
            ? sanitizeShowdownText(showdownImportInput.value)
            : "";
          if (showdownImportInput instanceof HTMLTextAreaElement) {
            showdownImportInput.value = text;
          }
          if (!previewShowdownImport(text)) {
            setShowdownImportFeedback(
              "Paste a full Showdown set with at least one EVs line before importing.",
              true,
            );
            return;
          }

          closeModal(showdownImportModal);
          window.setTimeout(() => {
            openModal(showdownConfirmModal);
          }, 220);
        });
      }
      if (showdownConfirmCancelButton instanceof HTMLButtonElement) {
        showdownConfirmCancelButton.addEventListener("click", () => {
          pendingShowdownText = "";
          closeModal(showdownConfirmModal);
        });
      }
      if (showdownConfirmImportButton instanceof HTMLButtonElement) {
        showdownConfirmImportButton.addEventListener("click", () => {
          commitPendingShowdownImport();
          closeModal(showdownConfirmModal);
        });
      }
      if (showdownImportInput instanceof HTMLTextAreaElement) {
        showdownImportInput.addEventListener("keydown", (event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
            event.preventDefault();
            showdownImportPreviewButton?.click();
          }
        });
      }
      for (const button of exportModeButtons) {
        if (!(button instanceof HTMLButtonElement)) {
          continue;
        }

        button.addEventListener("click", () => {
          setExportMode(button.dataset.exportMode);
          refreshExportModal();
        });
      }
      if (exportCopyButton instanceof HTMLButtonElement) {
        exportCopyButton.addEventListener("click", async () => {
          if (!(exportOutput instanceof HTMLTextAreaElement)) {
            return;
          }

          const copied = await copyText(exportOutput.value);
          if (copied) {
            setExportCopyLabel("Copied export");
            return;
          }

          window.prompt("Copy this export:", exportOutput.value);
          setExportCopyLabel("Copy manually");
        });
      }
      if (donateChip instanceof HTMLButtonElement) {
        donateChip.addEventListener("click", () => {
          openModal(donationModal);
        });
      }
      if (donateModalChip instanceof HTMLButtonElement) {
        donateModalChip.addEventListener("click", () => {
          closeModal(donateInfoModal);
          window.setTimeout(() => {
            openModal(donationModal);
          }, 220);
        });
      }
      creatorCloseButton.addEventListener("click", () => {
        closeModal(creatorModal);
      });
      donateInfoCloseButton.addEventListener("click", () => {
        closeModal(donateInfoModal);
      });
      resetButton.addEventListener("click", () => {
        openModal(resetModal);
      });
      if (tipsButton instanceof HTMLButtonElement) {
        tipsButton.addEventListener("click", () => {
          openModal(tipsModal);
        });
      }
      if (tipsCloseButton instanceof HTMLButtonElement) {
        tipsCloseButton.addEventListener("click", () => {
          closeModal(tipsModal);
        });
      }
      if (introCloseButton instanceof HTMLButtonElement) {
        introCloseButton.addEventListener("click", () => {
          markIntroModalSeen();
          closeModal(introModal);
        });
      }
      donationCloseButton.addEventListener("click", () => {
        closeModal(donationModal);
      });
      evModalCancelButton.addEventListener("click", () => {
        closeEvModal();
      });
      evModalConfirmButton.addEventListener("click", () => {
        commitEvModal();
      });
      evModalInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          commitEvModal();
        }

        if (event.key === "Escape") {
          event.preventDefault();
          closeEvModal();
        }
      });
      exportCloseButton.addEventListener("click", () => {
        closeModal(exportModal);
      });
      resetCancelButton.addEventListener("click", () => {
        closeModal(resetModal);
      });
      resetConfirmButton.addEventListener("click", () => {
        closeModal(resetModal);
        clearImportedShowdownSet();
        form.reset();
      });
      if (totalValue instanceof HTMLElement) {
        totalValue.addEventListener("dblclick", (event) => {
          event.preventDefault();
          event.stopPropagation();
          resetAllPoints();
        });
      }
      for (const modal of [
        resetModal,
        showdownImportModal,
        showdownConfirmModal,
        creatorModal,
        donateInfoModal,
        introModal,
        tipsModal,
        exportModal,
        donationModal,
        evModal,
      ]) {
        modal.addEventListener("click", (event) => {
          if (event.target === modal) {
            closeModal(modal);
          }
        });
        modal.addEventListener("cancel", (event) => {
          event.preventDefault();
          closeModal(modal);
        });
      }
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          if (donateInfoModal.hasAttribute("open")) {
            closeModal(donateInfoModal);
          }

          if (creatorModal.hasAttribute("open")) {
            closeModal(creatorModal);
          }

          if (donationModal.hasAttribute("open")) {
            closeModal(donationModal);
          }

          if (evModal.hasAttribute("open")) {
            closeModal(evModal);
          }

          if (exportModal.hasAttribute("open")) {
            closeModal(exportModal);
          }

          if (tipsModal.hasAttribute("open")) {
            closeModal(tipsModal);
          }

          if (introModal.hasAttribute("open")) {
            markIntroModalSeen();
            closeModal(introModal);
          }

          if (showdownConfirmModal.hasAttribute("open")) {
            pendingShowdownText = "";
            closeModal(showdownConfirmModal);
          }

          if (showdownImportModal.hasAttribute("open")) {
            closeModal(showdownImportModal);
          }

          if (resetModal.hasAttribute("open")) {
            closeModal(resetModal);
          }
        }
      });
      for (const menu of actionMenus) {
        setActionMenuOpen(menu, false);

        const trigger = menu.querySelector(".action-trigger");
        if (!(trigger instanceof HTMLButtonElement)) {
          continue;
        }

        trigger.addEventListener("click", (event) => {
          event.preventDefault();

          if (useActionModals()) {
            closeActionMenus();
            openActionModal(menu.dataset.actionKind);
            return;
          }

          const isOpen = menu.dataset.open === "true";
          closeActionMenus(menu);
          if (isOpen) {
            collapseActionMenu(menu);
            return;
          }

          setActionMenuOpen(menu, true);
        });
      }
      document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element) || !target.closest("[data-action-menu]")) {
          closeActionMenus();
        }

        if (!(target instanceof Element) || !(pokemonPicker instanceof HTMLElement) || !pokemonPicker.contains(target)) {
          setPokemonPickerOpen(false);
        }
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeActionMenus();
        }
      });
      form.addEventListener("reset", () => {
        window.requestAnimationFrame(compute);
      });
      document.addEventListener("paste", (event) => {
        if (!compactActionUi.matches || isEditableTarget(event.target)) {
          return;
        }

        const text = event.clipboardData?.getData("text") || "";
        if (!previewShowdownImport(text)) {
          return;
        }

        event.preventDefault();
        closeModal(showdownImportModal);
        openModal(showdownConfirmModal);
      });

      updateBaseStatDisplays(false);
      maybeWarmSelectedPokemonDetails();
      clearImportedShowdownSet();
      setExportMode(exportMode);
      compute();
      {
        const savedPokemonApiName = getStorageItem(selectedPokemonStorageKey);
        if (savedPokemonApiName) {
          void selectPokemonByApiName(savedPokemonApiName, { persist: false });
        }
      }
      if (!hasSeenIntroModal()) {
        markIntroModalSeen();
        openModal(introModal);
      }
    </script>
  </body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
