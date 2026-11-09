# Quest Rank · Class Cosmetics 1.6.0

A solo-first pixel adventure learning RPG. Awaken a Cloud Initiate, study identity and access fundamentals, review mistakes, and challenge the IAM Warden in the Citadel of Identity.

**Play:** https://camrinai.github.io/Career-GAme/

**Review:** https://github.com/CamrinAI/Career-GAme/pull/1

The original five-sprint IAM release and 2–4 player cross-career Rift Raids now share an original pixel-art presentation. This release adds stepped sprite animation, moonlit tile scenery, pixel hint companions, party sprites in raids, action-specific combat motion, an ultimate cut-in and a replay-animation control. Pyxel is a visual reference; the game remains React/TypeScript in the browser, with no Python installation. See `PIXEL-UPDATE.md` for details and validation. Complete non-cloud career curricula, accounts, guilds and free-roaming exploration remain future work.

The Neon Protocol update adds an orbital station/hangar, powered-armor sprites, cyan/magenta interface, target acquisition effects and live solo combat telemetry. See `NEON-UPDATE.md` for research, rationale and validation.

The Skybound graphics release follows the supplied visual reference: detailed floating islands, a new backpack adventurer, a blue-roof castle and waterfall, lavender window panels, green buttons and bold outlined progress cards. See `SKYBOUND-UPDATE.md` for research, assets and verification.

Skybound Orbit keeps the bright palette while adding a futuristic eco-station, space explorer suits, and a dedicated Nurse Sentinel medic model. Raid selection includes model thumbnails and a selected-character preview; the medic also renders through the shared raid character component. See `ORBIT-UPDATE.md`.

The class cosmetics update gives every role a distinct model: Cloud Warden cloud armor, Nurse Sentinel medic gear, Software Vanguard developer outfit and AI Arcanist neural coat with a separate animated holo assistant. Appearance descriptions and assets are shared through `src/appearances.ts`. See `CLASS-COSMETICS.md`.

## Run, test and build

Requires Node.js 24 and npm.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Vite prints the local URL. Production output is `dist/`, with relative assets for GitHub Pages subdirectory hosting. Solo play has no server, account, payment, or cloud-resource requirement. Multiplayer needs internet access to the deployed shared room service; players do not need an account.

## Rift Raids

Choose Cloud Warden, Nurse Sentinel, Software Vanguard, or AI Arcanist. Pick Prism Owl, Cipher Fox, or Lumen Sprite. Host or join an eight-character code, ready up, and coordinate strikes, shields and healing against a shared boss. Each role has six questions. Defeat the boss within six rounds. First victory earns 150 XP once, without granting IAM mastery or a solo clear. The service synchronizes decisions and results; brief refreshes reconnect this tab. The host must remain connected.

Nursing content covers fictional communication and general safety, not clinical care. The new roles are raid experiences, not complete professional training. See `RAID-UPDATE.md` for rules, privacy, sources, limitations and validation.

## Complete player journey

- **Career Pathfinder:** choose the available cloud path, name your Hunter, set your experience, review skill/project/certification guidance, and awaken. Existing players can revisit the flow without resetting progress.
- **Nexus:** original floating-citadel illustration, shared navigation, level/mastery/rank indicators, next objectives, and a reminder when concepts need review.
- **Hunter Academy:** four short IAM lessons, real-world examples, knowledge checks, immediate explanations, saved completion and links to official sources. The Academy resumes the first incomplete lesson.
- **Mastery Trial:** six randomized questions from a twelve-question pool. Any score counts toward the first-trial milestone; mistakes can be reviewed and practiced.
- **Practice Journal:** saved question attempts and last answers from lessons, trials, practice and combat. Target missed concepts or use mixed practice. Corrected concepts leave the review queue while history remains. Practice history is not an exam-readiness estimate and does not farm XP.
- **Warden battle:** 120 base HP, 240 boss HP, SP, attack, special, tactical defense, ultimate, two phases, wrong-answer damage, victory, defeat and replay. Original Hunter/Warden SVG art and distinct action effects honor reduced motion. Questions do not repeat until the deck is exhausted; answer positions are shuffled.
- **Progression:** separate overall XP/level, career mastery and fictional ranks. Four lessons earn D-rank; the Academy, any completed trial and a victory earn C-rank. Higher ranks await future chapters.
- **Perks and contracts:** earn Aegis Weave (+20 HP), Focused Core (+20 starting SP) and Warden Sigil (+10 special damage); equip one for the next battle. Three optional C-rank contracts reward one victory per perk with 75 XP/25 mastery each. Completing all three unlocks the cosmetic Citadel Vanguard title.
- **Save controls:** versioned local saves with migrations from v1–v3; downloadable JSON backup, validated import with a review/replace step, explicit confirmed reset, optional synthesized sound and reduced-motion setting.

