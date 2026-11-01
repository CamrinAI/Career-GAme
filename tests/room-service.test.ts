import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import worker from "../room-service/worker.ts";
import { questionFor } from "../src/raid.ts";
function service() {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(
    "CREATE TABLE raid_rooms (code TEXT PRIMARY KEY, revision INTEGER NOT NULL, data TEXT NOT NULL, expires INTEGER NOT NULL);",
  );
  const DB = {
    prepare: (sql: string) => ({
      bind: (...args: any[]) => ({
        first: async () => sqlite.prepare(sql).get(...args),
        run: async () => ({
          meta: { changes: Number(sqlite.prepare(sql).run(...args).changes) },
        }),
      }),
    }),
  };
  async function call(
    path: string,
    body?: unknown,
    token?: string,
    origin = "https://camrinai.github.io",
  ) {
    if (
      body &&
      typeof body === "object" &&
      "command" in body &&
      !("run" in body)
    ) {
      const code = path.split("/")[3];
      const stored = sqlite
        .prepare("SELECT data FROM raid_rooms WHERE code = ?")
        .get(code) as { data: string } | undefined;
      if (stored) {
        const room = JSON.parse(stored.data).room;
        body = { ...body, run: room.run, round: room.round };
      }
    }
    const res = await worker.fetch(
      new Request("https://rooms.example" + path, {
        method: body === undefined ? "GET" : "POST",
        headers: {
          Origin: origin,
          ...(token ? { Authorization: "Bearer " + token } : {}),
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      }),
      { DB },
    );
    return {
      status: res.status,
      data: (await res.json()) as any,
      headers: res.headers,
    };
  }
  return { call, sqlite };
}
test("HTTP rooms authenticate members, serialize simultaneous answers and enforce host authority", async () => {
  const { call } = service();
  const host = await call("/api/rooms", {
    name: "Cloud",
    career: "cloud",
    pet: "owl",
  });
  assert.equal(host.status, 201);
  const code = host.data.room.code;
  const path = "/api/rooms/" + code;
  assert.equal((await call(path)).status, 401);
  const joinToken = "a".repeat(64);
  const guest = await call(path + "/join", {
    name: "Nurse",
    career: "nurse",
    pet: "fox",
    joinToken,
  });
  assert.equal(guest.status, 200);
  const retried = await call(path + "/join", {
    name: "Nurse",
    career: "nurse",
    pet: "fox",
    joinToken,
  });
  assert.equal(retried.data.identity, guest.data.identity);
  assert.equal(retried.data.room.players.length, 2);
  assert.equal(
    JSON.stringify(
      (await call(path, undefined, guest.data.token)).data,
    ).includes(host.data.token),
    false,
  );
  for (const token of [host.data.token, guest.data.token])
    await call(path + "/command", { command: { type: "ready" } }, token);
  const noStart = await call(
    path + "/command",
    { command: { type: "start" } },
    guest.data.token,
  );
  assert.equal(noStart.data.room.status, "lobby");
  await call(
    path + "/command",
    { command: { type: "start" } },
    host.data.token,
  );
  await Promise.all(
    [
      ["cloud", host.data.token],
      ["nurse", guest.data.token],
    ].map(([career, token]) =>
      call(
        path + "/command",
        {
          command: {
            type: "answer",
            round: 1,
            move: "strike",
            answer: questionFor(career as "cloud" | "nurse", 1).answer,
          },
        },
        token,
      ),
    ),
  );
  const state = await call(path, undefined, host.data.token);
  assert.equal(state.data.room.status, "review");
  assert.equal(state.data.room.boss, 260);
  await call(path + "/leave", {}, host.data.token);
  const closed = await call(path, undefined, guest.data.token);
  assert.equal(closed.status, 200);
  assert.equal(closed.data.closed, true);
});
test("room API validates origins, input, expired rooms and invalid credentials", async () => {
  const { call, sqlite } = service();
  assert.equal(
    (
      await call(
        "/api/rooms",
        { name: "Test", career: "cloud", pet: "owl" },
        undefined,
        "https://evil.example",
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await call("/api/rooms", {
        name: "Test",
        career: "__proto__",
        pet: "owl",
      })
    ).status,
    400,
  );
  const host = await call("/api/rooms", {
    name: "Test",
    career: "ai",
    pet: "sprite",
  });
  const path = "/api/rooms/" + host.data.room.code;
  assert.equal((await call(path, undefined, "wrong")).status, 401);
  sqlite.prepare("UPDATE raid_rooms SET expires=0").run();
  assert.equal((await call(path, undefined, host.data.token)).status, 404);
});

test("debrief acknowledgements preserve guest victory until read and reject previous-run actions", async () => {
  const { call } = service();
  const h = (
    await call("/api/rooms", { name: "Host", career: "software", pet: "owl" })
  ).data;
  const path = "/api/rooms/" + h.room.code;
  const g = (
    await call(path + "/join", {
      name: "Guest",
      career: "software",
      pet: "fox",
      joinToken: "b".repeat(64),
    })
  ).data;
  const command = (
    token: string,
    type: string,
    extra: Record<string, unknown> = {},
  ) => call(path + "/command", { command: { type, ...extra } }, token);
  for (const token of [h.token, g.token]) await command(token, "ready");
  await command(h.token, "start");
  for (let round = 1; round <= 3; round++) {
    for (const token of [h.token, g.token])
      await command(token, "answer", {
        round,
        move: "strike",
        answer: questionFor("software", round).answer,
      });
    if (round < 3) {
      for (const token of [h.token, g.token])
        await command(token, "acknowledge");
      await command(h.token, "next");
    }
  }
  const early = await command(h.token, "rematch");
  assert.equal(early.data.room.status, "victory");
  await command(h.token, "acknowledge");
  assert.equal((await command(h.token, "rematch")).data.room.status, "victory");
  const guestResult = await call(path, undefined, g.token);
  assert.equal(guestResult.data.room.status, "victory");
  await command(g.token, "acknowledge");
  const rematch = await command(h.token, "rematch");
  assert.equal(rematch.data.room.run, 2);
  for (const token of [h.token, g.token]) await command(token, "ready");
  await command(h.token, "start");
  const stale = await call(
    path + "/command",
    {
      run: 1,
      round: 1,
      command: { type: "answer", round: 1, move: "strike", answer: 2 },
    },
    g.token,
  );
  assert.equal(stale.status, 409);
  const current = await call(path, undefined, g.token);
  assert.equal(
    current.data.room.players.find((p: any) => p.id === g.identity).submitted,
    false,
  );
});
test("closed rooms retain authenticated final results and malformed JSON values return400", async () => {
  const { call } = service();
  const h = (
    await call("/api/rooms", { name: "Host", career: "cloud", pet: "owl" })
  ).data;
  const path = "/api/rooms/" + h.room.code;
  for (const value of [null, [], 1, "text"])
    assert.equal((await call(path + "/join", value)).status, 400);
  assert.equal((await call(path + "/command", null, h.token)).status, 400);
  await call(path + "/leave", {}, h.token);
  const result = await call(path, undefined, h.token);
  assert.equal(result.status, 200);
  assert.equal(result.data.closed, true);
  assert.equal((await call(path)).status, 401);
});
