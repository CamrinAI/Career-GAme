# Skybound Orbit · 1.5.0

The bright Skybound pixel style is retained. The setting is now explicitly sci-fi: floating eco-tech research islands, blue glass biodomes, solar panels, antennae, spacecraft, a ringed planet and cyan energy conduits. The default explorer wears a flight suit and life-support pack, with an energy tool in place of a fantasy sword.

Nurse Sentinel has a dedicated field-medic sprite: practical ivory/teal uniform, protective vest, medical backpack, stethoscope, diagnostic scanner and green plus badges. Selecting the nursing role chooses this asset in the shared Hunter component, including raid party rendering. Other roles use the explorer asset with their existing role-color markers. Each role card now has a model thumbnail and the selected role has an enlarged, labeled preview.

## Verification

- 67 existing tests passed; TypeScript and production build passed.
- Browser checked selection of Nurse Sentinel and verified its image uses medic.png, with the correct heading and outfit description.
- At 390px, document width matched viewport width; the medic preview fit without horizontal overflow.
- Existing 550-XP save remained intact. No career rules, rewards, combat math, room API or save schema changes.
- A fresh multiplayer expedition was not run for this visual release; role-based raid rendering uses the existing shared character component.
- The production build includes approximately 5.7 MB of PNG artwork. Previous version artwork remains in source as retained assets; Vite emits only referenced artwork.

## Asset provenance

New original assets generated using the built-in image generation tool, then copied into the repository. Earlier Library originals retained. Exact final prompts are in src/assets/ORBIT-PROMPTS.md.

- src/assets/eco-station.png
- src/assets/space-explorer.png (transparent)
- src/assets/medic.png (transparent)

Existing animation and reduced-motion controls apply to the new sprites. The previous GitHub deployment was blocked by an account billing lock; local production output remains available.
