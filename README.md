# Champions EV Calculator

Mobile-first EV calculator built with strict TypeScript and prepared for direct deployment on Vercel.

It converts legacy EV spreads into the new 66-point format, supports live slider editing, parses pasted Showdown sets in real time, and previews final stats with the selected Pokemon and nature.

## Features

- mobile-first UI tuned for iPhone and Android
- real-time conversion into the 66-point Champions format
- searchable Pokemon selector with cached species data, sprite lookup, and nature-aware live stat previews
- hard EV budget cap of `516`
- independent per-stat EV -> point conversion using `floor((EV + 4) / 8)`
- faithful import behavior that preserves leftover points instead of auto-filling to `66`
- support for importing Showdown sets that use either `EVs:` or `SPs:`
- full Showdown set rewriting with both canonical Champions `SPs:` output and approximate legacy `EVs:` output
- starter export generation when no set was imported, using the selected Pokemon, current nature, and current SP or EV spread
- export modal toggle for canonical Champions SPs or approximate legacy EV text
- mobile import flow with confirmation modal and paste-to-import support for valid full Showdown sets
- sanitized numeric inputs and normalized Showdown text on both client and backend
- generated Swagger / OpenAPI documentation
- public-safe validation errors for documented API routes
- optional PayPal donation button via environment variable
- Fastify app for local development and Vercel backend deployment
- unit tests for conversion, HTTP behavior, and Vercel handlers

## Stack

- Node.js
- pnpm
- TypeScript
- Zod
- Fastify
- Vercel

## Requirements

- Node.js `22+`
- pnpm `10+`

## Getting started

```bash
pnpm install
cp .env.example .env
pnpm dev
```

The app will run on `http://localhost:3000`.

## Environment variables

```bash
PAYPAL_URL=<your-paypal-url>
```

If `PAYPAL_URL` is omitted, the donation button stays disabled.

## Scripts

```bash
pnpm dev
pnpm test
pnpm check
pnpm build
pnpm start
```

## Tips and keybindings

- click an EV pill to type a precise value; on mobile this opens the EV edit modal
- double-click a stat label such as `HP`, `Attack`, or `Defense` to reset only that stat to `0`
- double-click the large total stat-points number to reset the whole spread
- `Ctrl+click` on Windows or Linux, or `Cmd+click` on macOS, sets that stat to the maximum useful EV value
- use `Import Showdown EVs/SPs set` to preview and import a full Showdown set; on mobile, pasting a valid full set outside an input opens the same confirmation flow automatically
- inside the Showdown import modal, `Ctrl+Enter` or `Cmd+Enter` previews the pasted set immediately
- imported Showdown sets keep the full set text for export, including nicknames when present
- if you export without importing a set first, the app generates a starter Showdown-style export with the selected Pokemon, current nature, and current `SPs:` or `EVs:` line
- use the export toggle to switch between canonical Champions `SPs:` and approximate legacy `EVs:` for older tools

## Vercel deployment

This folder is ready to be imported into Vercel as the project root.

What is already configured:

- `index.ts` is the Fastify entrypoint Vercel will boot
- `src/local-server.ts` runs the same Fastify app for local development
- the homepage is rendered server-side so `PAYPAL_URL` can stay an environment variable

In Vercel:

1. Import this folder as the repository root.
2. Set `PAYPAL_URL` if you want the donation button enabled.
3. Deploy.

Application routes:

- `/`
- `/health`
- `/documentation`
- `/documentation/json`
- `/documentation/yaml`
- `/api/convert`
- `/api/parse-showdown`

## API

### `GET /health`

Simple health check.

### `GET /documentation`

Interactive Swagger UI for the backend API.

Raw OpenAPI specs are also available at:

- `/documentation/json`
- `/documentation/yaml`

### `GET /api/convert`

Accepts query params:

- `hp`
- `attack`
- `defense`
- `specialAttack`
- `specialDefense`
- `speed`

Example:

```bash
curl "http://localhost:3000/api/convert?hp=252&attack=252&defense=12&specialAttack=0&specialDefense=0&speed=0"
```

