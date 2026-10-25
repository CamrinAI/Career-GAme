import { contracts, contractsComplete, rankFor, isPerkUnlocked, perkFor, perks, type ContractId, type PerkId } from './progression.ts';
export type Action = 'attack'|'special'|'ultimate'|'defend';
export type Battle = {hp:number; maxHp:number; specialBonus:number; boss:number; sp:number; turn:number; phase:1|2; status:'active'|'victory'|'defeat'; log:string};
export const newBattle = (perkId:PerkId='none'):Battle=>{
 const perk=perkFor(perkId);
 return {hp:120+perk.hp,maxHp:120+perk.hp,specialBonus:perk.special,boss:240,sp:20+perk.sp,turn:1,phase:1,status:'active',log:'The Warden seals the gates. Choose your command.'};
};
export const cost = {attack:0,special:30,ultimate:70,defend:0};
export function resolveTurn(state:Battle,action:Action,correct=true):Battle {
 if(state.status!=='active'||state.sp<cost[action]) return state;
 const s={...state,turn:state.turn+1};
 if(action==='defend'){
  s.hp=Math.max(0,s.hp-(state.phase===2?9:6));s.sp=Math.min(100,s.sp+20);
  s.log='Aegis raised. Incoming damage reduced by 65%. +20 SP.';
 }else{
  s.sp-=cost[action];
  const damage=correct?({attack:30,special:65+state.specialBonus,ultimate:110}[action]):0;
  s.boss=Math.max(0,s.boss-damage);
  if(correct)s.sp=Math.min(100,s.sp+20);
  if(s.boss===0)return {...s,status:'victory',log:'The seal shatters. The Citadel is yours.'};
  s.phase=s.boss<=120?2:1;
  const retaliation=s.phase===2?26:18;
  s.hp=Math.max(0,s.hp-retaliation);
  s.log=correct?`${damage} damage dealt. +20 SP. Warden retaliates for ${retaliation} damage.`:`Your skill falters. Warden counters for ${retaliation} damage. Review the explanation and try again.`;
 }
 if(s.hp===0){s.status='defeat';s.log='Your shield falls. Knowledge endures. Review the Academy and challenge again.';}
 return s;
}
export type Save = {version:3;clearedContracts:ContractId[];cosmeticTitle:'class'|'citadel-vanguard';equippedPerk:PerkId;xp:number;mastery:number;completed:number[];trialBest:number;wins:number;rewards:string[];sound:boolean;reduced:boolean;name:string;experience:string};
export const freshSave=():Save=>({version:3,clearedContracts:[],cosmeticTitle:'class',equippedPerk:'none',xp:0,mastery:0,completed:[],trialBest:0,wins:0,rewards:[],sound:false,reduced:false,name:'Hunter',experience:'New to the cloud'});
export function parseSave(raw:string|null):Save{
 try{
 const s=JSON.parse(raw||'null');
 if(!s||(s.version!==1&&s.version!==2&&s.version!==3))return freshSave();
 const d=freshSave();
 for(const k of ['xp','mastery','trialBest','wins'] as const)if(typeof s[k]==='number'&&Number.isFinite(s[k]))d[k]=Math.max(0,Math.floor(s[k]));
 d.trialBest=Math.min(questionsCount,d.trialBest);d.mastery=Math.min(1000,d.mastery);
 d.completed=Array.isArray(s.completed)?[...new Set<number>(s.completed.filter((x:unknown)=>Number.isInteger(x)&&Number(x)>=0&&Number(x)<4))]:[];
 d.rewards=Array.isArray(s.rewards)?[...new Set<string>(s.rewards.filter((x:unknown)=>typeof x==='string'))]:[];
 d.sound=s.sound===true;d.reduced=s.reduced===true;
 d.name=typeof s.name==='string'?s.name.slice(0,24):d.name;
 d.experience=typeof s.experience==='string'?s.experience.slice(0,40):d.experience;
 if(s.version>=2&&perks.some(perk=>perk.id===s.equippedPerk)&&isPerkUnlocked(d,s.equippedPerk))d.equippedPerk=s.equippedPerk;
 if(s.version===3){
 d.clearedContracts=Array.isArray(s.clearedContracts)?contracts.filter(contract=>s.clearedContracts.includes(contract.id)).map(contract=>contract.id):[];
 if(s.cosmeticTitle==='citadel-vanguard'&&contractsComplete(d))d.cosmeticTitle='citadel-vanguard';
 }
 return d;
 }catch{return freshSave();}
}
const questionsCount=6;
export function reward(save:Save,key:string,xp:number,mastery:number):Save{
 if(save.rewards.includes(key))return save;
 return {...save,xp:save.xp+xp,mastery:Math.min(1000,save.mastery+mastery),rewards:[...save.rewards,key]};
}
export const levelFor=(xp:number)=>1+Math.floor(xp/300);
export function shuffled<T>(values:T[]):T[]{
 const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;
}

/** Credit a finished battle once; callers only invoke this on the active-to-victory transition. */
export function recordVictory(save:Save,perk:PerkId):Save {
 let updated=reward({...save,wins:save.wins+1},'warden',300,100);
 const contract=contracts.find(item=>item.perk===perk);
 if(contract&&rankFor(updated).rank==='C'&&isPerkUnlocked(save,perk)&&!save.clearedContracts.includes(contract.id)){
  updated=reward({...updated,clearedContracts:[...updated.clearedContracts,contract.id]},`contract-${contract.id}`,75,25);
 }
 return updated;
}
