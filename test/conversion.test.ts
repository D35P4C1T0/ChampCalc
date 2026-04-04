import assert from "node:assert/strict";
import test from "node:test";

import { convertEvToChampions } from "../src/domain/ev-master.js";

test("516 EVs can resolve to 66 total champions without going over cap", () => {
  const result = convertEvToChampions({
    hp: 195,
    attack: 22,
    defense: 194,
    specialAttack: 28,
    specialDefense: 77,
    speed: 0,
  });

  assert.deepEqual(result, {
    hp: 25,
    attack: 3,
    defense: 25,
    specialAttack: 3,
    specialDefense: 10,
    speed: 0,
    total: 66,
    maxTotal: 66,
    isOverCap: false,
  });
});

test("sample spread still converts to the expected 65 total", () => {
  const result = convertEvToChampions({
    hp: 252,
    attack: 0,
    defense: 4,
    specialAttack: 252,
    specialDefense: 0,
    speed: 0,
  });

  assert.deepEqual(result, {
    hp: 32,
    attack: 0,
    defense: 1,
    specialAttack: 32,
    specialDefense: 0,
    speed: 0,
    total: 65,
    maxTotal: 66,
    isOverCap: false,
  });
});
