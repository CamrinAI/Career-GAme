import { useEffect, useRef, useState } from "react";
import type { Career, Pet, Raid, RaidCommand } from "./raid";
const SERVICE = "https://quest-rank-rift-rooms.stablesquid26.chatgpt.site";
const SESSION = "questrank.raid.session.v1";
type Session = { code: string; identity: string; token: string };
export function useRaidRoom() {
  const [room, setRoom] = useState<Raid | null>(null);
  const [identity, setIdentity] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [busy, setBusy] = useState(false);
  const session = useRef<Session | null>(null);
  const state = useRef<Raid | null>(null);
  const generation = useRef(0);
  const commandPending = useRef(false);
  function publish(next: Raid) {
    if (state.current && next.revision < state.current.revision) return;
    state.current = next;
    setRoom(next);
  }
  async function request(path: string, body?: unknown, token?: string) {
    const result = await fetch(SERVICE + path, {
      method: body === undefined ? "GET" : "POST",
      headers: {
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
    const data = await result.json();
    if (!result.ok)
      throw Object.assign(new Error(data.error || "Room connection failed."), {
        status: result.status,
      });
    return data;
  }
  function forget() {
    generation.current++;
    session.current = null;
    state.current = null;
    commandPending.current = false;
    setBusy(false);
    setRoom(null);
    setIdentity("");
    setConnecting(false);
    setStatus("");
    setError("");
    try {
      sessionStorage.removeItem(SESSION);
    } catch {}
  }
  function remember(next: Session) {
    session.current = next;
    setIdentity(next.identity);
    try {
      sessionStorage.setItem(SESSION, JSON.stringify(next));
    } catch {}
  }
  async function leave() {
    const old = session.current;
    forget();
    if (old)
      try {
        await request("/api/rooms/" + old.code + "/leave", {}, old.token);
      } catch {
        /* Expiry also closes disconnected sessions. */
      }
  }
  useEffect(() => {
    let alive = true,
      timer: ReturnType<typeof setTimeout>;
    let heartbeat = 0;
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION) || "null");
      if (
        saved &&
        /^[A-HJ-NP-Z2-9]{8}$/.test(saved.code) &&
        typeof saved.identity === "string" &&
        /^[a-f0-9]{64}$/.test(saved.token)
      ) {
        remember(saved);
        setStatus("Reconnecting to room…");
      }
    } catch {}
    async function poll() {
      const active = session.current,
        stamp = generation.current;
      if (active)
        try {
          const beat = Date.now() - heartbeat > 15000;
          const data = await request(
            "/api/rooms/" + active.code + (beat ? "/heartbeat" : ""),
            beat ? {} : undefined,
            active.token,
          );
          if (
            alive &&
            generation.current === stamp &&
            session.current === active
          ) {
            publish(data.room);
            setStatus("Connected · room sync active");
            setError("");
            if (beat) heartbeat = Date.now();
          }
        } catch (err) {
          if (
            alive &&
            generation.current === stamp &&
            session.current === active
          ) {
            const e = err as Error & { status?: number };
            if ([401, 404, 410].includes(e.status || 0)) {
              setStatus("Room ended");
              setError(e.message);
              try {
                sessionStorage.removeItem(SESSION);
              } catch {}
              session.current = null;
            } else {
              setStatus("Reconnecting…");
              setError(
                "Connection interrupted. Keep this page open while we reconnect. Do not submit again until the room syncs.",
              );
            }
          }
        }
      if (alive) timer = setTimeout(poll, 1200);
    }
    void poll();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);
  async function connect(
    mode: "host" | "join",
    code: string,
    name: string,
    career: Career,
    pet: Pet,
  ) {
    await leave();
    setConnecting(true);
    setStatus("Connecting to room service…");
    const stamp = generation.current;
    try {
      const joinToken =
        crypto.randomUUID().replaceAll("-", "") +
        crypto.randomUUID().replaceAll("-", "");
      const data = await request(
        mode === "host" ? "/api/rooms" : "/api/rooms/" + code + "/join",
        { name, career, pet, ...(mode === "join" ? { joinToken } : {}) },
      );
      if (stamp !== generation.current) return;
      remember({
        code: data.room.code,
        identity: data.identity,
        token: data.token,
      });
      publish(data.room);
      setStatus("Connected · room sync active");
      setError("");
    } catch (err) {
      if (stamp === generation.current) {
        setError((err as Error).message || "Cannot connect. Please try again.");
        setStatus("Connection unavailable");
      }
    } finally {
      if (stamp === generation.current) setConnecting(false);
    }
  }
  async function send(command: RaidCommand) {
    const active = session.current;
    if (!active || commandPending.current) return;
    commandPending.current = true;
    setBusy(true);
    const stamp = generation.current;
    try {
      const data = await request(
        "/api/rooms/" + active.code + "/command",
        { command },
        active.token,
      );
      if (stamp === generation.current) {
        publish(data.room);
        setStatus("Connected · room sync active");
        setError("");
      }
    } catch (err) {
      if (stamp === generation.current)
        setError(
          (err as Error).message ||
            "Could not send that move. Check room sync before retrying.",
        );
    } finally {
      if (stamp === generation.current) {
        commandPending.current = false;
        setBusy(false);
      }
    }
  }
  return {
    room,
    identity,
    status,
    error,
    connecting,
    busy,
    connect,
    leave,
    send,
  };
}
