import test from "node:test";
import assert from "node:assert/strict";
import {
  addRaider,
  careers,
  createRaid,
  player,
  questionFor,
  raidQuestions,
  removeRaider,
  updateRaid,
  type Career,
  type Raid,
  type Move,
} from "../src/raid.ts";
function party(roles: Career[] = ["cloud", "software"]) {
  let state = createRaid("ABCDEFGH", player("host", "Host", roles[0], "owl"));
  for (let i = 1; i < roles.length; i++)
    state = addRaider(state, player(`p${i}`, `Player ${i}`, roles[i], "fox"));
  for (const p of state.players)
    state = updateRaid(state, p.id, { type: "ready" });
  return updateRaid(state, "host", { type: "start" });
}
function round(state: Raid, move: Move = "strike", correct = true) {
  for (const p of state.players)
    state = updateRaid(state, p.id, {
      type: "answer",
      round: state.round,
      move,
      answer:
        (questionFor(p.career, state.round).answer + (correct ? 0 : 1)) % 4,
    });
  return state;
}
test("all four raid careers have six well-formed questions, varied correct choices and hints", () => {
  for (const id of Object.keys(careers) as Career[]) {
    assert.equal(raidQuestions[id].length, 6);
    for (const q of raidQuestions[id]) {
      assert.equal(new Set(q.options).size, 4);
      assert.ok(q.answer >= 0 && q.answer < 4);
      assert.ok(q.explanation.length > 30);
      assert.ok(q.hint.length > 15);
    }
    assert.ok(new Set(raidQuestions[id].map((q) => q.answer)).size >= 3);
  }
});
test("rooms require two ready players and only host can start", () => {
  let s = createRaid("ABCDEFGH", player("host", "Host", "cloud", "owl"));
  s = updateRaid(s, "host", { type: "ready" });
  assert.equal(updateRaid(s, "host", { type: "start" }).status, "lobby");
  s = addRaider(s, player("p1", "Guest", "nurse", "fox"));
  assert.equal(updateRaid(s, "host", { type: "start" }).status, "lobby");
  s = updateRaid(s, "p1", { type: "ready" });
  assert.equal(updateRaid(s, "p1", { type: "start" }).status, "lobby");
  assert.equal(updateRaid(s, "host", { type: "start" }).status, "active");
});
test("room membership is capped at four and closed after start", () => {
  let s = createRaid("ABCDEFGH", player("host", "Host", "cloud", "owl"));
  for (let i = 0; i < 6; i++)
    s = addRaider(s, player("p" + i, "Guest", "nurse", "fox"));
  assert.equal(s.players.length, 4);
  assert.equal(addRaider(s, s.players[1]), s);
  const active = party();
  assert.equal(addRaider(active, player("late", "Late", "ai", "owl")), active);
});
test("rounds resolve only when everyone submits; duplicates and stale rounds are ignored", () => {
  let s = party();
  const start = s;
  s = updateRaid(s, "host", {
    type: "answer",
    round: 1,
    move: "strike",
    answer: questionFor("cloud", 1).answer,
  });
  assert.equal(s.boss, start.boss);
  assert.equal(s.status, "active");
  assert.equal(
    updateRaid(s, "host", {
      type: "answer",
      round: 1,
      move: "mend",
      answer: 0,
    }),
    s,
  );
  assert.equal(
    updateRaid(s, "p1", {
      type: "answer",
      round: 0,
      move: "strike",
      answer: 0,
    }),
    s,
  );
  s = updateRaid(s, "p1", {
    type: "answer",
    round: 1,
    move: "strike",
    answer: questionFor("software", 1).answer,
  });
  assert.equal(s.status, "review");
  assert.equal(s.boss, start.boss - 110);
  assert.equal(s.players[0].correct, 1);
  assert.equal(updateRaid(s, "p1", { type: "next" }), s);
  s = updateRaid(s, "host", { type: "next" });
  assert.equal(s.round, 2);
  assert.deepEqual(s.submissions, {});
});
test("hints are limited to one each round, cannot follow submission and grant AI an extra charge", () => {
  let s = party(["ai", "cloud"]);
  assert.equal(s.players[0].hints, 4);
  s = updateRaid(s, "host", { type: "hint", round: 1 });
  assert.equal(s.players[0].hints, 3);
  assert.equal(updateRaid(s, "host", { type: "hint", round: 1 }), s);
  s = round(s);
  s = updateRaid(s, "host", { type: "next" });
  s = updateRaid(s, "host", {
    type: "answer",
    round: 2,
    move: "strike",
    answer: 0,
  });
  assert.equal(updateRaid(s, "host", { type: "hint", round: 2 }), s);
});
test("invalid command actors, moves and answer indexes cannot change room state", () => {
  const s = party();
  assert.equal(updateRaid(s, "stranger", { type: "ready" }), s);
  for (const answer of [-1, 4, NaN, 1.5])
    assert.equal(
      updateRaid(s, "host", {
        type: "answer",
        round: 1,
        move: "strike",
        answer,
      }),
      s,
    );
  assert.equal(
    updateRaid(s, "host", {
      type: "answer",
      round: 1,
      move: "dance" as Move,
      answer: 0,
    }),
    s,
  );
  assert.equal(updateRaid(s, "host", null as never), s);
});
test("specialists add healing and shielding without exceeding maximum party HP", () => {
  let s = party(["cloud", "nurse"]);
  s = { ...s, hp: 100 };
  s = updateRaid(s, "host", {
    type: "answer",
    round: 1,
    move: "ward",
    answer: questionFor("cloud", 1).answer,
  });
  s = updateRaid(s, "p1", {
    type: "answer",
    round: 1,
    move: "mend",
    answer: questionFor("nurse", 1).answer,
  });
  assert.equal(s.hp, 140);
  assert.equal(s.boss, s.maxBoss - 25);
  assert.ok(s.log.includes("40 shield"));
  assert.ok(round(party(["nurse", "nurse"]), "mend").hp <= s.maxHp);
});
test("a coordinated raid can win; lethal damage skips retaliation and terminal commands are ignored", () => {
  let s = party(["software", "software"]);
  while (s.status !== "victory") {
    s = round(s);
    if (s.status === "review") s = updateRaid(s, "host", { type: "next" });
    else break;
  }
  assert.equal(s.status, "victory");
  assert.equal(s.round, 3);
  assert.equal(s.hp, 125);
  assert.equal(
    updateRaid(s, "host", {
      type: "answer",
      round: 3,
      move: "strike",
      answer: 0,
    }),
    s,
  );
});
test("wrong answers contribute nothing and can defeat the party; six rounds is the limit", () => {
  let s = party();
  s = round(s, "strike", false);
  assert.equal(s.boss, s.maxBoss);
  s = {
    ...s,
    hp: 1,
    status: "active",
    submissions: {},
    players: s.players.map((p) => ({ ...p, submitted: false })),
  };
  s = round(s, "strike", false);
  assert.equal(s.status, "defeat");
  assert.equal(s.hp, 0);
  s = party(["cloud", "cloud"]);
  s = { ...s, round: 6 };
  s = round(s, "ward");
  assert.equal(s.status, "defeat");
  assert.ok(s.hp > 0);
});
test("host rematch resets hints and health, keeps party and code, and requires readiness again", () => {
  let s = party(["software", "software"]);
  s = { ...s, status: "victory", boss: 0 };
  assert.equal(updateRaid(s, "p1", { type: "rematch" }), s);
  const next = updateRaid(s, "host", { type: "rematch" });
  assert.equal(next.code, s.code);
  assert.equal(next.players.length, 2);
  assert.equal(next.status, "lobby");
  assert.equal(next.round, 1);
  assert.equal(next.players[0].ready, false);
  assert.equal(next.players[0].hints, 3);
  assert.equal(next.players[0].correct, 0);
  assert.ok(next.revision > s.revision);
});
test("disconnect removes that member and can release a submitted round without rescaling health", () => {
  let s = party();
  s = updateRaid(s, "host", {
    type: "answer",
    round: 1,
    move: "strike",
    answer: 0,
  });
  const max = s.maxBoss;
  s = removeRaider(s, "p1");
  assert.equal(s.players.length, 1);
  assert.equal(s.status, "review");
  assert.equal(s.maxBoss, max);
  assert.equal(removeRaider(s, "host"), s);
});
