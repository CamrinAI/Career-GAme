# Pixel Chronicles · v1.2.0

Quest Rank now uses original pixel artwork and stepped animation throughout the Nexus, solo Warden encounter, raid arena and hint companions. Pyxel (https://github.com/kitao/pyxel) informed the retro visual direction; this remains the existing React/TypeScript browser game. No third-party character art, Python runtime or new dependency was added.

## Player-facing changes

- Moonlit mountains, river, floating citadel, tile battleground, flickering portal and stars.
- Integer-grid Hunter and crystal Warden sprites; four career accent palettes.
- Original animated pixel Owl, Fox and Sprite companions.
- Raid party members and their chosen pets appear beside the shared boss.
- Attack lunge, counter movement, shield effect, impact pixels, damage numbers and ultimate portrait cut-in.
- Turn-order strip describes the existing hunter-command / Warden-response rules.
- Replay animation returns focus to the arena and replays only the visual cue. It does not resolve another turn, spend energy or award progress.
- Three destination shortcuts on the Nexus, square menu panels and readable monospaced headings.
- Reduced-motion preferences suppress animations; the persistent combat log and answer explanations remain available.

## Validation · 2026-11-07

- 67 existing tests passed, including combat, progression, save migration, cross-tab saves, room authorization and result acknowledgements.
- TypeScript and production build passed; no dependency changes.
- Browser checked Nexus, solo arena, guard, ultimate question/answer, 110-damage ultimate, replay with unchanged totals, and reduced-motion behavior.
- Two browser clients joined a temporary room with Cloud/Owl and Software/Fox. Both readied and submitted correct strikes: Warden 360→250, party 200→170. Debrief remained available. Host closed the test room afterward.
- Solo and two-player raid layouts checked at 390px: document width matched viewport, no horizontal scrolling. Desktop checked at 1280px.
- Existing 550-XP local save survived reload. Motion preference restored after testing.

## Scope

This is a visual and animation release. Four-player visuals use the same responsive party grid but were not manually re-playtested with four clients in this release. It does not add free-roaming movement, platforming, Snake, Breakout or a new combat ruleset. Existing solo-session restart behavior and shared-room beta limitations still apply.
