# Level Up · 1.7.0

Character leveling is now visible across the game. The header shows the current level and XP bar on every screen. Nexus and Hunter Profile include a prominent level badge, current/next level, total XP, progress within the level and exact XP still needed. An expandable reward guide explains the existing first-completion rewards. Progress bars include accessible values and text; motion respects reduced-motion settings.

The existing rule remains: Level 1 at 0 XP, then one level every 300 XP. At a threshold the level increases and the bar starts toward the following level. Total XP is preserved. For example, 550 total XP displays Level 2, 250/300 XP and 50 XP to Level 3.

A real XP gain that crosses one or more level boundaries triggers a dismissible level-up celebration. Simultaneous rank/perk unlocks are included in the same notice. Loading a save, restoring a backup or resetting progress does not invent an earned level-up; the save replacement epoch resets notification tracking. Hunter rank and ability unlocks continue to follow campaign milestones.

## Validation

- 72 tests passed, including new cases for exact thresholds, multiple levels, invalid XP, repeat reward idempotency and save replacement/reload behavior.
- TypeScript and production build passed.
- In an isolated browser origin, a new character completed three lessons: XP advanced 0→100→200→300; Level 1→2 appeared in the header and celebration; the bar rolled over to 0/300 toward Level 3. Reload retained Level 2 and emitted no false notice.
- The existing main-preview save stayed at 550 XP. Browser confirmed Level 2, 250/300 XP and 50 XP remaining.
- At 390px, the main preview had no horizontal scrolling and both XP bars remained readable.
- No save schema, reward amounts, combat stats or multiplayer-service changes. A new raid expedition was not run for this display/notification update.

The local preview is available on port 4174. The temporary isolated test server was stopped after verification. Earlier GitHub deployment attempts were blocked by an account billing lock.
