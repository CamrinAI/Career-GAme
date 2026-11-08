# Skybound · graphics release 1.4.0

The user-supplied poster is the visual reference for this release. An exact title or developer could not be verified from its headline. Related first-party sources found in research include Agentale (https://agentale.app/), a Python-learning pixel RPG, and PyFarm (https://captaingoverns.itch.io/pyfarm), a floating-island coding puzzle game. Neither establishes the identity of the supplied image. No source code or assets were copied from either game.

## Applied visual direction

- Original detailed raster environment: floating grassy islands, blue-roof castle, waterfall, trees, flowers and bridge.
- Original transparent backpack adventurer with crystal blade; existing idle/lunge/cut-in motion retained. Role colors remain represented by the sprite's ground marker.
- Shared background used by Nexus, solo arena and raid arena.
- Lavender background, pale window panels, bold dark borders/drop shadows, green primary buttons, outlined progress cards and legible lesson navigation.
- Guardian sprite/pets retained as vector pixel art, recolored to suit the new environment.
- The UI uses actual saved progress; no streak, coins, certificates, Python runner or platform movement is implied by the decorative reference.

## Verification

67 existing tests passed. TypeScript and production build passed. Browser checked the Nexus, lesson reader, solo arena and detailed sprite rendering. At 390px the document width matched viewport width without horizontal scrolling; existing 550 XP remained intact. No save schema, combat math or room-service changes. Multiplayer artwork is shared, but a new multiplayer expedition was not run for this visual release.

Landscape and sprite add approximately 3.6 MB of PNG assets, cached across views. Motion remains governed by existing reduced-motion rules. The public release remains dependent on GitHub allowing the deployment workflow to run; the earlier runs were blocked by an account billing lock.

## Asset provenance

Generated with the built-in image-generation tool. Final project assets:
- `src/assets/sky-islands.png`
- `src/assets/adventurer.png` (transparent)

Prompts are recorded in `src/assets/PROMPTS.md`. Generated originals were retained in the image-generation library.
