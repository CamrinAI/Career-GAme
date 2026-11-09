# Class Cosmetics · 1.6.0

Every career now has its own recognizable sci-fi appearance, retaining the bright pixel-adventure style:

| Class | Cosmetic identity |
| --- | --- |
| Cloud Warden | Cloud-shaped white pauldrons, azure armor, cloud shield and vapor jetpack. |
| Nurse Sentinel | Existing ivory/teal medic outfit, medical backpack and diagnostic scanner. |
| Software Vanguard | Amber/charcoal tech hoodie, headphones, developer belt and rugged laptop. |
| AI Arcanist | Violet neural research coat, wrist projector and a separate hovering holographic assistant. |

`src/appearances.ts` is the shared appearance catalog for labels, descriptions, accent colors and asset selection. The existing Hunter component is used by the Nexus, solo Cloud Warden, ultimate cut-in, raid selector and raid party sprites. The small AI assistant is original SVG artwork with its own hover/signal animation, positioned above the character's raised hand; existing reduced-motion overrides stop it. It is cosmetic and does not add hints, an AI service or another ability.

## Validation

- 67 existing combat/progression/save/room tests passed.
- TypeScript and production build passed.
- Browser verified all four selector cards reference four distinct model assets, with correct class descriptions.
- Selecting AI displays its neural outfit and one separate hologram in the selected-character preview.
- At 390px, the document has no horizontal overflow; the AI outfit and assistant fit the preview.
- Existing 550-XP save remained visible. No combat, reward, room-service or save-schema changes.
- A new multiplayer expedition was not run for this visual release. Shared raid rendering uses the same role appearance mapping.

## Assets

Original PNGs generated with the built-in image-generation tool, copied into `src/assets/`; exact prompts are in `src/assets/CLASS-PROMPTS.md`:

- cloud-warden.png
- software-vanguard.png
- ai-arcanist.png

The prior medic and environment are retained. Current referenced artwork totals approximately 9 MB of PNGs, cached between views; model compression is a future performance improvement. Earlier generated assets are retained in source and the generation library, with unused assets excluded from the production build by Vite.

Earlier GitHub deployment attempts were blocked by an account billing lock. Local build output and source remain ready to publish when the workflow can run.
