import { Shield, Sparkles, Swords, Zap } from "lucide-react";
import type { Action } from "./engine";
export type BattleCue = {
  serial: number;
  action: Action;
  correct: boolean;
  damage: number;
  hpLoss: number;
  phaseShift: boolean;
};
export function BattleEffects({ cue }: { cue: BattleCue | null }) {
  if (!cue) return null;
  const kind =
    cue.action === "defend" ? "guard" : !cue.correct ? "counter" : cue.action;
  const Icon =
    kind === "guard"
      ? Shield
      : kind === "ultimate"
        ? Sparkles
        : kind === "special"
          ? Zap
          : Swords;
  return (
    <div
      key={cue.serial}
      className={`battle-effects ${kind}`}
      aria-hidden="true"
    >
      <div className="energy-trail" />
      <div className="skill-flash">
        <Icon size={35} />
        <strong>
          {kind === "guard"
            ? "AEGIS GUARD"
            : kind === "counter"
              ? "COUNTERATTACK"
              : kind === "ultimate"
                ? "IDENTITY RUPTURE"
                : kind === "special"
                  ? "ARC NOVA"
                  : "ARC STRIKE"}
        </strong>
      </div>
      {cue.damage > 0 && (
        <span className="damage-pop boss-damage">−{cue.damage}</span>
      )}
      <span className="damage-pop hunter-damage">−{cue.hpLoss}</span>
      {cue.phaseShift && (
        <div className="phase-warning">PHASE II · THE WARDEN AWAKENS</div>
      )}
    </div>
  );
}
