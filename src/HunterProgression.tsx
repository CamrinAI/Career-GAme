import { ArrowRight, BookOpen, Check, Flame, LockKeyhole, Shield, Sparkles, Trophy, Zap } from 'lucide-react';
import type { Save } from './engine';
import { isPerkUnlocked, milestones, nextObjective, perkFor, perks, rankFor, type PerkId } from './progression';

export function ObjectiveCard({ save, onContinue }: { save: Save; onContinue: () => void }) {
  const objective = nextObjective(save);
  const rank = rankFor(save);
  return <section className="objective-card panel" aria-label="Your next objective">
    <div className="objective-emblem"><span>{rank.rank}</span><Shield size={41}/></div>
    <div className="objective-copy"><div className="eyebrow">{objective.destination === 'profile' ? 'CITADEL CHAPTER COMPLETE' : 'YOUR NEXT OBJECTIVE'}</div>
      <h2>{objective.title}</h2><p>{objective.detail}</p><span className="objective-reward"><Sparkles size={12}/>{objective.reward}</span>
    </div>
    <button className="primary" onClick={onContinue}>{objective.button}<ArrowRight size={16}/></button>
  </section>;
}

export function RankProgress({ save }: { save: Save }) {
  const { rank } = rankFor(save);
  const trial = save.rewards.includes('trial');
  const tasks = rank === 'E'
    ? [{ label: 'Complete all four Academy lessons', done: save.completed.length === 4, progress: `${save.completed.length}/4 lessons` }]
    : [{ label: 'Complete a Mastery Trial at any score', done: trial, progress: trial ? 'Complete' : 'Not yet complete' }, { label: 'Defeat the IAM Warden', done: save.wins > 0, progress: save.wins > 0 ? 'Complete' : 'Not yet complete' }];
  return <section className="rank-progress panel" aria-label="Hunter rank progression">
    <div className="rank-progress-heading"><div><div className="eyebrow">YOUR NEXT ASCENSION</div><h2>{rank === 'C' ? 'You are a Cloud Warden.' : rank === 'E' ? 'The apprentice awakens.' : 'Claim the Citadel.'}</h2></div>
      <div className="rank-step"><b>{rank}</b>{rank !== 'C' && <><ArrowRight size={16}/><b>{rank === 'E' ? 'D' : 'C'}</b></>}</div>
    </div>
    {rank === 'C' ? <p>All current ascension milestones are complete. B, A, and S ranks await future chapters. Your real-world certification journey is separate.</p>
      : <div className="rank-requirements">{tasks.map(task => <div key={task.label}><span className={task.done ? 'requirement-check done' : 'requirement-check'}>{task.done ? <Check size={14}/> : <span/>}</span><span>{task.label}</span><small>{task.progress}</small></div>)}</div>}
    <p className="rank-note">Fictional Hunter ranks reward learning milestones. No perfect score, timed trial, or certification is required.</p>
  </section>;
}

export function PerkArmory({ save, onEquip }: { save: Save; onEquip: (id: PerkId) => void }) {
  const equipped = perkFor(save.equippedPerk);
  const icons = { 'aegis-weave': Shield, 'focused-core': Zap, 'warden-sigil': Flame, none: Shield };
  return <section className="perk-armory" aria-labelledby="armory-title">
    <div className="section-heading"><div><div className="eyebrow">TURN MILESTONES INTO POWER</div><h2 id="armory-title" tabIndex={-1}>Hunter armory</h2></div><span>ONE PASSIVE PERK AT A TIME</span></div>
    <div className="loadout-summary panel"><Shield size={21}/><div><strong>Equipped: {equipped.name}</strong><p>{equipped.description} Changes apply when you start your next battle.</p></div>
      {save.equippedPerk !== 'none' && <button className="text-button" onClick={() => onEquip('none')}>Use unmodified core</button>}
    </div>
    <div className="perk-grid">{perks.filter(perk => perk.id !== 'none').map(perk => {
      const unlocked = isPerkUnlocked(save, perk.id);
      const selected = save.equippedPerk === perk.id;
      const Icon = icons[perk.id];
      return <article key={perk.id} className={`perk-card panel ${selected ? 'equipped' : ''} ${unlocked ? 'unlocked' : 'locked'}`}>
        <div className="perk-top"><div className="perk-icon"><Icon size={23}/></div><span className={`tag ${selected ? 'teal-tag' : unlocked ? 'purple-tag' : ''}`}>{selected ? 'EQUIPPED' : unlocked ? 'UNLOCKED' : <><LockKeyhole size={10}/> LOCKED</>}</span></div>
        <h3>{perk.name}</h3><p>{perk.description}</p><div className="perk-requirement">{unlocked ? <Check size={13}/> : <LockKeyhole size={13}/>}<span>{perk.requirement}</span></div>
        <button className="secondary" aria-pressed={selected} aria-label={`${selected ? 'Equipped' : unlocked ? 'Equip' : 'Locked'} ${perk.name}`} disabled={!unlocked || selected} onClick={() => onEquip(perk.id)}>{selected ? <><Check size={14}/> Equipped</> : unlocked ? <>Equip perk <ArrowRight size={14}/></> : 'Keep growing to unlock'}</button>
      </article>;
    })}</div>
  </section>;
}

export function MilestoneJournal({ save }: { save: Save }) {
  const entries = milestones(save);
  return <section className="milestone-journal panel" aria-labelledby="milestones-title">
    <div className="section-heading"><div><div className="eyebrow">YOUR STORY SO FAR</div><h2 id="milestones-title">Milestone journal</h2></div><span>{entries.filter(entry => entry.earned).length} / {entries.length} EARNED</span></div>
    {entries.map(entry => <div className={`milestone-row ${entry.earned ? 'earned' : ''}`} key={entry.id}>
      <span className="milestone-icon">{entry.earned ? <Trophy size={19}/> : <BookOpen size={18}/>}</span><div><h3>{entry.title}</h3><p>{entry.detail}</p><span>{entry.reward}</span></div><span className="milestone-status">{entry.earned ? <><Check size={12}/> Earned</> : 'In progress'}</span>
    </div>)}<p className="rank-note">XP and mastery rewards are earned once per milestone. Revisit lessons and replay battles as often as you like.</p>
  </section>;
}
