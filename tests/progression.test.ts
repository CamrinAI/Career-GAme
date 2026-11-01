import { test } from "node:test";
import assert from "node:assert/strict";
import { freshSave, reward } from "../src/engine.ts";
import {
  isPerkUnlocked,
  milestones,
  nextObjective,
  rankFor,
} from "../src/progression.ts";

test("rank ascension requires the exact earned milestones, not XP alone", () => {
  const initial = freshSave();
  assert.equal(rankFor({ ...initial, xp: 99999 }).rank, "E");
  const academy = { ...initial, completed: [0, 1, 2, 3] };
  assert.deepEqual(rankFor(academy), { rank: "D", title: "Cloud Apprentice" });
  assert.equal(rankFor({ ...academy, wins: 1 }).rank, "D");
  assert.equal(rankFor({ ...academy, rewards: ["trial"] }).rank, "D");
  assert.deepEqual(
    rankFor({ ...academy, rewards: ["trial"], wins: 1, trialBest: 0 }),
    { rank: "C", title: "Cloud Warden" },
  );
  assert.equal(
    rankFor({
      ...initial,
      completed: [0, 0, 0, 0],
      wins: 1,
      rewards: ["trial"],
    }).rank,
    "E",
  );
});
test("perks unlock through distinct learning, practice, and battle milestones", () => {
  const s = freshSave();
  assert.equal(isPerkUnlocked(s, "none"), true);
  for (const id of ["aegis-weave", "focused-core", "warden-sigil"] as const)
    assert.equal(isPerkUnlocked(s, id), false);
  assert.equal(isPerkUnlocked({ ...s, completed: [2] }, "aegis-weave"), true);
  assert.equal(
    isPerkUnlocked({ ...s, rewards: ["trial"], trialBest: 0 }, "focused-core"),
    true,
  );
  assert.equal(isPerkUnlocked({ ...s, wins: 1 }, "warden-sigil"), true);
});
test("next objective advances from incomplete lessons to trial, boss, then unlocks", () => {
  let s = freshSave();
  assert.equal(nextObjective(s).title, "Complete Academy lesson 1");
  s = { ...s, completed: [0, 2] };
  assert.equal(nextObjective(s).title, "Complete Academy lesson 2");
  s = { ...s, completed: [0, 1, 2, 3] };
  assert.equal(nextObjective(s).trial, true);
  s = reward(s, "trial", 150, 100);
  assert.equal(nextObjective(s).destination, "dungeon");
  s = { ...s, wins: 1 };
  assert.equal(nextObjective(s).destination, "profile");
});
test("the milestone journal distinguishes a partial journey from full ascension", () => {
  const s = freshSave();
  assert.equal(milestones(s).filter((x) => x.earned).length, 0);
  assert.equal(
    milestones({ ...s, completed: [3] }).filter((x) => x.earned).length,
    1,
  );
  const complete = {
    ...s,
    completed: [0, 1, 2, 3],
    rewards: ["trial"],
    wins: 1,
  };
  assert.equal(milestones(complete).filter((x) => x.earned).length, 5);
});
test("replaying a completed milestone does not farm XP or mastery", () => {
  const s = reward({ ...freshSave(), wins: 1 }, "warden", 300, 100);
  const replay = reward({ ...s, wins: 2 }, "warden", 300, 100);
  assert.equal(replay.wins, 2);
  assert.equal(replay.xp, 300);
  assert.equal(replay.mastery, 100);
});
