# Quest Rank · v0.1

An original solo-first cyber-fantasy learning RPG. Learn identity and access fundamentals in Hunter Academy, practice with explanations, and fight the IAM Warden in the Citadel of Identity.

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
- Warden fight: 120 hunter HP, 240 boss HP, 100 maximum SP; basic, special, defend, ultimate; stronger second phase at 120 boss HP; victory, defeat and replay.
- Correct answers deal damage and restore 20 SP. Incorrect answers spend any skill cost, deal no damage and trigger retaliation. Defend always works, reduces incoming damage by roughly 65% and restores 20 SP. Questions do not repeat until the deck is exhausted.
- Separate overall XP/level, career mastery, fictional rank and introductory readiness. Each lesson rewards 100 XP/100 mastery, first trial 150 XP/100 mastery, first Warden clear 300 XP/100 mastery. Rewards are once per milestone; replay is unlimited.
- Versioned browser-local saves, validated loading, save error messaging, explicit confirmed reset, reduced motion and optional synthesized sound. Battle state resets when leaving the arena or refreshing; earned progress persists.
- Cloud Sovereign roadmap: the IAM chapter is playable, other chapters are visibly planned. Future multiplayer, accounts, equipment unlocks and hybrid classes are not implemented.

## GitHub Pages

The included workflow tests and builds all PRs, and deploys pushes to `main` or the prototype feature branch. In repository Settings → Pages, choose **GitHub Actions** as the build source. For the first branch preview, the `github-pages` environment must permit `feat/quest-rank-prototype`. The workflow intentionally avoids auto-merging. Remove the feature branch from the deployment trigger after review.

Vite uses relative asset paths, so the build works under `/Career-GAme/`. There is no server or account requirement. Preview URL after successful Pages deployment: https://camrinai.github.io/Career-GAme/ (availability depends on repository Pages settings and workflow result).

## Architecture

- `src/main.tsx`: application shell, Nexus, lesson/trial flows, battle UI, profile and settings.
- `src/engine.ts`: pure battle rules, save validation, rewards and progression helpers.
- `src/content.ts`: typed educational data, roadmap and official source links.
- `src/Scenery.tsx`: original replaceable SVG citadel and Warden illustrations.
- `src/styles.css`: shared design tokens, responsive layouts, effects and reduced motion.
- `tests/engine.test.ts`: battle outcomes, resources, progression, saves, resets and content integrity.

The renderer uses lightweight React/SVG/CSS instead of Phaser in this prototype. The independent battle engine supports a later renderer migration. All illustrations and effects are original; no proprietary game assets are included. Fonts use Google Fonts with system fallbacks. No credentials are needed or included.

## Educational scope

Independent learning aid, not endorsed by AWS. Ranks are fictional; no certification or employment outcome is granted or promised. Introductory practice is not a readiness assessment for the complete exam. Sources are linked in the lessons and below; check current official guides before preparing for an exam.

- [IAM roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)
- [Policy evaluation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html)
- [IAM best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [CloudTrail event history](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html)

Original project description is retained in `ORIGINAL_README.md`.
