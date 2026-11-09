export const XP_PER_LEVEL = 300;
const validXP = (xp: number) =>
  Number.isFinite(xp) ? Math.max(0, Math.floor(xp)) : 0;
export const levelFor = (xp: number) =>
  1 + Math.floor(validXP(xp) / XP_PER_LEVEL);
export function levelProgress(xp: number) {
  const total = validXP(xp);
  const level = levelFor(total);
  const current = total % XP_PER_LEVEL;
  return {
    total,
    level,
    next: level + 1,
    current,
    required: XP_PER_LEVEL,
    remaining: XP_PER_LEVEL - current,
    percentage: (current / XP_PER_LEVEL) * 100,
  };
}
export function levelGain(
  before: { xp: number; epoch: string },
  after: { xp: number; epoch: string },
) {
  if (before.epoch !== after.epoch) return null;
  const from = levelFor(before.xp),
    to = levelFor(after.xp);
  return to > from
    ? {
        from,
        to,
        levels: to - from,
        xpGained: validXP(after.xp) - validXP(before.xp),
      }
    : null;
}
