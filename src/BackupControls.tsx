import { useRef, useState } from "react";
import { Download, Upload, Check } from "lucide-react";
import { decodeBackup, downloadBackup } from "./backup";
import { levelFor, type Save } from "./engine";
export function BackupControls({
  save,
  onRestore,
}: {
  save: Save;
  onRestore: (save: Save) => void;
}) {
  const [pending, setPending] = useState<Save | null>(null),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  async function readFile(file?: File) {
    setPending(null);
    setError("");
    setMessage("");
    if (!file) return;
    try {
      if (file.size > 262144)
        throw new Error("Choose a Quest Rank backup smaller than 256 KB.");
      setPending(decodeBackup(await file.text()));
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "This backup could not be read.",
      );
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }
  return (
    <section className="backup-controls" aria-labelledby="backup-title">
      <h3 id="backup-title">Keep your progress with you.</h3>
      <p>
        Download a backup before switching devices or clearing browser data. The
        file contains your game progress and Hunter name.
      </p>
      <button
        className="secondary"
        onClick={() => {
          downloadBackup(save);
          setMessage(
            "Backup download requested. Keep the JSON file somewhere you can find it.",
          );
        }}
      >
        <Download size={15} /> Download progress backup
      </button>
      <label className="backup-label">
        <Upload size={15} /> Choose a backup to restore
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          aria-label="Choose progress backup"
          onChange={(event) => void readFile(event.target.files?.[0])}
        />
      </label>
      {message && (
        <p className="backup-message" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="backup-error" role="alert">
          {error}
        </p>
      )}
      {pending && (
        <div className="backup-preview">
          <strong>Review this backup</strong>
          <p>
            {pending.name} · Level {levelFor(pending.xp)} · {pending.xp} XP
            <br />
            {pending.completed.length}/4 lessons · {pending.wins} victories
          </p>
          <p>
            Restoring replaces the progress currently saved on this browser.
            Download your current backup first if you want to keep both.
          </p>
          <div className="button-row">
            <button className="primary" onClick={() => onRestore(pending)}>
              <Check size={14} /> Replace with this backup
            </button>
            <button className="secondary" onClick={() => setPending(null)}>
              Cancel restore
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