Returns both the original normalized input and the converted Champions result.

Conversion note:

- each stat is converted independently with `floor((EV + 4) / 8)`
- leftover points are preserved rather than auto-spent to reach `66`
- each stat input is sanitized as a whole unsigned integer before validation

### `POST /api/convert`

Accepts JSON:

```json
{
  "hp": 252,
  "attack": 252,
  "defense": 12,
  "specialAttack": 0,
  "specialDefense": 0,
  "speed": 0
}
```

Requests above `516` total EVs are rejected.

Returns both the original normalized input and the converted Champions result.

Conversion note:

- each stat is converted independently with `floor((EV + 4) / 8)`
- leftover points are preserved rather than auto-spent to reach `66`
- each stat input is sanitized as a whole unsigned integer before validation

### `POST /api/parse-showdown`

Accepts a full pasted Showdown set, looks for exactly one training line, and supports either the legacy `EVs:` format or the app's native `SPs:` format.

`EVs:` lines are converted into Champions points. `SPs:` lines are parsed directly, with each stat clamped to `32`. If the pasted set contains both `EVs:` and `SPs:` lines, or if the final SP total still exceeds `66`, the request is rejected as malformed.

```json
{
  "text": "Pikachu @ Light Ball\nAbility: Static\nEVs: 252 Atk / 4 SpD / 252 Spe\nJolly Nature\n- Volt Tackle"
}
```

Response fields:

- `found`: whether an `EVs:` or `SPs:` line was detected
- `format`: which training line format was parsed, or `null` if none was found
- `evs`: the original parsed Showdown EVs when the input used `EVs:`, otherwise `null`
- `result`: the converted Champions stat values, or the parsed SPs directly when the input used `SPs:`
- `championsText`: the full rewritten Showdown set using `SPs: ...`
- `legacyText`: the full rewritten Showdown set using approximate old-style `EVs: ...`

Validation notes:

- only one training line is allowed per set
- mixed `EVs:` and `SPs:` input is rejected
- `SPs:` values above `32` are clamped per stat before total validation
- if the resulting SP total is still above `66`, the set is rejected

Input sanitization:

- line endings are normalized to `\n`
- control characters are stripped
- surrounding whitespace is trimmed
- input is capped at `10,000` characters

## Project structure

```text
src/
  local-server.ts
  fastify-app.ts
  config/
  contracts/
  domain/
  http/
  ui/
  vercel/
test/
  conversion.test.ts
  http.test.ts
  vercel.test.ts
```

## Conversion rule

The app stores Champions points directly and treats them as the canonical format.

When importing legacy EVs:

- each stat converts independently with `floor((EV + 4) / 8)`
- `0 EV -> 0`
- `4 EV -> 1`
- `12 EV -> 2`
- `252 EV -> 32`

This means imported spreads can land below `66` total points, and the app preserves that leftover budget instead of auto-filling it.

When exporting:

- `Champions SP` exports the direct point values as `SPs: ...`
- `Legacy EV` exports minimum old EV breakpoints via `4 + (SP - 1) * 8` as an approximation layer for older tools and Showdown text

Because the real Champions stat formula depends on species and nature, exported `SPs` are the canonical Champions investment format, while legacy `EVs` are still an approximation layer for older tools and Showdown text.

## UI export behavior

When you open the export modal:

- if you imported a full Showdown set, the app rewrites that set and replaces the training line with either `SPs: ...` or approximate `EVs: ...`
- if you did not import a set but selected a Pokemon, the app generates a starter Showdown-style export with the Pokemon name, the current nature, and the current `SPs:` or `EVs:` line
- if no Pokemon is selected, export falls back to the bare training line

## Input sanitization

- numeric EV inputs are sanitized as whole unsigned integers before validation
- partially numeric junk like `12abc` is rejected instead of being partially coerced
- pasted Showdown text is normalized and cleaned on both the frontend and backend

## Notes

- The project does not include the old Dropbox link from the APK.
- The creator profile is configured in `src/config/external-links.ts`.
- `PAYPAL_URL` only accepts `https` URLs on PayPal hosts.
