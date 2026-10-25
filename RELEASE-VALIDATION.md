# Initial IAM release · 1.0 verification

## Original sprint completion

| Sprint | Completed scope |
| --- | --- |
| 1 — Foundation | React, TypeScript, Vite, navigation, reusable controls, responsive cyber-fantasy Nexus, local/prod commands |
| 2 — Academy | Four IAM lessons, examples, checks, explanations, randomized trial, saved completion, persistent mistake journal and targeted review |
| 3 — Warden | Attack/special/defend/ultimate, HP/SP/damage, wrong-answer counterattacks, phase II, victory/defeat/replay, original animated feedback |
| 4 — Progression & polish | XP/level, career mastery, E/D/C rank milestones, six-rank roadmap, perks/contracts/cosmetic title, Pathfinder, sound/reduced motion, keyboard focus and mobile layouts |
| 5 — Verification & delivery | Automated rules/save tests, browser save/backup/reset/review/combat checks, responsive QA, reproducible production build and GitHub Pages pipeline |

This is the complete original IAM release scope, not all future campaign chapters or deferred social/3D features.

## Automated checks

46 tests pass. They cover combat resource limits, phase transitions, victory/defeat, reward idempotency, rank/perk/contract eligibility, save migrations, title validation, review-queue correction, malformed history, backup round-trip/rejection/migration, and reset defaults. TypeScript and the Vite production build pass.

## Browser evidence

- Fresh origin: guided path selection, Hunter name/experience, personalized guidance and awakening reached the Nexus.
- Learning: a wrong lesson answer entered the journal; targeted correction removed it from the review queue, retained 1/2 attempt history and did not grant extra XP. History survived refresh.
- Backup: a downloaded JSON file was produced; malformed JSON was rejected without modifying progress. A valid backup displayed a review/replace step and restored the correct Hunter, XP and lesson state.
- Reset: cancel preserved progress; confirmed reset returned to unawakened Pathfinder at 0 XP. The saved backup restored the local test character afterward. No public player save was reset.
- Combat: wrong answer caused a counterattack and 18 HP loss. Defense restored SP; an ultimate dealt 110 damage, a special crossed into phase II, and the player completed a victory. Saved question history remained intact.
- Accessibility: Escape closed settings and returned focus to Settings; reduced motion produced `animation-name: none`; browser console contained no errors in the checked flow.
- Layout: all six main screens (Nexus, Academy, Practice Journal, Pathfinder, Profile and Dungeon) had no horizontal overflow at 390 and 320 pixels. Desktop layout and the new original Hunter illustration were visually inspected.
- Previous milestone browser checks cover E/D/C ascension, all three perk effects, contracts, repeat reward limits and equipped title persistence.

## Delivery and limits

GitHub Pages deploys the existing review branch after its test/build checks. Public verification and workflow results are recorded in PR #1 and the delivery summary. Main is not merged automatically.

Deliberate limits: twelve practice questions, one playable chapter/boss, local-device saves, and restarting active fights/trials on navigation or refresh. Other Cloud Sovereign chapters, additional careers, accounts, guilds, 3D and co-op remain future work. React/SVG/CSS is used instead of Phaser; assets and combat rules are separated for later renderer replacement.
