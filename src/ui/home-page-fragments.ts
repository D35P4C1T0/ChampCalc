import {
  APP_SHARE_MESSAGE,
  CREATOR_GITHUB_HANDLE,
  CREATOR_GITHUB_URL,
  DONATION_URL,
} from "../config/external-links.js";
import {
  MAX_STAT_CHAMPIONS,
  MAX_EV,
  MAX_TOTAL_CHAMPIONS,
  MAX_TOTAL_EVS,
  MIN_EV,
} from "../domain/ev-master.js";
import { MAX_SHOWDOWN_TEXT_LENGTH } from "../domain/input-sanitize.js";
import {
  HOME_PAGE_EV_STEP,
  HOME_PAGE_NATURE_OPTIONS,
  HOME_PAGE_PAYPAL_ICON,
  HOME_PAGE_PROJECT_GITHUB_URL,
  HOME_PAGE_POINT_TO_CANONICAL_EV,
  HOME_PAGE_STATS,
  renderNatureOptionLabel,
} from "./home-page-config.js";

export function renderHomePageBody(): string {
  const donationLabel = DONATION_URL ? "Open PayPal" : "PAYPAL_URL env not set";

  return `
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
            ${renderTopActions(donationLabel)}
          </div>
          <div class="hero-grid">
            ${renderSummaryCard()}
          </div>
        </header>

        <main class="app">
          ${renderCalculatorSection()}
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

    ${renderDialogs(donationLabel)}
  `;
}

function renderTopActions(donationLabel: string): string {
  return `
    <div class="top-actions">
      ${renderActionMenu({
        body: renderCreatorActionBody(),
        delayMs: 20,
        kind: "creator",
        label: "Creator",
      })}
      ${renderActionMenu({
        alignRight: true,
        body: renderDonateActionBody(donationLabel, {
          chipClassName: "chip primary icon-only",
          chipId: "donate-chip",
        }),
        delayMs: 80,
        kind: "donate",
        label: "Donate",
      })}
    </div>
  `;
}

function renderActionMenu({
  alignRight = false,
  body,
  delayMs,
  kind,
  label,
}: {
  alignRight?: boolean;
  body: string;
  delayMs: number;
  kind: string;
  label: string;
}): string {
  return `
    <article
      class="action-menu${alignRight ? " align-right" : ""} reveal"
      style="--delay:${delayMs}ms"
      data-action-menu
      data-action-kind="${escapeHtml(kind)}"
    >
      <button class="action-trigger" type="button" aria-haspopup="true" aria-expanded="false">
        <span>${escapeHtml(label)}</span>
        <span class="action-caret" aria-hidden="true">▾</span>
      </button>
      <div class="action-panel">
        ${body}
      </div>
    </article>
  `;
}

function renderCreatorActionBody(): string {
  return renderActionRow({
    action: renderProjectLink({
      className: "footer-link icon-only",
      id: null,
    }),
    copy: `
      <a
        class="action-link"
        href="${escapeHtml(CREATOR_GITHUB_URL)}"
        target="_blank"
        rel="noreferrer"
      >
        ${escapeHtml(CREATOR_GITHUB_HANDLE)}
      </a>
    `,
  });
}

function renderDonateActionBody(
  donationLabel: string,
  {
    chipClassName,
    chipId,
  }: {
    chipClassName: string;
    chipId: string;
  },
): string {
  return renderActionRow({
    action: renderDonationChip({
      className: chipClassName,
      id: chipId,
      label: donationLabel,
    }),
    copy: "PayPal",
    muted: !DONATION_URL,
  });
}

function renderActionRow({
  action,
  copy,
  muted = false,
}: {
  action: string;
  copy: string;
  muted?: boolean;
}): string {
  return `
    <div class="action-row">
      <p class="action-copy${muted ? " muted" : ""}">
        ${copy}
      </p>
      ${action}
    </div>
  `;
}

function renderProjectLink({
  className,
  id,
}: {
  className: string;
  id: string | null;
}): string {
  return `
    <a
      class="${escapeHtml(className)}"
      ${id ? `id="${escapeHtml(id)}"` : ""}
      href="${escapeHtml(HOME_PAGE_PROJECT_GITHUB_URL)}"
      target="_blank"
      rel="noreferrer"
      aria-label="View ChampCalc on GitHub"
      title="View ChampCalc on GitHub"
    >
      ${renderGitHubIcon()}
    </a>
  `;
}

function renderDonationChip({
  className,
  id,
  label,
}: {
  className: string;
  id: string;
  label: string;
}): string {
  if (DONATION_URL) {
    return `
      <a
        class="${escapeHtml(className)}"
        id="${escapeHtml(id)}"
        href="${escapeHtml(DONATION_URL)}"
        target="_blank"
        rel="noreferrer"
        aria-label="${escapeHtml(label)} with PayPal"
        title="${escapeHtml(label)} with PayPal"
      >
        ${HOME_PAGE_PAYPAL_ICON}
      </a>
    `;
  }

  return `
    <button
      class="${escapeHtml(className.replace(" primary", ""))}"
      id="${escapeHtml(id)}"
      type="button"
      aria-label="${escapeHtml(label)}"
      title="${escapeHtml(label)}"
    >
      ${HOME_PAGE_PAYPAL_ICON}
    </button>
  `;
}

function renderSummaryCard(): string {
  return `
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
  `;
}

function renderCalculatorSection(): string {
  return `
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
              ${HOME_PAGE_NATURE_OPTIONS.map(renderNatureOption).join("")}
            </select>
          </label>
        </div>

        <div class="stat-grid">
          ${renderStatCards()}
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
  `;
}

function renderStatCards(): string {
  return HOME_PAGE_STATS.map(
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
                <strong id="${stat.key}-value">${HOME_PAGE_POINT_TO_CANONICAL_EV[0]}</strong>
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
                step="${HOME_PAGE_EV_STEP}"
                value="${HOME_PAGE_POINT_TO_CANONICAL_EV[0]}"
                aria-label="${escapeHtml(stat.label)} EVs"
              />
            </span>
            <span class="sp-pill" aria-label="${escapeHtml(stat.label)} stat points">
              <strong id="${stat.key}-points">${0}</strong>
              <span>SP</span>
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
  ).join("");
}

function renderDialogs(donationLabel: string): string {
  return `
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
        ${renderCreatorActionBody()}
        <div class="reset-modal-actions">
          <button class="primary-btn" id="creator-close-btn" type="button">Close</button>
        </div>
      </div>
    </dialog>

    <dialog class="reset-modal" id="donate-info-modal" aria-labelledby="donate-info-modal-title">
      <div class="reset-modal-content">
        <h3 id="donate-info-modal-title">Donate</h3>
        ${renderDonateActionBody(donationLabel, {
          chipClassName: "chip primary icon-only",
          chipId: "donate-modal-chip",
        })}
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
            step="${HOME_PAGE_EV_STEP}"
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
  `;
}

function renderNatureOption(nature: (typeof HOME_PAGE_NATURE_OPTIONS)[number]): string {
  return `<option value="${escapeHtml(nature.name)}">${escapeHtml(renderNatureOptionLabel(nature))}</option>`;
}

function renderGitHubIcon(): string {
  return `
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.5 7.5 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"></path>
    </svg>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
