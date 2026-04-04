import assert from "node:assert/strict";
import test from "node:test";

import { buildApp } from "../src/fastify-app.js";

test("GET / includes hardened headers and a script nonce", async () => {
  const app = buildApp();
  const response = await app.inject({
    method: "GET",
    url: "/",
  });
  await app.close();

  assert.equal(response.statusCode, 200);
  assert.match(
    String(response.headers["content-security-policy"] ?? ""),
    /script-src 'self' 'nonce-/,
  );
  assert.equal(response.headers["x-content-type-options"], "nosniff");
  assert.equal(response.headers["referrer-policy"], "no-referrer");
  assert.equal(response.headers["x-frame-options"], "DENY");
  assert.match(response.body, /<script type="module" nonce="[^"]+">/);
  assert.match(
    response.body,
    /<meta name="description" content="Convert Pokemon Showdown EV spreads into the new 66-point Pokemon Champions format with live sliders and built-in set parsing\." \/>/,
  );
  assert.match(
    response.body,
    /<link rel="canonical" href="http:\/\/localhost\/" \/>/,
  );
});

test("POST /api/convert rejects out-of-range EVs with a public-safe error shape", async () => {
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

  assert.equal(response.statusCode, 400);
  assert.deepEqual(JSON.parse(response.body), {
    error: "Invalid request payload",
    details: [
      {
        field: "hp",
        message: "EVs cannot exceed 252",
      },
    ],
  });
});

test("POST /api/parse-showdown rewrites the full set with Champions EVs", async () => {
  const app = buildApp();
  const response = await app.inject({
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    payload: JSON.stringify({
      text: [
        "Pikachu @ Light Ball",
        "Ability: Static",
        "EVs: 252 Atk / 4 SpD / 252 Spe",
        "Jolly Nature",
        "- Volt Tackle",
      ].join("\n"),
    }),
    url: "/api/parse-showdown",
  });
  await app.close();
  const body = JSON.parse(response.body) as {
    championsText: string | null;
    found: boolean;
    result: { attack: number; specialDefense: number; speed: number; total: number } | null;
  };

  assert.equal(response.statusCode, 200);
  assert.equal(body.found, true);
  assert.equal(body.result?.attack, 32);
  assert.equal(body.result?.specialDefense, 1);
  assert.equal(body.result?.speed, 32);
  assert.equal(body.result?.total, 65);
  assert.equal(
    body.championsText,
    [
      "Pikachu @ Light Ball",
      "Ability: Static",
      "EVs: 32 Atk / 1 SpD / 32 Spe",
      "Jolly Nature",
      "- Volt Tackle",
    ].join("\n"),
  );
});

test("GET /documentation/json exposes the generated OpenAPI spec", async () => {
  const app = buildApp();
  const response = await app.inject({
    method: "GET",
    url: "/documentation/json",
  });
  await app.close();
  const body = JSON.parse(response.body) as {
    info: { title: string };
    openapi: string;
    paths: Record<string, { get?: { summary?: string }; post?: { summary?: string } }>;
  };

  assert.equal(response.statusCode, 200);
  assert.equal(body.openapi, "3.0.3");
  assert.equal(body.info.title, "ChampCalc API");
  assert.equal(body.paths["/api/convert"]?.get?.summary, "Convert legacy EVs to Champions points");
  assert.equal(body.paths["/api/parse-showdown"]?.post?.summary, "Rewrite a Showdown set into Champions EVs");
});
