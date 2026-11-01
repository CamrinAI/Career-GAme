# Quest Rank AI playtest report — release 1.1.1

Testing began October 30, 2026, and release preparation continued October 31. Three independent AI agents tested solo gameplay, multiplayer/service behavior, and keyboard/UX flows. The lead agent reproduced and repaired findings, ran regression checks, and coordinated a real shared raid between two agents in Safari and the in-app browser. These were synthetic profiles and rooms; the existing public850XP profile was not reset or used for reward testing.

## Confirmed findings and fixes

| Priority | Finding | Repair and regression evidence |
| --- | --- | --- |
| High | A stale second tab could overwrite100XP/new lesson progress when toggling sound | Save updates serialize under browser Web Locks and rebase from current storage; storage events synchronize tabs. Root UI regression earned100XP, changed sound in an already-open second tab, reloaded, and retained100XP/lesson1. Concurrent reward and reset-epoch tests pass. |
| Medium | Host could rematch before a guest polled victory, hiding results and150XP | Each player acknowledges the debrief before host advance/rematch. Independent live API retest and two-agent browser raid proved host remains blocked until guest review; both players received their own first-victory reward. |
| Medium | Captured round1 actions could submit into a later rematch | Every HTTP command includes run and round; stale requests return409. Independent live replay test passed. |
| Low | JSON null requests returned503, resembling an outage | Require a JSON object; null/array/scalar bodies return400. Live retest passed. |
| Medium | Shared quizzes lost keyboard focus after answering | Focus feedback and explicitly name the correct answer. Independent Safari regression verified focus and onward navigation to Complete lesson. |
| Medium | Raid hints disabled their button without focus/announcement | Clues use a status/live region and receive focus. Safari agent verified Fox hint, charge consumption, elimination and focus. |
| Medium | Raid question/debrief transitions lost keyboard focus | Focus the new question, locked-in heading, debrief, or acknowledgement count as appropriate. Safari and in-app-browser checks passed. |
| Low | Pathfinder final step lost keyboard focus | Focus the awakening heading. Independent Safari regression passed. |
| Low | Raid nickname stayed Hunter after awakening a named profile | Sync the default until the player manually customizes it. Safari verified both propagation and preservation of a custom nickname. |

Additional hardening: explicit reset/restore invalidates stale active sessions; final room snapshots remain readable by authenticated members after host departure; late command responses cannot reopen a closed session. Lobby guidance explains attack pressure and code-input help explains invalid codes.

## Coverage

- **Solo UI:** fresh awakening, all4 IAM lessons, D-rank,0/6 trial milestone, six focused corrections without farming XP, all3 perks/contracts, tactical victory, wrong-answer defeat, second phase, defense/special actions, recaps, refresh persistence, C-rank and Citadel Vanguard at1075XP/675mastery.
- **Multiplayer/API:** member authentication, origins, room creation/join, simultaneous submissions, correctness/effects, host authority, hints, guest/host expiry, removal, request limits, run replay rejection, acknowledgement gates, final-result retention, victory/rematch/cleanup.
- **Simulation:** raid agent tested768 simulated parties/13,824 commands for bounded resources and termination, plus all336 two-to-four-player career combinations using correct strikes. All-strike parties could win within4 rounds; defensive-only strategies can time out as now explained.
- **Cross-browser AI raid:** Software Vanguard in the in-app browser and Nurse Sentinel/Cipher Fox in native Safari completed4 rounds. Boss360→0; shared HP200→80. Guest received150XP; host combined a100XP lesson in another tab with150raid XP, reaching250XP. Host advancement/rematch stayed disabled while the guest had not reviewed. Question, hint, result and acknowledgement focus were checked.
- **Responsive UI:** all8 main pages checked at320px and390px; each document's scroll width equaled its viewport width. Earlier four-player arena/result layouts also passed these widths.
- **Automated:** 67 tests pass; production TypeScript/Vite build passes. Tests cover saves/migrations/backups/resets, learning history, solo progression/combat, raid rules and HTTP/SQLite concurrency.

## Limits and next playtests

AI testing does not prove the absence of all bugs. Physical phones/tablets, multiple real networks, assistive-technology users and independent professional content review remain needed. The most recent solo agent's backup-download/reset UI test was interrupted by a browser-tool failure; those flows have prior release browser evidence and current automated coverage, but were not fully repeated in this session. Browser preview surfaces were unavailable to some subagent follow-ups; Safari and lead-agent checks supplied the stated regressions.

No contest submission or acceptance of contest rules was performed. The public game remains an educational beta with small non-cloud raid sets, not full professional curricula or certification/clinical competency assessment.
