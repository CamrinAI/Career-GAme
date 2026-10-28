import {
  addRaider,
  careers,
  createRaid,
  pets,
  player,
  removeRaider,
  updateRaid,
  type Raid,
  type RaidCommand,
} from "../src/raid.ts";
type RecordData = {
  room: Raid;
  tokens: Record<string, string>;
  seen: Record<string, number>;
  expires: number;
  closed: boolean;
};
type DB = {
  prepare: (sql: string) => {
    bind: (...values: unknown[]) => {
      first: () => Promise<any>;
      run: () => Promise<{ meta: { changes: number } }>;
    };
  };
};
const origins = new Set([
  "https://camrinai.github.io",
  "http://127.0.0.1:4173",
  "http://127.0.0.1:4174",
  "http://127.0.0.1:4175",
]);
const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const random = () =>
  crypto.randomUUID().replaceAll("-", "") +
  crypto.randomUUID().replaceAll("-", "");
const makeCode = () =>
  Array.from(
    crypto.getRandomValues(new Uint8Array(8)),
    (n) => alphabet[n % alphabet.length],
  ).join("");
async function digest(value: string) {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
    ),
    (b) => b.toString(16).padStart(2, "0"),
  ).join("");
}
function validMember(body: any) {
  return (
    body &&
    typeof body.name === "string" &&
    body.name.trim().length > 0 &&
    typeof body.career === "string" &&
    Object.hasOwn(careers, body.career) &&
    typeof body.pet === "string" &&
    Object.hasOwn(pets, body.pet)
  );
}
export default {
  async fetch(request: Request, env: { DB: DB }) {
    const origin = request.headers.get("Origin") || "";
    const own = new URL(request.url).origin;
    const allowed = !origin || origins.has(origin) || origin === own;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      Vary: "Origin",
    };
    if (allowed && origin) headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
    headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
    const response = (body: unknown, status = 200) =>
      new Response(JSON.stringify(body), { status, headers });
    if (!allowed) return response({ error: "Origin not allowed" }, 403);
    if (request.method === "OPTIONS")
      return new Response(null, { status: 204, headers });
    const path = new URL(request.url).pathname;
    if (path === "/" || path === "/api/health")
      return response({
        service: "Quest Rank Rift Rooms",
        version: 1,
        ready: !!env.DB,
      });
    if (!env.DB)
      return response({ error: "Room service storage is unavailable." }, 503);
    let body: any = {};
    if (request.method === "POST") {
      const raw = await request.text();
      if (raw.length > 2048)
        return response({ error: "Request too large" }, 413);
      try {
        body = JSON.parse(raw);
      } catch {
        return response({ error: "Invalid request" }, 400);
      }
    }
    try {
      if (path === "/api/rooms" && request.method === "POST") {
        if (!validMember(body))
          return response({ error: "Choose a nickname, career and pet." }, 400);
        const now = Date.now();
        await env.DB.prepare("DELETE FROM raid_rooms WHERE expires < ?")
          .bind(now)
          .run();
        for (let attempt = 0; attempt < 3; attempt++) {
          const code = makeCode(),
            id = random(),
            token = random();
          const room = createRaid(
            code,
            player(id, body.name, body.career, body.pet),
          );
          const data: RecordData = {
            room,
            tokens: { [id]: await digest(token) },
            seen: { [id]: now },
            expires: now + 6 * 60 * 60 * 1000,
            closed: false,
          };
          const saved = await env.DB.prepare(
            "INSERT OR IGNORE INTO raid_rooms (code, revision, data, expires) VALUES (?, ?, ?, ?)",
          )
            .bind(code, 0, JSON.stringify(data), data.expires)
            .run();
          if (saved.meta.changes)
            return response({ room, identity: id, token }, 201);
        }
        return response(
          { error: "Could not allocate a room. Try again." },
          503,
        );
      }
      const match = path.match(
        /^\/api\/rooms\/([A-HJ-NP-Z2-9]{8})(?:\/(join|command|heartbeat|leave))?$/,
      );
      if (!match) return response({ error: "Room route not found" }, 404);
      const [, code, action] = match;
      if (request.method !== "POST" && !(request.method === "GET" && !action))
        return response({ error: "Method not allowed" }, 405);
      const token = request.headers
        .get("Authorization")
        ?.replace(/^Bearer /, "");
      const tokenHash = token ? await digest(token) : "";
      // A guest chooses their own random one-use join token. Retried joins remain idempotent.
      const joinToken =
        action === "join" &&
        typeof body.joinToken === "string" &&
        /^[a-f0-9]{64}$/.test(body.joinToken)
          ? body.joinToken
          : "";
      const joinHash = joinToken ? await digest(joinToken) : "";
      for (let attempt = 0; attempt < 8; attempt++) {
        const row = await env.DB.prepare(
          "SELECT revision, data, expires FROM raid_rooms WHERE code = ?",
        )
          .bind(code)
          .first();
        const now = Date.now();
        if (!row || row.expires < now)
          return response(
            {
              error:
                "Room not found or expired. Ask the host for a new invite.",
            },
            404,
          );
        const data: RecordData = JSON.parse(row.data);
        const before = JSON.stringify(data);
        if (data.closed || now - (data.seen[data.room.host] || 0) > 120000)
          return response(
            { error: "The host left or disconnected. Start a new room." },
            410,
          );
        const actor = Object.keys(data.tokens).find(
          (id) => data.tokens[id] === tokenHash,
        );
        if (action !== "join" && !actor)
          return response(
            { error: "Your room session is invalid. Rejoin from the lobby." },
            401,
          );
        for (const p of data.room.players)
          if (
            p.id !== data.room.host &&
            now - (data.seen[p.id] || 0) > 120000
          ) {
            data.room = removeRaider(data.room, p.id);
            delete data.tokens[p.id];
            delete data.seen[p.id];
          }
        let identity = actor;
        if (action === "join") {
          if (!validMember(body) || !joinToken)
            return response({ error: "Invalid join details" }, 400);
          const already = Object.keys(data.tokens).find(
            (id) => data.tokens[id] === joinHash,
          );
          if (already)
            return response({
              room: data.room,
              identity: already,
              token: joinToken,
            });
          if (data.room.status !== "lobby" || data.room.players.length >= 4)
            return response(
              {
                error:
                  "This room is full or the raid has started. Ask for a new room.",
              },
              409,
            );
          identity = random();
          data.tokens[identity] = joinHash;
          data.seen[identity] = now;
          data.room = addRaider(
            data.room,
            player(identity, body.name, body.career, body.pet),
          );
        } else if (actor) {
          if (!data.room.players.some((p) => p.id === actor))
            return response({ error: "You are no longer in this room." }, 410);
          if (action === "heartbeat") data.seen[actor] = now;
          if (action === "command") {
            data.seen[actor] = now;
            data.room = updateRaid(
              data.room,
              actor,
              body.command as RaidCommand,
            );
          }
          if (action === "leave") {
            if (actor === data.room.host) data.closed = true;
            else {
              data.room = removeRaider(data.room, actor);
              delete data.tokens[actor];
              delete data.seen[actor];
            }
          }
        }
        if (JSON.stringify(data) !== before) {
          const saved = await env.DB.prepare(
            "UPDATE raid_rooms SET revision = ?, data = ? WHERE code = ? AND revision = ?",
          )
            .bind(row.revision + 1, JSON.stringify(data), code, row.revision)
            .run();
          if (!saved.meta.changes) continue;
        }
        return response({
          room: data.room,
          identity,
          ...(action === "join" ? { token: joinToken } : {}),
        });
      }
      return response(
        { error: "The room is busy. Try that action again." },
        409,
      );
    } catch {
      return response(
        {
          error:
            "Room service temporarily unavailable. Your solo save is safe. Retry in a moment.",
        },
        503,
      );
    }
  },
};
