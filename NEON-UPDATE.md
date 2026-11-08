# Neon Protocol · 1.3.0

Quest Rank now has an original pixel sci-fi setting: the Nexus orbital station, a cyan planet, solar arrays, star traffic, a conduit-lit hangar, powered-armor pilots, and an autonomous Warden mech. Cyan/magenta controls and target-acquisition effects unify the menus and battles. The live solo tactical link displays actual boss integrity, phase-dependent retaliation and remaining SP needed for the ultimate, including victory/defeat states. It stays visible on mobile.

## Research and design decisions

Read-only public Reddit research on 2026-11-07; no Reddit code or artwork was copied. These comments are anecdotal feedback, not representative user research or proof of retention.

| Feedback | Source | Applied change |
| --- | --- | --- |
| Players enjoy ultimate animations, atmosphere and satisfying character actions. | https://www.reddit.com/r/HonkaiStarRail/comments/1t2i3ux/whats_one_thing_honkai_star_rail_does_really_well/ | Cohesive orbital setting, powered armor and existing ultimate cut-in extended with a neural-link theme. |
| Energy decisions and readable turn order make relatively few combat commands interesting. | https://www.reddit.com/r/HonkaiStarRail/comments/12ddswi | Live energy/retaliation telemetry, while preserving the tested command rules. |
| Characters need to stand out from their environment. | https://www.reddit.com/r/IndieDev/comments/1tad50c/sharing_my_2d_pixelart_action_platformer_for/ | Bright pilot visor/reactor accents and dark hangar surfaces; distinct career accent colors retained. |

Pyxel (https://github.com/kitao/pyxel) remains a pixel-art reference. Original SVG pixel maps retain crisp edges at responsive sizes. No new dependency, downloaded asset or Python runtime is required. Unity migration was considered but not undertaken: it would require a separate application build and integration effort; improving the current browser renderer delivers this scoped visual update directly.

## Verification

- 67 existing combat/progression/save/room tests passed.
- TypeScript and production build passed.
- Browser checked new Nexus/orbital art and solo arena. Three guards moved HP 120→102 and SP 20→80; ultimate telemetry changed from “50 SP TO GO” to “READY”.
- Reload retained the existing 550-XP save.
- At 390px, document width equals viewport width and live telemetry is rendered. Desktop checked at the normal 1280px viewport.
- Motion effects inherit the existing reduced-motion overrides. No timers gate answers or commands.
- This release changes shared raid artwork but does not change multiplayer rules/service; a new end-to-end multiplayer expedition was not run for 1.3.0.

## Next playtest priorities

| Priority | Next improvement | How to judge it |
| --- | --- | --- |
| 1 | Watch five new players start their first mission | Can they find a lesson and explain their first combat decision without assistance? |
| 2 | Add a short playable station exploration route | Do players understand where to go and enjoy reaching the next encounter? |
| 3 | Give each role a distinct sprite silhouette and ability animation | Can players identify each role at phone size? |
| 4 | Expand enemy behaviors and mission rewards | Do players make different tactical choices across repeat runs? |

Public deployment was blocked for the preceding release because GitHub reported an account billing lock. The production build and source are ready; publishing still depends on GitHub allowing the workflow to run.
