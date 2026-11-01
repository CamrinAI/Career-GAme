import { parseSave, type Save } from "./engine.ts";
export function encodeBackup(save: Save): string {
  return JSON.stringify({ app: "quest-rank", format: 1, save }, null, 2);
}
export function decodeBackup(raw: string): Save {
  if (raw.length > 262144)
    throw new Error(
      "This backup is too large. Choose a Quest Rank backup under 256 KB.",
    );
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(
      "This file is not valid JSON. Choose a downloaded Quest Rank backup.",
    );
  }
  const s = data?.save;
  if (
    data?.app !== "quest-rank" ||
    data?.format !== 1 ||
    !s ||
    ![1, 2, 3, 4].includes(s.version) ||
    typeof s.xp !== "number" ||
    !Number.isFinite(s.xp) ||
    s.xp < 0 ||
    typeof s.mastery !== "number" ||
    !Array.isArray(s.completed) ||
    !Array.isArray(s.rewards) ||
    typeof s.name !== "string"
  )
    throw new Error(
      "This is not a supported Quest Rank backup. Your current progress has not changed.",
    );
  return parseSave(JSON.stringify(s));
}
export function downloadBackup(save: Save) {
  const url = URL.createObjectURL(
    new Blob([encodeBackup(save)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "quest-rank-save.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
