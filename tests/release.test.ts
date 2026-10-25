import { test } from "node:test";
import assert from "node:assert/strict";
import { freshSave, parseSave } from "../src/engine.ts";
import {
  recordAnswer,
  reviewQuestions,
  studySummary,
  parsePractice,
} from "../src/learning.ts";
import { encodeBackup, decodeBackup } from "../src/backup.ts";
import { questions } from "../src/content.ts";

test("missed answers enter review and corrected answers leave it without losing history", () => {
  const question = questions[0],
    wrong = (question.answer + 1) % question.options.length;
  let s = recordAnswer(freshSave(), question.id, wrong);
  assert.equal(reviewQuestions(s)[0].id, question.id);
  assert.deepEqual(studySummary(s), {
    attempts: 1,
    correct: 0,
    seen: 1,
    review: 1,
  });
  s = recordAnswer(s, question.id, question.answer);
  assert.equal(reviewQuestions(s).length, 0);
  assert.equal(s.practice[question.id].attempts, 2);
  assert.equal(s.practice[question.id].correct, 1);
  assert.equal(s.xp, 0);
  assert.deepEqual(parseSave(JSON.stringify(s)).practice, s.practice);
});
test("invalid question IDs and answer indexes cannot mutate practice history", () => {
  const s = freshSave();
  for (const answer of [-1, 3, NaN, 1.5])
    assert.equal(recordAnswer(s, questions[0].id, answer), s);
  assert.equal(recordAnswer(s, "not-a-question", 0), s);
});
test("practice parsing rejects unknown and malformed records", () => {
  const parsed = parsePractice({
    [questions[0].id]: { attempts: 2, correct: 1, lastAnswer: 0 },
    unknown: { attempts: 1, correct: 1, lastAnswer: 0 },
    [questions[1].id]: { attempts: 1, correct: 2, lastAnswer: 0 },
    [questions[2].id]: { attempts: 2, correct: 0, lastAnswer: 99 },
  });
  assert.deepEqual(Object.keys(parsed), [questions[0].id]);
  assert.deepEqual(parsePractice(null), {});
  assert.deepEqual(parsePractice([]), {});
});
test("legacy v3 progress and cosmetic title migrate without fabricated learning history", () => {
  const old = {
    ...freshSave(),
    version: 3,
    xp: 1075,
    mastery: 675,
    completed: [0, 1, 2, 3],
    rewards: ["trial", "warden"],
    wins: 5,
    equippedPerk: "focused-core",
    clearedContracts: ["aegis-weave", "focused-core", "warden-sigil"],
    cosmeticTitle: "citadel-vanguard",
  };
  const migrated = parseSave(JSON.stringify(old));
  assert.equal(migrated.version, 4);
  assert.equal(migrated.awakened, true);
  assert.equal(migrated.xp, 1075);
  assert.equal(migrated.cosmeticTitle, "citadel-vanguard");
  assert.equal(migrated.equippedPerk, "focused-core");
  assert.deepEqual(migrated.practice, {});
});
test("brand-new players start unawakened; existing progress skips forced onboarding", () => {
  assert.equal(freshSave().awakened, false);
  assert.equal(
    parseSave(JSON.stringify({ version: 3, xp: 100, completed: [0] })).awakened,
    true,
  );
  assert.equal(
    parseSave(JSON.stringify({ ...freshSave(), awakened: true })).awakened,
    true,
  );
});
test("backups round trip earned progress, history, settings and player identity", () => {
  const s = recordAnswer(
    {
      ...freshSave(),
      name: "Test Hunter",
      xp: 100,
      completed: [0],
      sound: true,
      reduced: true,
      awakened: true,
    },
    questions[0].id,
    0,
  );
  assert.deepEqual(decodeBackup(encodeBackup(s)), s);
});
test("backup import rejects foreign, corrupted, oversized and future-format files", () => {
  for (const raw of [
    "bad",
    "{}",
    "null",
    JSON.stringify({ app: "another-app", format: 1, save: freshSave() }),
    JSON.stringify({ app: "quest-rank", format: 99, save: freshSave() }),
    JSON.stringify({
      app: "quest-rank",
      format: 1,
      save: { ...freshSave(), version: 99 },
    }),
    " ".repeat(262145),
  ])
    assert.throws(() => decodeBackup(raw));
});
test("backup import can migrate older supported versions", () => {
  const legacy = {
    version: 1,
    name: "Legacy Hunter",
    xp: 100,
    mastery: 100,
    completed: [0],
    rewards: ["lesson-0"],
  };
  const s = decodeBackup(
    JSON.stringify({ app: "quest-rank", format: 1, save: legacy }),
  );
  assert.equal(s.version, 4);
  assert.equal(s.xp, 100);
  assert.equal(s.awakened, true);
  assert.deepEqual(s.practice, {});
});
test("reset defaults remove practice history and awakening as well as rewards", () => {
  const s = freshSave();
  assert.deepEqual(s.practice, {});
  assert.equal(s.awakened, false);
  assert.equal(s.cosmeticTitle, "class");
  assert.deepEqual(s.rewards, []);
});
