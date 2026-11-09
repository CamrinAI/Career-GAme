import { freshSave, parseSave, type Save } from "./engine.ts";
export const SAVE_KEY = "questrank.save.v1";
export type SaveSnapshot = { save: Save; epoch: string };
type StoragePort = Pick<Storage, "getItem" | "setItem">;
type SaveAction = Save | ((save: Save) => Save);
type Lock = (work: () => void) => Promise<unknown>;
export function createSaveStore(
  storage: StoragePort,
  lock: Lock,
  onReplace: () => void = () => {},
  onError: (message: string) => void = () => {},
) {
  function read(): SaveSnapshot {
    const raw = storage.getItem(SAVE_KEY);
    let epoch = "legacy";
    try {
      const value = JSON.parse(raw || "null");
      if (typeof value?._epoch === "string") epoch = value._epoch;
    } catch {}
    return { save: parseSave(raw), epoch };
  }
  let snapshot: SaveSnapshot;
  let unavailable = false;
  try {
    snapshot = read();
  } catch {
    snapshot = { save: freshSave(), epoch: "legacy" };
    unavailable = true;
  }
  const listeners = new Set<() => void>();
  let queue: Promise<unknown> = Promise.resolve();
  function publish(next: SaveSnapshot) {
    if (next.epoch !== snapshot.epoch) onReplace();
    if (JSON.stringify(next) === JSON.stringify(snapshot)) return;
    snapshot = next;
    for (const listener of listeners) listener();
  }
  const sync = () => {
    try {
      if (!unavailable) publish(read());
    } catch {}
  };
  function change(action: SaveAction): Promise<unknown> {
    const expectedEpoch = snapshot.epoch;
    const work = () => {
      let current = snapshot;
      if (!unavailable)
        try {
          current = read();
        } catch {
          unavailable = true;
        }
      const replacing = typeof action !== "function";
      if (!replacing && current.epoch !== expectedEpoch) {
        publish(current);
        return;
      }
      const next = {
        save: replacing ? action : action(current.save),
        epoch: replacing ? crypto.randomUUID() : current.epoch,
      };
      try {
        storage.setItem(
          SAVE_KEY,
          JSON.stringify({ ...next.save, _epoch: next.epoch }),
        );
        unavailable = false;
        onError("");
      } catch {
        unavailable = true;
        onError(
          "Saving is unavailable in this browser. Keep this tab open to retain progress.",
        );
      }
      publish(next);
    };
    queue = queue
      .then(() => lock(work))
      .catch(() => {
        onError(
          "Progress could not be saved. Please try your last action again.",
        );
      });
    return queue;
  }
  return {
    getSnapshot: () => snapshot,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    sync,
    change,
  };
}
