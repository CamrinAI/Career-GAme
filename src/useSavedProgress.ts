import { useEffect, useState, useSyncExternalStore, useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Save } from "./engine";
import { createSaveStore, SAVE_KEY } from "./saveStore";
export function useSavedProgress() {
  const [error, setError] = useState("");
  const [store] = useState(() =>
    createSaveStore(
      {
        getItem: (key) => localStorage.getItem(key),
        setItem: (key, value) => localStorage.setItem(key, value),
      },
      (work) =>
        navigator.locks
          ? navigator.locks.request(SAVE_KEY, work)
          : Promise.resolve(work()),
      () => {
        try {
          sessionStorage.removeItem("questrank.raid.session.v1");
        } catch {}
        window.dispatchEvent(new Event("questrank:progress-replaced"));
      },
      setError,
    ),
  );
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === SAVE_KEY || event.key === null) store.sync();
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [store]);
  const setSave: Dispatch<SetStateAction<Save>> = useCallback(
    (action) => {
      void store.change(action);
    },
    [store],
  );
  return {
    save: snapshot.save,
    epoch: snapshot.epoch,
    setSave,
    saveError: error,
  };
}
