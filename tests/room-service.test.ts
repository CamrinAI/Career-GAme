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
  assert.equal((await call(path, undefined, guest.data.token)).status, 410);
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
