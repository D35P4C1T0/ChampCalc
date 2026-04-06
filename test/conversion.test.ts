import assert from "node:assert/strict";
import test from "node:test";

import {
  approximateEvFromChampions,
  canonicalEvFromChampions,
  championsPointsFromEv,
  clampChampionsInputToBudget,
  convertEvToChampions,
} from "../src/domain/ev-master.js";
import {
  buildApproximateLegacyEvLine,
  buildChampionsStLine,
} from "../src/domain/showdown-parser.js";

test("canonical EV thresholds map cleanly to Champions points", () => {
  assert.equal(championsPointsFromEv(0), 0);
  assert.equal(championsPointsFromEv(3), 0);
  assert.equal(championsPointsFromEv(4), 1);
  assert.equal(championsPointsFromEv(11), 1);
  assert.equal(championsPointsFromEv(12), 2);
  assert.equal(championsPointsFromEv(252), 32);

  assert.equal(approximateEvFromChampions(0), 0);
  assert.equal(approximateEvFromChampions(1), 4);
  assert.equal(approximateEvFromChampions(2), 12);
  assert.equal(approximateEvFromChampions(32), 252);
  assert.equal(canonicalEvFromChampions(0), 0);
  assert.equal(canonicalEvFromChampions(1), 4);
  assert.equal(canonicalEvFromChampions(2), 12);
  assert.equal(canonicalEvFromChampions(32), 252);
});

test("export lines can emit Champions STs or approximate legacy EVs", () => {
  const points = {
    hp: 0,
    attack: 32,
    defense: 0,
    specialAttack: 0,
    specialDefense: 1,
    speed: 32,
  };

  assert.equal(
    buildChampionsStLine(points),
    "STs: 32 Atk / 1 SpD / 32 Spe",
  );
  assert.equal(
    buildApproximateLegacyEvLine(points),
    "EVs: 252 Atk / 4 SpD / 252 Spe",
  );
});

test("full EV spreads can waste a point if they are not in canonical buckets", () => {
  const result = convertEvToChampions({
    hp: 195,
    attack: 22,
    defense: 194,
    specialAttack: 28,
    specialDefense: 77,
    speed: 0,
  });

  assert.deepEqual(result, {
    hp: 24,
    attack: 3,
    defense: 24,
    specialAttack: 4,
    specialDefense: 10,
    speed: 0,
    total: 65,
    maxTotal: 66,
    isOverCap: false,
  });
});

test("adding EVs in another stat does not reshuffle an existing point bucket", () => {
  const base = convertEvToChampions({
    hp: 252,
    attack: 252,
    defense: 11,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0,
  });
  const changed = convertEvToChampions({
    hp: 252,
    attack: 252,
    defense: 11,
    specialAttack: 1,
    specialDefense: 0,
    speed: 0,
  });

  assert.equal(base.defense, 1);
  assert.equal(base.specialAttack, 0);
  assert.equal(base.total, 65);

  assert.equal(changed.defense, 1);
  assert.equal(changed.specialAttack, 0);
  assert.equal(changed.total, 65);
});

test("independent point buckets can honestly report an over-cap spread", () => {
  const result = convertEvToChampions({
    hp: 252,
    attack: 252,
    defense: 4,
    specialAttack: 4,
    specialDefense: 4,
    speed: 0,
  });

  assert.equal(result.hp, 32);
  assert.equal(result.attack, 32);
  assert.equal(result.defense, 1);
  assert.equal(result.specialAttack, 1);
  assert.equal(result.specialDefense, 1);
  assert.equal(result.total, 67);
  assert.equal(result.isOverCap, true);
});

test("interactive edits clamp only the edited stat to the remaining budget", () => {
  const clamped = clampChampionsInputToBudget({
    hp: 32,
    attack: 32,
    defense: 5,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0,
  }, "defense");

  assert.deepEqual(clamped, {
    hp: 32,
    attack: 32,
    defense: 2,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0,
  });
});
