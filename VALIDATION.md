# Quest Rank v0.1 validation

## Passed

- `npm test`: 16/16 tests, covering HP/SP limits, paid and free actions, phase transition, victory, defeat, terminal state protection, a tactical winning sequence, versioned save recovery, rewards, resets and content integrity.
- `npm run build`: TypeScript check and Vite production bundle succeed.
- GitHub Actions independently installed dependencies, ran all tests, built and uploaded the Pages artifact successfully.
- Browser: completed an IAM lesson and confirmed XP/completion survive refresh.
- Browser: selected an incorrect battle answer; boss remained at full HP and hunter lost 18 HP. Defending then lost only 6 HP and restored 20 SP.
- Browser: completed a tactical victory (attack, special, special, defend, special, attack), ending at 23 HP; first-clear XP/mastery applied and character reached level 2.
- Browser: replay reset combat resources; seven incorrect answers reached defeat without removing earned progress.
- Browser: keyboard-only actions completed a six-question Mastery Trial with answer explanations and final review.
- Browser: checked desktop at 1280 pixels and phone at 390 pixels. Both Nexus and arena have no horizontal overflow. Increased phone hero height to prevent clipping.
- Reduced motion supports both the saved in-game setting and operating-system preference. Optional synthesized audio defaults off.

## Delivery status

Source: feature branch `feat/quest-rank-prototype` in CamrinAI/Career-GAme.
Review: https://github.com/CamrinAI/Career-GAme/pull/1. No merge performed.
GitHub Pages deployment succeeded on workflow run 40154970190, attempt 3. The user enabled GitHub Actions as the Pages source; the environment allowlist was expanded only to include feat/quest-rank-prototype alongside main. Public preview verified in the browser: https://camrinai.github.io/Career-GAme/. No custom domain is required.

## Deliberate prototype limits

- Original SVG/CSS battle presentation, without Phaser.
- Device-local progress; no accounts or cross-device sync. In-progress combat restarts on refresh/navigation.
- Twelve practice questions, four lessons, one boss and one playable chapter. Other roadmap chapters are planned.
- Fictional hunter rank remains E in v0.1; character level and career mastery increase independently.
- Certification readiness is explicitly introductory practice, not an exam readiness or credential verification system.
- No equipment/cosmetic unlock economy, multiplayer, guilds, 3D hub or hybrid classes.
