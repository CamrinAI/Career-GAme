import test from "node:test";
import assert from "node:assert/strict";
import { createSaveStore, SAVE_KEY } from "../src/saveStore.ts";
import { freshSave, reward } from "../src/engine.ts";
function shared() {
  let raw: string | null = null,
    pending: Promise<unknown> = Promise.resolve();
  const storage = {
    getItem: () => raw,
    setItem: (_key: string, value: string) => {
      raw = value;
    },
  };
  const lock = (work: () => void) => {
    const next = pending.then(work);
    pending = next;
    return next;
  };
  return { storage, lock };
}
test("a stale tab changing sound cannot overwrite newly earned progress", async () => {
  const { storage, lock } = shared();
  const a = createSaveStore(storage, lock),
    b = createSaveStore(storage, lock);
  await a.change((s) => ({
    ...reward(s, "lesson-0", 100, 100),
    completed: [0],
  }));
  await b.change((s) => ({ ...s, sound: true }));
  a.sync();
  assert.equal(a.getSnapshot().save.xp, 100);
  assert.deepEqual(a.getSnapshot().save.completed, [0]);
  assert.equal(a.getSnapshot().save.sound, true);
});
test("simultaneous tab rewards rebase under a shared lock and remain idempotent", async () => {
  const { storage, lock } = shared();
  const a = createSaveStore(storage, lock),
    b = createSaveStore(storage, lock);
  await Promise.all([
    a.change((s) => reward(s, "one", 100, 100)),
    b.change((s) => reward(s, "two", 150, 100)),
  ]);
  await b.change((s) => reward(s, "one", 100, 100));
  a.sync();
  assert.equal(a.getSnapshot().save.xp, 250);
  assert.equal(a.getSnapshot().save.mastery, 200);
});
test("reset replaces progress, clears stale sessions, and rejects queued actions from old epochs", async () => {
  const { storage, lock } = shared();
  let replaced = 0;
  const a = createSaveStore(storage, lock),
    b = createSaveStore(storage, lock, () => replaced++);
  await a.change((s) => reward(s, "warden", 300, 100));
  const reset = a.change(freshSave());
  const stale = b.change((s) => reward(s, "old-fight", 300, 100));
  await Promise.all([reset, stale]);
  assert.equal(b.getSnapshot().save.xp, 0);
  assert.equal(replaced, 1);
  await b.change((s) => reward(s, "fresh-learning", 100, 100));
  a.sync();
  assert.equal(a.getSnapshot().save.xp, 100);
});
test("restore intentionally replaces the save and preserves backup format compatibility", async () => {
  const { storage, lock } = shared();
  const a = createSaveStore(storage, lock);
  await a.change((s) => reward(s, "old", 100, 100));
  await a.change({ ...freshSave(), name: "Restored", xp: 50 });
  assert.equal(a.getSnapshot().save.xp, 50);
  assert.equal(a.getSnapshot().save.name, "Restored");
  assert.ok(JSON.parse(storage.getItem(SAVE_KEY)!)._epoch);
});
test("unavailable storage keeps subsequent updates in memory without losing earned XP", async () => {
  const store = createSaveStore(
    {
      getItem: () => null,
      setItem: () => {
        throw Error("quota");
      },
    },
    async (work) => work(),
  );
  await store.change((s) => reward(s, "one", 100, 100));
  await store.change((s) => ({ ...s, sound: true }));
  assert.equal(store.getSnapshot().save.xp, 100);
  assert.equal(store.getSnapshot().save.sound, true);
});
