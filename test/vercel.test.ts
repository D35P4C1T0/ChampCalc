import assert from "node:assert/strict";
import test from "node:test";

import { GET as getHomepage } from "../api/index.js";
import { GET as getConvert, POST as postConvert } from "../api/convert.js";

test("Vercel homepage handler returns HTML with a nonce-bearing script tag", async () => {
  const response = getHomepage();
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(
    String(response.headers.get("content-security-policy") ?? ""),
    /script-src 'self' 'nonce-/,
  );
  assert.match(body, /<script type="module" nonce="[^"]+">/);
});

test("Vercel convert GET handler returns the fixed 66-point conversion", async () => {
  const request = new Request(
    "https://example.test/api/convert?hp=195&attack=22&defense=194&specialAttack=28&specialDefense=77&speed=0",
  );
  const response = getConvert(request);
  const body = await response.json() as {
    result: {
      isOverCap: boolean;
      specialAttack: number;
      total: number;
    };
  };

  assert.equal(response.status, 200);
  assert.equal(body.result.total, 66);
  assert.equal(body.result.isOverCap, false);
  assert.equal(body.result.specialAttack, 3);
});

test("Vercel convert POST handler rejects invalid EV input", async () => {
  const request = new Request("https://example.test/api/convert", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      hp: 300,
    }),
  });
  const response = await postConvert(request);
  const body = await response.json() as {
    details: Array<{ field: string; message: string }>;
    error: string;
  };

  assert.equal(response.status, 400);
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
