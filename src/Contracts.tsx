import { ArrowRight, Check, LockKeyhole, Shield, Sparkles, Swords, Trophy } from 'lucide-react';
import type { Save } from './engine';
import { contracts, contractsComplete, perkFor, rankFor, type PerkId } from './progression';

export function ContractBoard({save,onChallenge,onTitle}:{save:Save;onChallenge:(perk:PerkId)=>void;onTitle:(title:'class'|'citadel-vanguard')=>void}) {
 const available=rankFor(save).rank==='C';
 const complete=contractsComplete(save);
 return <section className="contract-board" aria-labelledby="contracts-title">
  <div className="section-heading"><div><div className="eyebrow">A NEW REASON TO RETURN</div><h2 id="contracts-title" tabIndex={-1}>Citadel field contracts</h2></div><span>{save.clearedContracts.length} / 3 COMPLETE</span></div>
  <p className="contract-intro">{available?'Explore a different strategy with each perk. Each contract grants 75 XP and 25 mastery once; repeat victories remain open.':'Earn C-rank by completing the Academy, a trial, and a Warden victory to unlock these optional contracts.'} Wins from earlier versions keep their original rewards; contracts track new victories from this update.</p>
  <div className="contract-grid">{contracts.map(contract=>{
   const done=save.clearedContracts.includes(contract.id);
   return <article className={`contract-card panel ${done?'completed':''}`} key={contract.id}>
    <div className="contract-top"><span className="contract-seal">{done?<Check size={23}/>:<Swords size={23}/>}</span><span className={`tag ${done?'teal-tag':available?'purple-tag':''}`}>{done?'COMPLETE':available?'AVAILABLE':'C-RANK REQUIRED'}</span></div>
    <h3>{contract.name}</h3><p>{contract.detail}</p><span className="contract-perk"><Shield size={13}/>{perkFor(contract.perk).name}</span><div className="contract-reward"><Sparkles size={13}/>{done?'75 XP + 25 mastery earned':'+75 XP · +25 mastery'}</div>
    <button className="secondary" disabled={!available} onClick={()=>onChallenge(contract.perk)}>{!available?<><LockKeyhole size={13}/> Ascend to C-rank</>:<>{done?'Replay with this perk':'Equip & challenge'}<ArrowRight size={14}/></>}</button>
   </article>;
  })}</div>
  <div id="title-reward" className={`title-reward panel ${complete?'unlocked':''}`}><span className="title-emblem"><Trophy size={29}/></span><div><div className="eyebrow">COSMETIC TITLE · {complete?'UNLOCKED':'3 CONTRACTS REQUIRED'}</div><h3>Citadel Vanguard</h3><p>{complete?'All three field contracts cleared. Wear your earned title on your Hunter Profile.':'Complete all three field contracts to unlock this optional profile title. It does not change stats or represent a real credential.'}</p></div>
  <button className="secondary" disabled={!complete} aria-pressed={save.cosmeticTitle==='citadel-vanguard'} onClick={()=>onTitle(save.cosmeticTitle==='citadel-vanguard'?'class':'citadel-vanguard')}>{!complete?'Title locked':save.cosmeticTitle==='citadel-vanguard'?'Remove title':'Equip title'}</button></div>
 </section>;
}
