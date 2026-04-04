import {
  APP_DOWNLOAD_URL,
  APP_SHARE_MESSAGE,
  CREATOR_GITHUB_HANDLE,
  CREATOR_GITHUB_URL,
  DONATION_URL,
} from "../config/external-links.js";
import {
  EV_STAT_KEYS,
  EV_TO_CHAMPION_FACTOR,
  MAX_EV,
  MAX_TOTAL_CHAMPIONS,
  MAX_TOTAL_EVS,
  MIN_EV,
} from "../domain/ev-master.js";

const initialStats = [
  { key: "hp", label: "HP" },
  { key: "attack", label: "Attack" },
  { key: "defense", label: "Defense" },
  { key: "specialAttack", label: "Sp. Atk" },
  { key: "specialDefense", label: "Sp. Def" },
  { key: "speed", label: "Speed" },
] as const;

const EV_STEP = 1;
const PAGE_TITLE = "ChampCalc | Pokemon Champions EV Calculator";
const PAGE_DESCRIPTION =
  "Convert Pokemon Showdown EV spreads into the new 66-point Pokemon Champions format with live sliders and built-in set parsing.";
const SITE_NAME = "ChampCalc";

interface RenderHomePageOptions {
  pageUrl?: string;
  scriptNonce: string;
}

