import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newBattle,resolveTurn,freshSave,parseSave,reward,levelFor} from '../src/engine.ts';
import {questions,lessons} from '../src/content.ts';
test('correct attacks deal damage, restore energy and trigger retaliation',()=>{const s=resolveTurn(newBattle(),'attack',true);assert.equal(s.boss,210);assert.equal(s.hp,102);assert.equal(s.sp,40);});
test('incorrect attacks deal no damage and receive a counterattack',()=>{const s=resolveTurn(newBattle(),'attack',false);assert.equal(s.boss,240);assert.equal(s.hp,102);assert.equal(s.sp,20);});
test('special costs energy even on an incorrect answer',()=>{const s=resolveTurn({...newBattle(),sp:50},'special',false);assert.equal(s.sp,20);assert.equal(s.boss,240);assert.equal(s.hp,102);});
test('defend reduces damage and restores SP without a question',()=>{const s=resolveTurn(newBattle(),'defend');assert.equal(s.hp,114);assert.equal(s.sp,40);assert.equal(s.boss,240);});
test('cannot spend unavailable energy',()=>{const s=newBattle();assert.equal(resolveTurn(s,'ultimate'),s);assert.equal(resolveTurn(s,'special'),s);});
test('crossing half HP activates the stronger second phase',()=>{const s=resolveTurn({...newBattle(),boss:130},'attack');assert.equal(s.phase,2);assert.equal(s.hp,94);});
test('ultimate consumes energy and deals large damage',()=>{const s=resolveTurn({...newBattle(),sp:100},'ultimate');assert.equal(s.boss,130);assert.equal(s.sp,50);});
test('lethal hit wins without enemy retaliation',()=>{const s=resolveTurn({...newBattle(),boss:30,hp:1},'attack');assert.equal(s.status,'victory');assert.equal(s.hp,1);assert.equal(s.boss,0);assert.equal(resolveTurn(s,'attack'),s);});
test('wrong answers can cause defeat and terminal turns are ignored',()=>{let s=newBattle();for(let i=0;i<7;i++)s=resolveTurn(s,'attack',false);assert.equal(s.status,'defeat');assert.equal(s.hp,0);assert.equal(resolveTurn(s,'defend'),s);});
test('a tactical victory is possible with correct answers',()=>{let s=newBattle();for(const a of ['attack','special','special','defend','special','attack'] as const){s=resolveTurn(s,a,true);}assert.equal(s.status,'victory');assert.ok(s.hp>0);});
test('resources remain bounded over many defensive turns',()=>{let s=newBattle();for(let i=0;i<30;i++)s=resolveTurn(s,'defend');assert.ok(s.hp>=0);assert.ok(s.sp<=100);});
test('versioned saves round trip and corrupt/unknown saves recover safely',()=>{const s={...freshSave(),xp:450,completed:[0,2],sound:true};assert.deepEqual(parseSave(JSON.stringify(s)),s);for(const raw of ['garbage','null','{"version":4}'])assert.deepEqual(parseSave(raw),freshSave());});
test('save validation removes invalid completion values and clamps bad counters',()=>{const s=parseSave(JSON.stringify({version:1,xp:-4,completed:[0,0,3,4,'1',-1],mastery:99999,trialBest:80,wins:'bad',sound:'true'}));assert.deepEqual(s.completed,[0,3]);assert.equal(s.xp,0);assert.equal(s.mastery,1000);assert.equal(s.trialBest,6);assert.equal(s.sound,false);});
test('rewards are idempotent and character XP is separate from mastery',()=>{const s=reward(freshSave(),'lesson-0',100,100);assert.equal(reward(s,'lesson-0',100,100),s);const t=reward(s,'warden',300,100);assert.equal(t.xp,400);assert.equal(t.mastery,200);assert.equal(levelFor(t.xp),2);});
test('reset starts an entirely fresh save',()=>{const s=reward(freshSave(),'warden',300,100);assert.equal(s.rewards.length,1);assert.deepEqual(freshSave().rewards,[]);assert.equal(freshSave().xp,0);});
test('educational content has four lessons, varied questions and valid explanations',()=>{assert.equal(lessons.length,4);assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);for(let i=0;i<4;i++)assert.ok(questions.filter(q=>q.lesson===i).length>=3);for(const q of questions){assert.ok(q.answer>=0&&q.answer<q.options.length);assert.ok(q.explanation.length>30);}});

test('legacy v1 saves migrate without dropping progress or settings',()=>{
 const legacy={version:1,xp:850,mastery:600,completed:[0,1,2,3],trialBest:4,wins:2,rewards:['lesson-0','lesson-1','lesson-2','lesson-3','trial','warden'],sound:true,reduced:true,name:'Legacy Hunter',experience:'Some hands-on experience'};
 const migrated=parseSave(JSON.stringify(legacy));
 assert.deepEqual(migrated,{...legacy,version:3,equippedPerk:'none',clearedContracts:[],cosmeticTitle:'class'});
 assert.deepEqual(parseSave(JSON.stringify(migrated)),migrated);
});
test('unknown future save versions recover safely',()=>assert.deepEqual(parseSave('{"version":99}'),freshSave()));
test('valid earned perks survive reload; locked and unknown perks are removed',()=>{
 for(const id of ['aegis-weave','focused-core','warden-sigil']){
  const s={...freshSave(),completed:[0,1,2,3],rewards:['trial','warden'],wins:1,equippedPerk:id};
  assert.equal(parseSave(JSON.stringify(s)).equippedPerk,id);
  assert.equal(parseSave(JSON.stringify({...freshSave(),equippedPerk:id})).equippedPerk,'none');
 }
 assert.equal(parseSave(JSON.stringify({...freshSave(),equippedPerk:'made-up-perk'})).equippedPerk,'none');
});
test('Aegis Weave adds 20 maximum HP without changing damage',()=>{
 const s=newBattle('aegis-weave');assert.equal(s.hp,140);assert.equal(s.maxHp,140);
 const next=resolveTurn(s,'attack');assert.equal(next.hp,122);assert.equal(next.boss,210);
});
test('Focused Core starts with additional energy and still obeys the cap',()=>{
 let s=newBattle('focused-core');assert.equal(s.sp,40);assert.equal(s.hp,120);
 s=resolveTurn(s,'special');assert.equal(s.sp,30);assert.equal(s.boss,175);
 for(let i=0;i<4;i++)s=resolveTurn(s,'defend');assert.equal(s.sp,100);
});
test('Warden Sigil only boosts correctly answered special attacks',()=>{
 const s={...newBattle('warden-sigil'),sp:100};
 assert.equal(resolveTurn(s,'special',true).boss,165);
 assert.equal(resolveTurn(s,'special',false).boss,240);
 assert.equal(resolveTurn(s,'attack',true).boss,210);
 assert.equal(resolveTurn(s,'ultimate',true).boss,130);
});
test('starting a different loadout replaces the bonus rather than stacking perks',()=>{
 const previous=newBattle('aegis-weave');
 const next=newBattle('focused-core');
 assert.equal(previous.maxHp,140);assert.equal(previous.sp,20);
 assert.equal(next.maxHp,120);assert.equal(next.hp,120);assert.equal(next.sp,40);assert.equal(next.specialBonus,0);
});
