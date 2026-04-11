import assert from "node:assert/strict";
import test from "node:test";

import { buildApp } from "../src/fastify-app.js";

test("Vercel homepage handler returns HTML with a nonce-bearing script tag", async () => {
  const app = buildApp();
  const response = await app.inject({
    headers: {
      host: "champcalc.example",
      "x-forwarded-host": "champcalc.example",
      "x-forwarded-proto": "https",
    },
    method: "GET",
    url: "/",
  });
  await app.close();

  assert.equal(response.statusCode, 200);
  assert.match(
    String(response.headers["content-security-policy"] ?? ""),
    /script-src 'self' 'nonce-/,
  );
  assert.match(response.body, /<script type="module" nonce="[^"]+">/);
  assert.match(response.body, /<meta property="og:url" content="https:\/\/champcalc\.example\/" \/>/);
  assert.match(response.body, /<script type="application\/ld\+json" nonce="[^"]+">/);
});

test("Vercel convert GET handler returns the canonical point buckets", async () => {
  const app = buildApp();
  const response = await app.inject({
    method: "GET",
    url: "/api/convert?hp=195&attack=22&defense=194&specialAttack=28&specialDefense=77&speed=0",
  });
  await app.close();
  const body = JSON.parse(response.body) as {
    result: {
      isOverCap: boolean;
      specialAttack: number;
      total: number;
    };
  };

  assert.equal(response.statusCode, 200);
  assert.equal(body.result.total, 65);
  assert.equal(body.result.isOverCap, false);
  assert.equal(body.result.specialAttack, 4);
});

test("Vercel convert POST handler rejects invalid EV input", async () => {
  const app = buildApp();
  const response = await app.inject({
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    payload: JSON.stringify({
      hp: 300,
    }),
    url: "/api/convert",
  });
  await app.close();
  const body = JSON.parse(response.body) as {
    details: Array<{ field: string; message: string }>;
    error: string;
  };

  assert.equal(response.statusCode, 400);
  assert.deepEqual(body, {
    error: "Invalid request payload",
    details: [
      {
        field: "hp",
        message: "EVs cannot exceed 252",
      },
    ],
  });
});

test("Vercel convert POST handler rejects partially numeric junk input", async () => {
  const app = buildApp();
  const response = await app.inject({
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    payload: JSON.stringify({
      hp: "12junk",
    }),
    url: "/api/convert",
  });
  await app.close();
  const body = JSON.parse(response.body) as {
    details: Array<{ field: string; message: string }>;
    error: string;
  };

  assert.equal(response.statusCode, 400);
  assert.deepEqual(body, {
    error: "Invalid request payload",
    details: [
      {
        field: "hp",
        message: "must be integer",
      },
    ],
  });
});

test("Vercel parse-showdown POST returns both Champions SP and legacy EV rewrites", async () => {
  const app = buildApp();
  const response = await app.inject({
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    payload: JSON.stringify({
      text: [
        "Gengar @ Focus Sash",
        "Ability: Cursed Body",
        "EVs: 4 Def / 252 SpA / 252 Spe",
        "Timid Nature",
        "- Shadow Ball",
      ].join("\n"),
    }),
    url: "/api/parse-showdown",
  });
  await app.close();
  const body = JSON.parse(response.body) as {
    championsText: string | null;
    legacyText: string | null;
    found: boolean;
    result: { defense: number; specialAttack: number; speed: number; total: number } | null;
  };

  assert.equal(response.statusCode, 200);
  assert.equal(body.found, true);
  assert.equal(body.result?.defense, 1);
  assert.equal(body.result?.specialAttack, 32);
  assert.equal(body.result?.speed, 32);
  assert.equal(body.result?.total, 65);
  assert.equal(
    body.championsText,
    [
      "Gengar @ Focus Sash",
      "Ability: Cursed Body",
      "SPs: 1 Def / 32 SpA / 32 Spe",
      "Timid Nature",
      "- Shadow Ball",
    ].join("\n"),
  );
  assert.equal(
    body.legacyText,
    [
      "Gengar @ Focus Sash",
      "Ability: Cursed Body",
      "EVs: 4 Def / 252 SpA / 252 Spe",
      "Timid Nature",
      "- Shadow Ball",
    ].join("\n"),
  );
});
