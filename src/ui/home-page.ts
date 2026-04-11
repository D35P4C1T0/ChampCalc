import {
  APP_DOWNLOAD_URL,
  APP_SHARE_MESSAGE,
  CREATOR_GITHUB_HANDLE,
  CREATOR_GITHUB_URL,
} from "../config/external-links.js";
import {
  EV_STAT_KEYS,
  MAX_STAT_CHAMPIONS,
  MAX_EV,
  MAX_TOTAL_CHAMPIONS,
  MAX_TOTAL_EVS,
  MIN_EV,
} from "../domain/ev-master.js";
import { MAX_SHOWDOWN_TEXT_LENGTH } from "../domain/input-sanitize.js";
import {
  HOME_PAGE_DESCRIPTION,
  HOME_PAGE_NATURE_OPTIONS,
  HOME_PAGE_POINT_TO_CANONICAL_EV,
  HOME_PAGE_SITE_NAME,
  HOME_PAGE_TITLE,
} from "./home-page-config.js";
import { renderHomePageBody } from "./home-page-fragments.js";
import { HOME_PAGE_STYLES } from "./home-page-styles.js";

interface RenderHomePageOptions {
  pageUrl?: string;
  scriptNonce: string;
}

export function renderHomePage({
  pageUrl,
  scriptNonce,
}: RenderHomePageOptions): string {
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
      description: HOME_PAGE_DESCRIPTION,
      name: HOME_PAGE_SITE_NAME,
      operatingSystem: "Web",
      url: pageUrl,
    }),
  );

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="description" content="${escapeHtml(HOME_PAGE_DESCRIPTION)}" />
    <meta name="robots" content="index,follow" />
    <meta name="theme-color" content="#08121b" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#08121b" media="(prefers-color-scheme: dark)" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escapeHtml(HOME_PAGE_SITE_NAME)}" />
    <meta property="og:title" content="${escapeHtml(HOME_PAGE_TITLE)}" />
    <meta property="og:description" content="${escapeHtml(HOME_PAGE_DESCRIPTION)}" />
    ${canonicalUrl ? `<meta property="og:url" content="${canonicalUrl}" />` : ""}
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(HOME_PAGE_TITLE)}" />
    <meta name="twitter:description" content="${escapeHtml(HOME_PAGE_DESCRIPTION)}" />
    ${canonicalUrl ? `<link rel="canonical" href="${canonicalUrl}" />` : ""}
    <title>${escapeHtml(HOME_PAGE_TITLE)}</title>
    <script type="application/ld+json" nonce="${escapeHtml(scriptNonce)}">${structuredData}</script>
    <style>
${HOME_PAGE_STYLES}
    </style>
  </head>
  <body>
    ${renderHomePageBody()}

    <script type="module" nonce="${escapeHtml(scriptNonce)}">
      const maxStatPoints = ${JSON.stringify(MAX_STAT_CHAMPIONS)};
      const maxTotal = ${JSON.stringify(MAX_TOTAL_CHAMPIONS)};
      const pointToEv = ${JSON.stringify(HOME_PAGE_POINT_TO_CANONICAL_EV)};
      const natureProfiles = ${JSON.stringify(HOME_PAGE_NATURE_OPTIONS)};
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
          const pointOutput = document.getElementById(key + "-points");
          if (input instanceof HTMLInputElement) {
            input.style.setProperty("--ratio", String(pointValue / maxStatPoints));
          }
          if (valueOutput instanceof HTMLElement) {
            valueOutput.textContent = String(legacyEvValue);
          }
          if (pointOutput instanceof HTMLElement) {
            pointOutput.textContent = String(pointValue);
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
