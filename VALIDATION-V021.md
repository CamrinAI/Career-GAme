# v0.2.1 · Citadel field contracts

Implementation plan: keep the existing learning content, rank milestones and combat rules; add three optional C-rank replay goals, one-time XP/mastery rewards, an earned cosmetic title, and backward-compatible save migration. Continue the existing feature branch and PR; do not merge main.

## Passed

- 37 automated tests: combat, rank/perk rules, v1/v2 migration, contract eligibility, distinct completion, duplicate reward prevention, first C-rank victory, title validation/persistence and reset defaults.
- TypeScript check and production build pass.
- Existing v0.2 C-rank test save retained 850 XP and equipped perk, with zero invented contract completions.
- Browser: completed each of the three contracts using its required perk. XP progressed 850 → 925 → 1,000 → 1,075; mastery reached 675. The final result announced Citadel Vanguard.
- Browser: equipped Citadel Vanguard and refreshed; the title remained on the profile and all three contracts remained complete.
- Browser: replayed a completed contract; XP stayed 1,075 and no additional contract reward was displayed.
- Browser: lower-rank save had all contract challenge buttons and the title control disabled.
- Browser: desktop board at 1280 pixels and phone layouts at 390 and 320 pixels fit without horizontal overflow.

## Deliberate scope

No new academic content, boss, combat command, or higher career chapter is added. Contracts are optional, untimed, solo, and award each bonus once. Only the current chapter's C-rank is available; B/A/S remain planned. The title is cosmetic and does not represent certification readiness.

Delivery uses the existing GitHub Pages pipeline on feat/quest-rank-prototype; PR #1 remains open for review. Public deployment verification is recorded in the delivery message and PR checks.
