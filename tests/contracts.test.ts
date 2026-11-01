import { test } from "node:test";
import assert from "node:assert/strict";
import { freshSave, parseSave, recordVictory } from "../src/engine.ts";
import { contractsComplete, nextObjective } from "../src/progression.ts";
const ascended = () => ({
  ...freshSave(),
  completed: [0, 1, 2, 3],
  rewards: ["trial", "warden"],
  wins: 1,
  xp: 850,
  mastery: 600,
});

test("a C-rank contract grants its reward once and still counts replay victories", () => {
  const first = recordVictory(ascended(), "aegis-weave");
  assert.deepEqual(first.clearedContracts, ["aegis-weave"]);
  assert.equal(first.xp, 925);
  assert.equal(first.mastery, 625);
  assert.equal(first.wins, 2);
  const repeat = recordVictory(first, "aegis-weave");
  assert.equal(repeat.xp, 925);
  assert.equal(repeat.mastery, 625);
  assert.equal(repeat.wins, 3);
  assert.deepEqual(repeat.clearedContracts, ["aegis-weave"]);
});
test("all three distinct perk wins unlock the title without stacking a fourth reward", () => {
  let s = ascended();
  for (const perk of ["aegis-weave", "focused-core", "warden-sigil"] as const)
    s = recordVictory(s, perk);
  assert.equal(contractsComplete(s), true);
  assert.equal(s.xp, 1075);
  assert.equal(s.mastery, 675);
  assert.equal(s.cosmeticTitle, "class");
  assert.equal(recordVictory(s, "warden-sigil").xp, 1075);
  assert.equal(nextObjective(s).button, "Explore your unlocks");
});
test("unmodified-core wins do not complete any perk contract", () => {
  const s = recordVictory(ascended(), "none");
  assert.deepEqual(s.clearedContracts, []);
  assert.equal(s.xp, 850);
  assert.equal(s.wins, 2);
});
test("contracts do not unlock before C-rank even if a perk is earned", () => {
  const s = recordVictory({ ...freshSave(), completed: [0] }, "aegis-weave");
  assert.deepEqual(s.clearedContracts, []);
  assert.equal(s.xp, 300);
  assert.equal(s.mastery, 100);
});
test("the victory that earns C-rank can also fulfill an equipped earned-perk contract", () => {
  const s = recordVictory(
    { ...freshSave(), completed: [0, 1, 2, 3], rewards: ["trial"] },
    "focused-core",
  );
  assert.equal(s.xp, 375);
  assert.equal(s.mastery, 125);
  assert.deepEqual(s.clearedContracts, ["focused-core"]);
});
test("a loadout that was not unlocked before the battle cannot claim a contract", () => {
  const s = recordVictory(
    { ...freshSave(), completed: [0, 1, 2, 3], rewards: ["trial"] },
    "warden-sigil",
  );
  assert.deepEqual(s.clearedContracts, []);
});
test("v2 saves migrate equipped perks while old wins do not invent contract history", () => {
  const old = { ...ascended(), version: 2, equippedPerk: "warden-sigil" };
  const { clearedContracts, cosmeticTitle, ...legacy } = old;
  const s = parseSave(JSON.stringify(legacy));
  assert.equal(s.version, 4);
  assert.equal(s.equippedPerk, "warden-sigil");
  assert.equal(s.wins, 1);
  assert.equal(s.xp, 850);
  assert.deepEqual(s.clearedContracts, []);
  assert.equal(s.cosmeticTitle, "class");
});
test("title choice persists only when all valid contracts are complete", () => {
  const s = {
    ...ascended(),
    clearedContracts: ["aegis-weave", "focused-core", "warden-sigil"],
    cosmeticTitle: "citadel-vanguard",
  };
  assert.equal(parseSave(JSON.stringify(s)).cosmeticTitle, "citadel-vanguard");
  assert.equal(
    parseSave(JSON.stringify({ ...s, clearedContracts: ["aegis-weave"] }))
      .cosmeticTitle,
    "class",
  );
  assert.deepEqual(
    parseSave(
      JSON.stringify({
        ...s,
        clearedContracts: ["bogus", "aegis-weave", "aegis-weave"],
      }),
    ).clearedContracts,
    ["aegis-weave"],
  );
});
test("reset removes contract completion and equipped cosmetic titles", () => {
  const s = freshSave();
  assert.deepEqual(s.clearedContracts, []);
  assert.equal(s.cosmeticTitle, "class");
  assert.equal(contractsComplete(s), false);
});
