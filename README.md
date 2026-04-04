# Champions EV Calculator

Mobile-first EV calculator built with strict TypeScript and prepared for direct deployment on Vercel.

It converts legacy EV spreads into the new 66-point format, supports live slider editing, and parses pasted Showdown sets in real time.

## Features

- mobile-first UI tuned for iPhone and Android
- real-time conversion into the 66-point Champions format
- hard EV budget cap of `516`
- deterministic point distribution so `516 EVs` can resolve cleanly to `66`
- live Showdown `EVs:` line parsing
- full Showdown set rewriting with converted Champions EVs
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

### `POST /api/parse-showdown`

Accepts a full pasted Showdown set, parses the `EVs:` line, converts it to Champions values, and returns the full set text with that line rewritten.

```json
{
  "text": "Pikachu @ Light Ball\nAbility: Static\nEVs: 252 Atk / 4 SpD / 252 Spe\nJolly Nature\n- Volt Tackle"
}
```

Response fields:

- `found`: whether an `EVs:` line was detected
- `evs`: the original parsed Showdown EVs
- `result`: the converted Champions stat values
- `championsText`: the full rewritten Showdown set

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

Each stat keeps the same legacy EV input, but the final Champions total is derived from the whole EV pool and then distributed back across stats deterministically. That keeps the stat outputs and the total consistent, including at the `516 EV` ceiling.

## Notes

- The project does not include the old Dropbox link from the APK.
- The creator profile is configured in `src/config/external-links.ts`.
- `PAYPAL_URL` only accepts `https` URLs on PayPal hosts.
