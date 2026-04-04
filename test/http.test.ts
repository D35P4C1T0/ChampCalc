import assert from "node:assert/strict";
import test from "node:test";

import { buildApp } from "../src/app.js";

test("GET / includes hardened headers and a script nonce", async () => {
  const app = await buildApp();
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
});

test("POST /api/convert rejects out-of-range EVs with a public-safe error shape", async () => {
  const app = await buildApp();
  const response = await app.inject({
    method: "POST",
    url: "/api/convert",
    headers: {
      "content-type": "application/json",
    },
    payload: JSON.stringify({
      hp: 300,
    }),
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
