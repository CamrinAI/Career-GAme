import { test } from "node:test";
import assert from "node:assert/strict";
import { levelFor, levelProgress, levelGain } from "../src/leveling.ts";
import { freshSave, reward, parseSave } from "../src/engine.ts";

test("level boundaries roll the XP bar into the new level without losing total XP", () => {
  assert.equal(levelFor(0), 1);
  assert.deepEqual(
    [levelProgress(299).level, levelProgress(299).remaining],
    [1, 1],
  );
  assert.deepEqual(levelProgress(300), {
    total: 300,
    level: 2,
    next: 3,
    current: 0,
    required: 300,
    remaining: 300,
    percentage: 0,
  });
  assert.deepEqual(
    [levelProgress(550).current, levelProgress(550).remaining],
    [250, 50],
  );
  assert.equal(levelFor(600), 3);
});
test("large rewards report every crossed level in one level-up event", () => {
  assert.deepEqual(
    levelGain({ xp: 250, epoch: "a" }, { xp: 950, epoch: "a" }),
    { from: 1, to: 4, levels: 3, xpGained: 700 },
  );
});
test("repeat rewards cannot advance levels or emit another level-up", () => {
  const before = freshSave(),
    after = reward(before, "warden", 300, 100),
    replay = reward(after, "warden", 300, 100);
  assert.equal(levelFor(after.xp), 2);
  assert.equal(
    levelGain({ xp: after.xp, epoch: "a" }, { xp: replay.xp, epoch: "a" }),
    null,
  );
});
test("reset, restore and reload preserve the right level without false celebrations", () => {
  const restored = parseSave(JSON.stringify({ ...freshSave(), xp: 650 }));
  assert.equal(levelProgress(restored.xp).level, 3);
  assert.equal(
    levelGain({ xp: 0, epoch: "old" }, { xp: 650, epoch: "restored" }),
    null,
  );
  assert.equal(
    levelGain({ xp: 650, epoch: "old" }, { xp: 0, epoch: "reset" }),
    null,
  );
  assert.equal(
    levelGain({ xp: 650, epoch: "same" }, { xp: 650, epoch: "same" }),
    null,
  );
});
test("invalid XP cannot produce a negative or invalid progress bar", () => {
  for (const xp of [-100, NaN, Infinity])
    assert.deepEqual(levelProgress(xp), levelProgress(0));
  assert.equal(levelProgress(299.9).remaining, 1);
});