## Reward rules

Each lesson grants 100 XP/100 mastery once. The first completed trial grants 150 XP/100 mastery. The first Warden victory grants 300 XP/100 mastery. Each distinct contract grants 75 XP/25 mastery once. Replay remains available without repeated milestone rewards. A victory that earns C-rank may also complete the matching already-earned-perk contract. Earlier saves keep their earned progress but do not receive fabricated question or perk-victory histories.

## Saves and privacy

Progress is stored on this browser/device using the stable storage key `questrank.save.v1`; the data inside now uses schema version 4. Download a backup before switching devices or clearing browser data. Backups contain the Hunter name and game progress, with no password or cloud account credentials. Invalid backup files are rejected before replacement; restore shows a preview and requires the player to apply it. Active battles and unfinished trials restart on navigation/refresh; earned progress and question history persist.

## Architecture

- `src/raid.ts` / `src/RaidHall.tsx` / `src/useRaidRoom.ts`: pure cooperative rules, original pets, career questions, lobby and service synchronization.
- `room-service/worker.ts` / `room-service/drizzle`: authenticated room API, concurrency checks and schema migrations.
- `src/main.tsx`: app shell, Nexus, Academy, battle orchestration, settings and profile.
- `src/engine.ts`: pure combat, versioned saves, validation, XP/reward and victory rules.
- `src/content.ts`: typed lessons, questions, roadmap and source links.
- `src/learning.ts` / `src/Review.tsx`: durable practice records and focused review.
- `src/Quiz.tsx`: accessible shuffled answer presentation.
- `src/progression.ts` / `src/HunterProgression.tsx` / `src/Contracts.tsx`: rank/perk milestones, objectives, optional contracts and cosmetic title.
- `src/Pathfinder.tsx`: guided entry, experience selection and career guidance.
- `src/backup.ts` / `src/BackupControls.tsx`: portable saves, validation and reviewed restore.
- `src/Scenery.tsx` / `src/BattleEffects.tsx`: original replaceable SVG artwork and combat effects.
- `src/styles.css`: shared design system, responsive layouts and reduced motion.
- `tests/`: combat, progression, contracts, migrations, learning history, backup and reset checks.

Source is formatted for review. No third-party game assets or secrets are included. Google Fonts have system fallbacks. The replaceable combat renderer uses React/SVG/CSS instead of Phaser for this initial release.

## GitHub Pages delivery

The workflow tests/builds PRs and deploys `main` or `feat/quest-rank-prototype`. Pages uses GitHub Actions as its source. The `github-pages` environment permits the prototype branch and main. The PR remains unmerged; no automatic merge is configured. After review, remove the prototype branch from deployment triggers and the environment allowlist if it is no longer needed.

## Educational scope

Independent learning aid, not endorsed by AWS. Fictional ranks and titles do not grant certifications, establish exam readiness, or promise employment. The IAM chapter covers only part of a certification syllabus. Pathfinder guidance links to current official certification pages; any suggested foundational-to-architecture sequence is optional.

- [IAM roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)
- [Policy evaluation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html)
- [IAM best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [CloudTrail event history](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html)
- [Cloud Practitioner](https://aws.amazon.com/certification/certified-cloud-practitioner/)
- [Solutions Architect – Associate](https://aws.amazon.com/certification/certified-solutions-architect-associate/)

See `RELEASE-VALIDATION.md` and `SUGGESTED-UPDATES.md`. Earlier milestone notes remain as history. The original repository description is retained in `ORIGINAL_README.md`.

## AI playtest fixes (1.1.1)

Three independent AI playtesters covered solo progression, multiplayer/API behavior, and keyboard/UX flows. Confirmed save loss between tabs, skipped raid results/rewards, stale run commands, invalid request handling and focus/default-name issues were fixed. The release has 67 passing automated tests. Two AI players completed a cross-browser Safari/in-app-browser raid with the revised acknowledgement flow. See `PLAYTEST-REPORT.md` for coverage and remaining limits.

Progress mutations now rebase against the latest local save under a browser Web Lock when available; storage events synchronize other tabs. Explicit reset/restore creates a new local epoch and clears stale active sessions. Backup schema4 remains compatible. Raid debriefs require each member to acknowledge before the host advances/rematches; requests carry run/round scope. Authenticated readers can retrieve the final room snapshot after the host leaves, until room expiry.
