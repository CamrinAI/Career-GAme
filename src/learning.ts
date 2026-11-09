import { questions } from "./content.ts";
import type { Save } from "./engine.ts";
export type PracticeEntry = {
  attempts: number;
  correct: number;
  lastAnswer: number;
};
export type PracticeRecord = Record<string, PracticeEntry>;
export function parsePractice(value: unknown): PracticeRecord {
  const parsed: PracticeRecord = {};
  if (!value || typeof value !== "object" || Array.isArray(value))
    return parsed;
  for (const question of questions) {
    const entry = (value as Record<string, unknown>)[question.id] as
      Partial<PracticeEntry> | undefined;
    if (
      !entry ||
      !Number.isInteger(entry.attempts) ||
      Number(entry.attempts) < 1 ||
      !Number.isInteger(entry.correct) ||
      Number(entry.correct) < 0 ||
      Number(entry.correct) > Number(entry.attempts) ||
      !Number.isInteger(entry.lastAnswer) ||
      Number(entry.lastAnswer) < 0 ||
      Number(entry.lastAnswer) >= question.options.length
    )
      continue;
    const attempts = Math.min(10000, Number(entry.attempts));
    parsed[question.id] = {
      attempts,
      correct: Math.min(attempts, Number(entry.correct)),
      lastAnswer: Number(entry.lastAnswer),
    };
  }
  return parsed;
}
export function recordAnswer(save: Save, id: string, answer: number): Save {
  const question = questions.find((item) => item.id === id);
  if (
    !question ||
    !Number.isInteger(answer) ||
    answer < 0 ||
    answer >= question.options.length
  )
    return save;
  const old = save.practice[id] ?? {
    attempts: 0,
    correct: 0,
    lastAnswer: answer,
  };
  if (old.attempts >= 10000)
    return {
      ...save,
      practice: { ...save.practice, [id]: { ...old, lastAnswer: answer } },
    };
  return {
    ...save,
    practice: {
      ...save.practice,
      [id]: {
        attempts: old.attempts + 1,
        correct: old.correct + (answer === question.answer ? 1 : 0),
        lastAnswer: answer,
      },
    },
  };
}
export const reviewQuestions = (save: Pick<Save, "practice">) =>
  questions.filter(
    (question) =>
      save.practice[question.id] &&
      save.practice[question.id].lastAnswer !== question.answer,
  );
export function studySummary(save: Pick<Save, "practice">) {
  const records = Object.values(save.practice);
  return {
    attempts: records.reduce((sum, entry) => sum + entry.attempts, 0),
    correct: records.reduce((sum, entry) => sum + entry.correct, 0),
    seen: records.length,
    review: reviewQuestions(save).length,
  };
}