export function renderHomePage({
  pageUrl,
  scriptNonce,
}: RenderHomePageOptions): string {
  const statCards = initialStats
    .map(
      (stat, index) => `
        <label class="stat-card reveal" style="--delay:${index * 60}ms" for="${stat.key}">
          <span class="stat-meta">
            <span class="stat-name">${escapeHtml(stat.label)}</span>
            <span class="stat-value-wrap">
              <span class="ev-pill"><strong id="${stat.key}-value">${MIN_EV}</strong><span>EV</span></span>
              <output id="${stat.key}-result" for="${stat.key}">0</output>
            </span>
          </span>
          <span class="slider-wrap">
            <input
              id="${stat.key}"
              name="${stat.key}"
              type="range"
              min="${MIN_EV}"
              max="${MAX_EV}"
              step="${EV_STEP}"
              value="${MIN_EV}"
            />
            <span class="slider-scale" aria-hidden="true">
              <span>${MIN_EV}</span>
              <span>${MAX_EV}</span>
            </span>
          </span>
        </label>`,
    )
    .join("");

  const donationLabel = DONATION_URL
    ? "Donate"
    : "Donation disabled";
  const donationCopy = DONATION_URL
    ? "Support the project"
    : "Set PAYPAL_URL to enable.";
  const canonicalUrl = pageUrl ? escapeHtml(pageUrl) : null;
  const structuredData = escapeHtml(JSON.stringify({
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
  }));

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
          max(0.75rem, env(safe-area-inset-bottom));
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
      }

      .hero-copy {
        min-width: 0;
      }

      .top-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
      }

      .action-menu {
        position: relative;
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
          transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
          background 220ms cubic-bezier(0.22, 1, 0.36, 1),
          border-color 220ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .action-trigger:focus-visible {
        outline: 2px solid var(--secondary-accent);
        outline-offset: 3px;
      }

      .action-caret {
        color: var(--muted);
        font-size: 0.72rem;
        transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .action-panel {
        display: grid;
        gap: 0.6rem;
        min-width: 14rem;
        padding: 0.8rem;
        border: 1px solid var(--line);
        border-radius: var(--radius-md);
        background: var(--panel-strong);
        box-shadow: 0 18px 48px rgba(0, 0, 0, 0.34);
      }

      .action-panel h3 {
        margin: 0;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--muted);
      }

      .action-copy {
        margin: 0;
        color: var(--text);
        font-size: 1rem;
        font-weight: 600;
        letter-spacing: -0.02em;
      }

      .action-copy.muted {
        color: var(--muted);
        font-size: 0.88rem;
        font-weight: 500;
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
        margin: 0.65rem 0 0;
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
      }

      .summary-card {
        padding: 0.8rem;
      }

      .summary-label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 0.5rem;
        color: var(--muted);
        font-size: 0.76rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .summary-value {
        display: flex;
        align-items: baseline;
        gap: 0.55rem;
      }

      .summary-value strong {
        font-family: var(--font-display);
        font-size: clamp(2.2rem, 12vw, 4.6rem);
        line-height: 0.95;
        letter-spacing: -0.08em;
      }

      .summary-value span {
        color: var(--muted);
        font-size: 1rem;
      }

      .progress {
        position: relative;
        height: 0.85rem;
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
        margin-top: 0.5rem;
        color: var(--muted);
        font-size: 0.8rem;
      }

      .budget-bar {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 0.45rem;
        color: var(--muted);
        font-size: 0.76rem;
      }

      .app {
        position: relative;
        padding: 0 0.8rem 0.8rem;
      }

      .calculator {
        border: 1px solid var(--line);
        border-radius: var(--radius-lg);
        background: var(--panel);
        padding: 0.8rem;
      }

      .section-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 1rem;
        margin-bottom: 0.65rem;
      }

      .section-head h2 {
        margin: 0;
        font-size: 1rem;
      }

      .section-head p {
        margin: 0.22rem 0 0;
        color: var(--muted);
        font-size: 0.82rem;
        line-height: 1.35;
      }

      .stat-grid {
        display: grid;
        gap: 0.65rem;
        margin-top: 0.7rem;
      }

      .showdown-panel {
        display: grid;
        gap: 0.5rem;
        padding: 0.72rem;
        border: 1px solid var(--line);
        border-radius: var(--radius-md);
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent),
          rgba(255, 255, 255, 0.015);
      }

      .showdown-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }

      .showdown-title {
        font-size: 0.95rem;
        font-weight: 700;
      }

      .showdown-status {
        color: var(--muted);
        font-size: 0.76rem;
        text-align: right;
      }

      .showdown-panel textarea {
        width: 100%;
        min-height: 7.25rem;
        resize: vertical;
        padding: 0.72rem 0.8rem;
        border: 1px solid var(--line);
        border-radius: var(--radius-sm);
        outline: none;
        background: rgba(3, 10, 16, 0.7);
        color: var(--text);
        font: 500 0.81rem/1.4 "SFMono-Regular", "Menlo", "Consolas", monospace;
        transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
      }

      .showdown-panel textarea:focus {
        border-color: rgba(103, 240, 194, 0.4);
        box-shadow: 0 0 0 4px rgba(103, 240, 194, 0.08);
        background: rgba(3, 10, 16, 0.9);
      }

      .showdown-panel textarea::placeholder {
        color: rgba(143, 167, 188, 0.52);
      }

      .stat-card {
        display: grid;
        gap: 0.5rem;
        padding: 0.68rem;
        border: 1px solid var(--line);
        border-radius: var(--radius-md);
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent),
          rgba(255, 255, 255, 0.015);
        transition: border-color 180ms ease, transform 180ms ease, background 180ms ease;
      }

      .stat-card:focus-within {
        border-color: var(--line-strong);
        transform: translateY(-1px);
        background:
          linear-gradient(180deg, rgba(103, 240, 194, 0.07), transparent),
          rgba(255, 255, 255, 0.02);
      }

      .stat-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
      }

      .stat-value-wrap {
        display: inline-flex;
        align-items: center;
        gap: 0.65rem;
      }

      .stat-name {
        font-size: 0.94rem;
        font-weight: 700;
      }

      .ev-pill {
        display: inline-flex;
        align-items: baseline;
        gap: 0.35rem;
        padding: 0.34rem 0.56rem;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.04);
        color: var(--muted);
        font-size: 0.74rem;
        font-weight: 700;
      }

      .ev-pill strong {
        color: var(--text);
        font-size: 0.88rem;
        font-variant-numeric: tabular-nums;
      }

      .slider-wrap {
        display: grid;
        gap: 0.35rem;
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
        height: 1.9rem;
        background: transparent;
      }

      .stat-card input[type="range"]::-webkit-slider-runnable-track {
        height: 0.55rem;
        border-radius: 999px;
        background: linear-gradient(90deg, rgba(103, 240, 194, 0.28), rgba(141, 200, 255, 0.26));
      }

      .stat-card input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 1.4rem;
        height: 1.4rem;
        margin-top: -0.42rem;
        border: 0;
        border-radius: 50%;
        background: linear-gradient(135deg, #ffffff, #9af4db);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.22);
      }

      .stat-card input[type="range"]::-moz-range-track {
        height: 0.55rem;
        border: 0;
        border-radius: 999px;
        background: linear-gradient(90deg, rgba(103, 240, 194, 0.28), rgba(141, 200, 255, 0.26));
      }

      .stat-card input[type="range"]::-moz-range-thumb {
        width: 1.4rem;
        height: 1.4rem;
        border: 0;
        border-radius: 50%;
        background: linear-gradient(135deg, #ffffff, #9af4db);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.22);
      }

      .slider-scale {
        display: flex;
        justify-content: space-between;
        color: var(--muted);
        font-size: 0.72rem;
        font-variant-numeric: tabular-nums;
      }

      .stat-card output {
        min-width: 2ch;
        font-family: var(--font-display);
        font-size: 1.55rem;
        letter-spacing: -0.06em;
        font-variant-numeric: tabular-nums;
      }

      .toolbar {
        display: grid;
        gap: 0.6rem;
        margin-top: 0.7rem;
      }

      .button-row {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }

      button,
      .share-link {
        appearance: none;
        border: 0;
        border-radius: 999px;
        min-height: 3rem;
        padding: 0.82rem 0.95rem;
        font: inherit;
        font-weight: 700;
        text-align: center;
        text-decoration: none;
        cursor: pointer;
        transition:
          transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
          opacity 220ms cubic-bezier(0.22, 1, 0.36, 1),
          background 220ms cubic-bezier(0.22, 1, 0.36, 1),
          border-color 220ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      button:hover,
      .share-link:hover {
        transform: translateY(-0.5px);
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

      .share-link[hidden] {
        display: none;
      }

      .chip {
        padding: 0.55rem 0.75rem;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.04);
        color: var(--muted);
        font-size: 0.88rem;
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
          transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
          background 220ms cubic-bezier(0.22, 1, 0.36, 1),
          border-color 220ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .footer-link:hover {
        transform: translateY(-0.5px);
        border-color: var(--line-strong);
      }

      .footer-link.primary {
        border: 0;
        color: #062019;
        background: linear-gradient(135deg, var(--accent), #9af4db);
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
      }

      .reset-modal::backdrop {
        background: rgba(3, 10, 16, 0.72);
        backdrop-filter: blur(8px);
      }

      .reset-modal-content {
        display: grid;
        gap: 0.8rem;
        padding: 1rem;
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

      .reset-modal-actions {
        display: grid;
        gap: 0.6rem;
      }

      @media (hover: hover) and (pointer: fine) {
        .action-menu::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 100%;
          height: 0.6rem;
        }

        .action-panel {
          position: absolute;
          top: calc(100% + 0.35rem);
          left: 0;
          z-index: 6;
          opacity: 0;
          transform: translateY(-6px) scale(0.985);
          pointer-events: none;
          transition:
            opacity 220ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
          transform-origin: top left;
        }

        .action-menu.align-right .action-panel {
          left: auto;
          right: 0;
          transform-origin: top right;
        }

        .action-menu:hover .action-panel,
        .action-menu:focus-within .action-panel {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        .action-menu:hover .action-trigger,
        .action-menu:focus-within .action-trigger {
          transform: translateY(-0.5px);
          border-color: var(--line-strong);
          background: rgba(255, 255, 255, 0.06);
        }

        .action-menu:hover .action-caret,
        .action-menu:focus-within .action-caret {
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
        transform: translateY(10px);
        animation: rise 760ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        animation-delay: var(--delay, 0ms);
      }

      @keyframes rise {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 559px) {
        .page {
          width: 100%;
          padding:
            env(safe-area-inset-top)
            0
            max(0.35rem, env(safe-area-inset-bottom));
        }

        .shell {
          border-left: 0;
          border-right: 0;
          border-bottom: 0;
          border-radius: 0;
          box-shadow: none;
        }

        .hero {
          padding: 0.55rem 0.65rem 0.4rem;
        }

        .hero h1 {
          font-size: clamp(1.85rem, 9vw, 2.5rem);
          line-height: 0.96;
        }

        .hero-grid {
          position: sticky;
          top: max(0.35rem, env(safe-area-inset-top));
          z-index: 4;
          margin-top: 0.45rem;
        }

        .summary-card {
          padding: 0.68rem 0.72rem;
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
          font-size: clamp(1.85rem, 12vw, 2.45rem);
        }

        .summary-value span {
          font-size: 0.86rem;
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
          padding: 0 0.65rem 0.65rem;
        }

        .calculator {
          padding: 0.65rem;
          border-radius: 18px;
        }

        .section-head {
          margin-bottom: 0.55rem;
        }

        .section-head h2 {
          font-size: 0.92rem;
        }

        .section-head p {
          margin-top: 0.16rem;
          font-size: 0.76rem;
        }

        .showdown-panel,
        .stat-card,
        .action-panel {
          border-radius: 14px;
        }

        .showdown-panel {
          gap: 0.42rem;
          padding: 0.62rem;
        }

        .showdown-head {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 0.25rem 0.6rem;
        }

        .showdown-title {
          font-size: 0.84rem;
        }

        .showdown-status {
          font-size: 0.7rem;
        }

        .showdown-panel textarea {
          min-height: 5.4rem;
          resize: none;
          padding: 0.62rem 0.72rem;
          font-size: 0.76rem;
          line-height: 1.34;
        }

        .stat-grid {
          gap: 0.5rem;
          margin-top: 0.6rem;
        }

        .stat-card {
          gap: 0.38rem;
          padding: 0.58rem 0.62rem;
        }

        .stat-meta {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 0.35rem 0.6rem;
        }

        .stat-name {
          font-size: 0.85rem;
        }

        .stat-value-wrap {
          gap: 0.5rem;
        }

        .ev-pill {
          padding: 0.24rem 0.48rem;
          font-size: 0.68rem;
        }

        .ev-pill strong {
          font-size: 0.8rem;
        }

        .stat-card output {
          font-size: 1.24rem;
        }

        .slider-wrap {
          gap: 0.28rem;
        }

        .slider-scale {
          font-size: 0.64rem;
        }

        .stat-card input[type="range"] {
          height: 1.65rem;
        }

        .stat-card input[type="range"]::-webkit-slider-runnable-track,
        .stat-card input[type="range"]::-moz-range-track {
          height: 0.48rem;
        }

        .stat-card input[type="range"]::-webkit-slider-thumb,
        .stat-card input[type="range"]::-moz-range-thumb {
          width: 1.22rem;
          height: 1.22rem;
        }

        .toolbar {
          gap: 0.5rem;
          margin-top: 0.62rem;
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
        }

        .action-trigger {
          width: 100%;
          justify-content: space-between;
          font-size: 0.74rem;
        }

        .action-panel {
          min-width: 0;
          margin-top: 0.45rem;
        }

        .reset-modal-content {
          padding: 0.9rem;
        }
      }

      @media (min-width: 760px) {
        .page {
          width: min(calc(100% - 1.5rem), var(--content-width));
          padding:
            max(0.9rem, env(safe-area-inset-top))
            0
            max(1.2rem, env(safe-area-inset-bottom));
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
        }

        .stat-grid {
          grid-template-columns: 1fr 1fr;
        }

        .toolbar {
          grid-template-columns: 1fr auto;
          align-items: center;
        }

        .button-row {
          width: 100%;
          max-width: 18rem;
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
              <p class="reveal" style="--delay:110ms">
                Convert Showdown EVs into the new ${MAX_TOTAL_CHAMPIONS}-point Champions format
                with live sliders and instant set parsing.
              </p>
            </div>
            <div class="top-actions">
              <article class="action-menu reveal" style="--delay:20ms">
                <button class="action-trigger" type="button" aria-haspopup="true">
                  <span>Creator</span>
                  <span class="action-caret" aria-hidden="true">▾</span>
                </button>
                <div class="action-panel">
                  <h3>Creator</h3>
                  <p class="action-copy">${escapeHtml(CREATOR_GITHUB_HANDLE)}</p>
                  <a
                    class="footer-link"
                    href="${escapeHtml(CREATOR_GITHUB_URL)}"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                </div>
              </article>
              <article class="action-menu align-right reveal" style="--delay:80ms">
                <button class="action-trigger" type="button" aria-haspopup="true">
                  <span>Donate</span>
                  <span class="action-caret" aria-hidden="true">▾</span>
                </button>
                <div class="action-panel">
                  <h3>Donate</h3>
                  <p class="action-copy ${DONATION_URL ? "" : "muted"}"${DONATION_URL ? "" : ` id="donation-copy"`}>
                    ${escapeHtml(donationCopy)}
                  </p>
                  ${
                    DONATION_URL
                      ? `<a class="footer-link primary" href="${escapeHtml(DONATION_URL)}" target="_blank" rel="noreferrer">${escapeHtml(donationLabel)}</a>`
                      : `<span class="chip">Set PAYPAL_URL</span>`
                  }
                </div>
              </article>
            </div>
          </div>
          <div class="hero-grid">
            <section class="summary-card reveal" style="--delay:180ms" aria-labelledby="summary-title">
              <div class="summary-label">
                <span id="summary-title">Total champions</span>
                <span id="summary-status">Within cap</span>
              </div>
              <div class="summary-value">
                <strong id="total-value">0</strong>
                <span>/ ${MAX_TOTAL_CHAMPIONS}</span>
              </div>
              <div class="progress" aria-hidden="true">
                <span id="progress-bar"></span>
              </div>
              <div class="summary-meta">
                <span>Live update</span>
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
                <p>Paste a set or adjust the sliders.</p>
              </div>
            </div>

            <form id="calculator-form" novalidate>
              <label class="showdown-panel" for="showdown-set">
                <span class="showdown-head">
                  <span class="showdown-title">Paste a Showdown set</span>
                  <span class="showdown-status" id="showdown-status">Waiting for EVs line</span>
                </span>
                <textarea
                  id="showdown-set"
                  name="showdownSet"
                  spellcheck="false"
                  placeholder="EVs: 244 HP / 4 Def / 252 SpA / 4 SpD / 4 Spe"
                ></textarea>
              </label>

              <div class="stat-grid">
                ${statCards}
              </div>

              <div class="toolbar">
                <div class="button-row">
                  <button class="ghost-btn" id="reset-btn" type="button">Reset</button>
                </div>
                <a
                  class="share-link"
                  id="share-link"
                  href="#"
                  ${APP_SHARE_MESSAGE ? "" : "hidden"}
                >
                  Share summary
                </a>
              </div>
            </form>
          </section>
        </main>
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

    <script type="module" nonce="${escapeHtml(scriptNonce)}">
      const factor = ${JSON.stringify(EV_TO_CHAMPION_FACTOR)};
      const maxTotal = ${JSON.stringify(MAX_TOTAL_CHAMPIONS)};
      const shareMessage = ${JSON.stringify(APP_SHARE_MESSAGE)};
      const downloadUrl = ${JSON.stringify(APP_DOWNLOAD_URL)};

      const statKeys = ${JSON.stringify(EV_STAT_KEYS)};
      const form = document.querySelector("#calculator-form");
      const totalValue = document.querySelector("#total-value");
      const summaryStatus = document.querySelector("#summary-status");
      const summaryHint = document.querySelector("#summary-hint");
      const progressBar = document.querySelector("#progress-bar");
      const evTotal = document.querySelector("#ev-total");
      const evHint = document.querySelector("#ev-hint");
      const shareLink = document.querySelector("#share-link");
      const resetButton = document.querySelector("#reset-btn");
      const resetModal = document.querySelector("#reset-modal");
      const resetCancelButton = document.querySelector("#reset-cancel-btn");
      const resetConfirmButton = document.querySelector("#reset-confirm-btn");
      const showdownSetInput = document.querySelector("#showdown-set");
      const showdownStatus = document.querySelector("#showdown-status");

      const showdownToInputKey = {
        HP: "hp",
        Atk: "attack",
        Def: "defense",
        SpA: "specialAttack",
        SpD: "specialDefense",
        Spe: "speed",
      };

      function readValue(key) {
        const input = document.getElementById(key);
        const parsed = Number.parseInt(input.value || "0", 10);
        return Number.isNaN(parsed) ? 0 : parsed;
      }

      function readAllValues() {
        return {
          hp: readValue("hp"),
          attack: readValue("attack"),
          defense: readValue("defense"),
          specialAttack: readValue("specialAttack"),
          specialDefense: readValue("specialDefense"),
          speed: readValue("speed"),
        };
      }

      function totalEvs(values) {
        return Object.values(values).reduce((sum, value) => sum + value, 0);
      }

      function toChampions(value) {
        return Math.round(value * factor);
      }

      function convertValues(values) {
        const totalInputEvs = totalEvs(values);
        const targetTotal = Math.min(maxTotal, toChampions(totalInputEvs));
        const converted = Object.fromEntries(statKeys.map((key) => [key, 0]));
        const exactValues = statKeys.map((key, index) => {
          const exact = values[key] * factor;
          const base = Math.floor(exact);

          converted[key] = base;

          return {
            key,
            index,
            base,
            fraction: exact - base,
            raw: values[key],
          };
        });

        const baseTotal = exactValues.reduce((sum, item) => sum + item.base, 0);
        const remainder = Math.max(0, targetTotal - baseTotal);

        exactValues
          .sort((left, right) =>
            right.fraction - left.fraction ||
            right.raw - left.raw ||
            left.index - right.index,
          )
          .slice(0, remainder)
          .forEach((item) => {
            converted[item.key] += 1;
          });

        return {
          converted,
          total: Object.values(converted).reduce((sum, value) => sum + value, 0),
          totalInputEvs,
        };
      }

      function parseShowdownEvs(text) {
        const lineMatch = text.match(/^EVs:\\s*(.+)$/im);
        if (!lineMatch) {
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

        for (const segment of lineMatch[1].split("/")) {
          const match = segment.trim().match(/^(\\d+)\\s+(HP|Atk|Def|SpA|SpD|Spe)$/i);
          if (!match) {
            continue;
          }

          const value = Number.parseInt(match[1], 10);
          const key = showdownToInputKey[match[2]];
          if (!key || Number.isNaN(value)) {
            continue;
          }

          values[key] = Math.max(${MIN_EV}, Math.min(${MAX_EV}, value));
          parsedSegments += 1;
        }

        return parsedSegments > 0 ? values : null;
      }

      function applyValues(values) {
        for (const [key, value] of Object.entries(values)) {
          const input = document.getElementById(key);
          input.value = String(value);
        }
      }

      function clampValuesToBudget(values, preferredKey = null) {
        const nextValues = { ...values };
        let total = totalEvs(nextValues);

        if (total <= ${MAX_TOTAL_EVS}) {
          return nextValues;
        }

        if (preferredKey && preferredKey in nextValues) {
          const overflow = total - ${MAX_TOTAL_EVS};
          nextValues[preferredKey] = Math.max(${MIN_EV}, nextValues[preferredKey] - overflow);
          total = totalEvs(nextValues);
        }

        if (total <= ${MAX_TOTAL_EVS}) {
          return nextValues;
        }

        for (const key of statKeys) {
          if (key === preferredKey) {
            continue;
          }

          const overflow = total - ${MAX_TOTAL_EVS};
          if (overflow <= 0) {
            break;
          }

          const deduction = Math.min(nextValues[key], overflow);
          nextValues[key] -= deduction;
          total -= deduction;
        }

        return nextValues;
      }

      function enforceBudgetFromInput(changedKey) {
        const clamped = clampValuesToBudget(readAllValues(), changedKey);
        applyValues(clamped);
      }

      function setShareLabel(label) {
        shareLink.textContent = label;
        if (label !== "Share summary") {
          window.setTimeout(() => {
            shareLink.textContent = "Share summary";
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

      function compute() {
        const values = readAllValues();
        const {
          converted,
          total,
          totalInputEvs,
        } = convertValues(values);

        for (const key of statKeys) {
          const rawValue = values[key];
          const convertedValue = converted[key];

          const output = document.getElementById(key + "-result");
          const valueOutput = document.getElementById(key + "-value");
          valueOutput.textContent = String(rawValue);
          output.textContent = String(convertedValue);
        }

        const remaining = maxTotal - total;
        const cappedProgress = Math.max(0, Math.min(total / maxTotal, 1));
        const overCap = total > maxTotal;

        totalValue.textContent = String(total);
        summaryStatus.textContent = overCap ? "Over cap" : "Within cap";
        summaryStatus.classList.toggle("warning", overCap);
        summaryHint.textContent = overCap
          ? String(Math.abs(remaining)) + " over the limit"
          : String(remaining) + " points remaining";
        summaryHint.classList.toggle("warning", overCap);
        progressBar.style.width = String(cappedProgress * 100) + "%";
        progressBar.style.filter = overCap ? "saturate(0.95) hue-rotate(-38deg)" : "none";
        evTotal.textContent = String(totalInputEvs) + " / " + ${MAX_TOTAL_EVS} + " EVs";
        evHint.textContent = String(${MAX_TOTAL_EVS} - totalInputEvs) + " EVs left";

        const shareText = shareMessage + "\\n" +
          "Spread: " + statKeys.map((key) => key + "=" + readValue(key)).join(", ") + "\\n" +
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
      }

      function updateFromShowdownText() {
        const text = showdownSetInput.value;
        const parsed = parseShowdownEvs(text);

        if (!text.trim()) {
          showdownStatus.textContent = "Waiting for EVs line";
          showdownStatus.classList.remove("warning");
          return;
        }

        if (!parsed) {
          showdownStatus.textContent = "No EVs line detected yet";
          showdownStatus.classList.add("warning");
          return;
        }

        const clamped = clampValuesToBudget(parsed);
        applyValues(clamped);
        const wasCapped = totalEvs(parsed) > ${MAX_TOTAL_EVS};
        showdownStatus.textContent = wasCapped
          ? "Parsed EVs and capped to ${MAX_TOTAL_EVS}"
          : "Parsed EVs successfully";
        showdownStatus.classList.toggle("warning", wasCapped);
        compute();
      }

      function openResetModal() {
        if (typeof resetModal.showModal === "function") {
          resetModal.showModal();
          return;
        }

        resetModal.setAttribute("open", "");
      }

      function closeResetModal() {
        if (typeof resetModal.close === "function") {
          resetModal.close();
          return;
        }

        resetModal.removeAttribute("open");
      }

      form.addEventListener("input", (event) => {
        const target = event.target;
        if (target instanceof HTMLInputElement && statKeys.includes(target.id)) {
          enforceBudgetFromInput(target.id);
        }
        compute();
      });
      resetButton.addEventListener("click", () => {
        openResetModal();
      });
      resetCancelButton.addEventListener("click", () => {
        closeResetModal();
      });
      resetConfirmButton.addEventListener("click", () => {
        closeResetModal();
        form.reset();
      });
      resetModal.addEventListener("click", (event) => {
        if (event.target === resetModal) {
          closeResetModal();
        }
      });
      form.addEventListener("reset", () => {
        window.requestAnimationFrame(compute);
      });
      showdownSetInput.addEventListener("input", updateFromShowdownText);

      compute();
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
