# Quest Rank · v0.2.1

An original solo-first cyber-fantasy learning RPG. Learn identity and access fundamentals in Hunter Academy, practice with explanations, and fight the IAM Warden in the Citadel of Identity.

## New in v0.2.1: Citadel field contracts

C-rank Hunters can complete three optional contracts by defeating the Warden with each earned perk. Each contract awards 75 XP and 25 mastery once. Completing all three unlocks the cosmetic **Citadel Vanguard** profile title; it does not change stats or grant a real credential. Contract buttons equip the required perk and start a new fight. Completed contracts remain replayable without repeated XP rewards.

Version 1 and version 2 saves migrate to version 3 with progress and equipped perks preserved. Older victories retain their rewards but are not assigned an invented perk history; contracts count new victories from this update. A victory that first earns C-rank can also complete its matching contract when that perk was already earned at battle start.

See `VALIDATION-V021.md` for the contract checks. The profile includes shortcuts to contracts and the armory.

## New in v0.2: The Hunter's ascent

- **Earned ranks:** E-rank starts your journey; four completed IAM lessons earn D-rank; the Academy, a completed trial at any score, and a Warden victory earn C-rank. B/A/S ranks and their career chapters remain future content. These fictional milestones do not represent exam readiness or credentials.
- **A visible next objective:** the Nexus directs you to your next incomplete lesson, then the trial, boss fight, and your unlocked perks. Academy navigation resumes the first incomplete lesson.
- **An optional passive loadout:** earn Aegis Weave after one lesson (+20 maximum HP), Focused Core after a trial (+20 starting SP), and Warden Sigil after a victory (+10 special damage). Equip one at a time in Hunter Profile. Bonuses apply when a battle starts; core commands remain available to everyone.
- **Milestone journal and reward feedback:** profile shows earned milestones and rank requirements; notifications celebrate new perks and ranks. Replay results explicitly distinguish repeat victories from first-clear rewards.
- **Save migration:** v1 saves migrate to v2 without losing earned XP, mastery, lessons, wins, names, or preferences. Existing players immediately retain credit for completed milestones; no perk is automatically equipped. Unearned or unknown perks are rejected when loading.

See `VALIDATION-V02.md` for this milestone's checks. `VALIDATION.md` records the earlier v0.1 milestone.

## Run locally

Requires Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Open the Local URL Vite prints (normally http://127.0.0.1:5173). For production:

```sh
npm test
npm run build
npm run preview
```

## What's playable

- Responsive Nexus, shared navigation and hunter profile.
- Four IAM lessons, one check each, saved completions, next lesson navigation and revisiting.
- Six-question randomized Mastery Trial from a twelve-question pool, with immediate explanations and full results review.
- Base Warden fight before passive perks: 120 hunter HP, 240 boss HP, 100 maximum SP; basic, special, defend, ultimate; stronger second phase at 120 boss HP; victory, defeat and replay.
- Correct answers deal damage and restore 20 SP. Incorrect answers spend any skill cost, deal no damage and trigger retaliation. Defend always works, reduces incoming damage by roughly 65% and restores 20 SP. Questions do not repeat until the deck is exhausted.
- Separate overall XP/level, career mastery, fictional rank and introductory readiness. Each lesson rewards 100 XP/100 mastery, first trial 150 XP/100 mastery, first Warden clear 300 XP/100 mastery. Rewards are once per milestone; replay is unlimited.
- Versioned browser-local saves, validated loading, save error messaging, explicit confirmed reset, reduced motion and optional synthesized sound. Battle state resets when leaving the arena or refreshing; earned progress persists.
- Cloud Sovereign roadmap: the IAM chapter is playable, other chapters are visibly planned. Future multiplayer, accounts, equipment unlocks and hybrid classes are not implemented.

## GitHub Pages

The included workflow tests and builds all PRs, and deploys pushes to `main` or the prototype feature branch. In repository Settings → Pages, choose **GitHub Actions** as the build source. For the first branch preview, the `github-pages` environment must permit `feat/quest-rank-prototype`. The workflow intentionally avoids auto-merging. Remove the feature branch from the deployment trigger after review.

Vite uses relative asset paths, so the build works under `/Career-GAme/`. There is no server or account requirement. Preview URL after successful Pages deployment: https://camrinai.github.io/Career-GAme/ (availability depends on repository Pages settings and workflow result).

## Architecture

- `src/main.tsx`: application shell, Nexus, lesson/trial flows, battle UI, profile and settings.
- `src/engine.ts`: pure battle rules, perk modifiers, v1/v2-to-v3 save migration, validation, victory/contract rewards and XP level helpers.
- `src/progression.ts`: derived Hunter ranks, perk catalog, unlock rules, milestones and next objectives.
- `src/HunterProgression.tsx`: objective card, rank progress, perk armory and milestone journal.
- `src/Contracts.tsx`: contract board, challenge shortcuts and cosmetic title controls.
- `src/content.ts`: typed educational data, roadmap and official source links.
- `src/Scenery.tsx`: original replaceable SVG citadel and Warden illustrations.
- `src/styles.css`: shared design tokens, responsive layouts, effects and reduced motion.
- `tests/engine.test.ts`, `tests/progression.test.ts` and `tests/contracts.test.ts`: battle outcomes, perk effects, unlock rules, ranks, saves, migration, reset and reward limits.

The renderer uses lightweight React/SVG/CSS instead of Phaser in this prototype. The independent battle engine supports a later renderer migration. All illustrations and effects are original; no proprietary game assets are included. Fonts use Google Fonts with system fallbacks. No credentials are needed or included.

## Educational scope

Independent learning aid, not endorsed by AWS. Ranks are fictional; no certification or employment outcome is granted or promised. Introductory practice is not a readiness assessment for the complete exam. Sources are linked in the lessons and below; check current official guides before preparing for an exam.

- [IAM roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)
- [Policy evaluation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html)
- [IAM best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [CloudTrail event history](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html)

Original project description is retained in `ORIGINAL_README.md`.
