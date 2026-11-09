# Quest Rank v0.2 · The Hunter's ascent

## Automated validation

- 28 tests pass, including v1-to-v2 save migration, malformed saves, earned perk persistence, rejection of locked/unknown perks, exact rank milestones, next objective routing, journal completion, bonus replacement rather than stacking, correct/incorrect special attacks, and first-clear reward limits.
- TypeScript checking and Vite production build pass.

## Browser validation

- Existing v0.1 test save retained its 550 XP, level 2, one completed lesson, trial personal best, and Warden victory. Newly earned perks appeared unlocked without a surprise auto-equip.
- Separate fresh browser origin began with E-rank, zero XP, and all three passive perks locked.
- Completing the first lesson unlocked Aegis Weave. Equipping it started the arena at 140/140 HP. The equipped perk survived refresh.
- Completing all four lessons earned D-rank and updated the Nexus objective to the Mastery Trial. Academy resumed the next incomplete lesson rather than returning to lesson one.
- A deliberately zero-score trial still unlocked Focused Core and awarded the one-time 150 XP/100 mastery reward; explanations remained available for review.
- Focused Core began a new battle at 40 SP. A tactical victory earned C-rank, Warden Sigil, and first-clear rewards, reaching 850 XP and 600 mastery.
- The journal showed all five milestones earned. C-rank and equipped Warden Sigil survived refresh.
- Warden Sigil dealt 75 damage on correct specials; a second victory left XP at 850 and explicitly reported that first-clear rewards were already earned.

- Desktop (1280 pixels), phone (390 pixels) and narrow-phone (320 pixels) layouts checked. Nexus, profile, and armory have no horizontal overflow; perk cards stack cleanly on phones.

## Scope and delivery

Same feature branch and PR #1 preserve the unmerged prototype review. Delivery uses the existing GitHub Pages workflow on this branch: https://camrinai.github.io/Career-GAme/. Deployment verification is recorded in the PR and delivery summary. Existing base commands remain available. Only one perk can be equipped; bonuses are captured at battle start. No account, credential verification, multiplayer, or new educational chapter is added in this milestone.
