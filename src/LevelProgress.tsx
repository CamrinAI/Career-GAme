import { Sparkles } from "lucide-react";
import { levelProgress } from "./leveling";
export function LevelProgress({
  xp,
  compact = false,
}: {
  xp: number;
  compact?: boolean;
}) {
  const p = levelProgress(xp);
  const bar = (
    <div
      className="level-xp-track"
      role="progressbar"
      aria-label={`XP toward level ${p.next}`}
      aria-valuenow={p.current}
      aria-valuemin={0}
      aria-valuemax={p.required}
      aria-valuetext={`${p.current} of ${p.required} XP; ${p.remaining} XP needed for level ${p.next}`}
    >
      <span style={{ width: `${p.percentage}%` }} />
    </div>
  );
  if (compact)
    return (
      <div className="header-level" aria-label="Player level">
        <strong>LV. {p.level}</strong>
        <div>
          {bar}
          <small>
            {p.current} / {p.required} XP
          </small>
        </div>
      </div>
    );
  return (
    <section
      className="panel player-level"
      aria-label="Character level progress"
    >
      <div className="player-level-badge">
        <Sparkles size={18} />
        <strong>{p.level}</strong>
        <small>LEVEL</small>
      </div>
      <div className="player-level-body">
        <div className="player-level-heading">
          <div>
            <span className="eyebrow">YOUR CHARACTER PROGRESS</span>
            <h2>
              Level {p.level} <span>→ Level {p.next}</span>
            </h2>
          </div>
          <b>{p.total.toLocaleString()} total XP</b>
        </div>
        {bar}
        <div className="player-level-numbers">
          <strong>
            {p.current} / {p.required} XP
          </strong>
          <span>
            <b>{p.remaining} XP</b> to your next level
          </span>
        </div>
        <details className="level-rewards">
          <summary>How do I earn XP?</summary>
          <p>
            First completion rewards: lessons +100 XP each · Mastery Trial +150
            XP · IAM Warden +300 XP · first Rift Raid victory +150 XP · each
            unlocked perk contract +75 XP. Replaying completed rewards keeps
            your progress without farming XP.
          </p>
          <p>
            Every 300 XP earns a character level. Hunter rank and abilities
            follow your campaign milestones.
          </p>
        </details>
      </div>
    </section>
  );
}
