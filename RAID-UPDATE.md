# Rift Raids beta — v1.1

This update retains the Nexus, Academy, IAM Warden, local saves and career progression, and adds an optional cross-career cooperative expedition. The new roles are small raid question sets, not complete nursing, software engineering or AI engineering courses.

## Rules

- Two to four Hunters create/join an eight-character room code, choose a nickname, career role, and hint companion. No account, camera or microphone is required.
- Everyone readies up. Only the host starts/advances/restarts. Join is closed once the raid starts.
- The party has `120 + 40 × starting players` HP; the boss has `180 × starting players` HP.
- Each player chooses Strike, Ward, or Mend, then locks one answer to their role's question. Correct answers activate the move. Wrong answers contribute no effect.
- Strike: 50 damage; Software Vanguard adds 10.
- Ward: 15 damage and 25 shielding; Cloud Warden adds 15 shielding.
- Mend: 10 damage and 25 healing; Nurse Sentinel adds 15 healing. Healing is capped and happens before the enemy hit.
- Enemy damage is `20 + 5 × current players`, plus 15 at half boss health, reduced by combined shielding to a minimum of zero. A lethal hit skips retaliation.
- Victory requires defeating the boss within six rounds while surviving. No question timer.
- Prism Owl gives a clue, Cipher Fox removes one incorrect option, and Lumen Sprite gives a clue with encouragement. Three hints per raid, or four for an AI Arcanist; at most one per round.
- The first raid victory gives 150 character XP once, using the existing idempotent reward mechanism. It grants no IAM mastery, solo boss clear, rank or credential.
- Host rematch keeps the party/code and resets readiness, rounds, hints and scores.

## Connection and privacy design

The shared HTTPS room service uses Cloudflare D1 through Sites. The browser polls about every 1.2 seconds while connected and sends a heartbeat every 15 seconds. The server owns room state, authenticates each actor using a random 256-bit session token, stores only SHA-256 token hashes, and resolves changes with a revision-checked SQL update. Concurrent submissions retry on revision conflicts. Clients cannot supply their own HP, damage, score, or another member's identity. Responses never include other members' tokens.

An eight-character invitation code admits up to four players to the lobby; it is an invitation to a casual trusted-party session, not a private account. No public room listing or built-in chat exists. Use nicknames and play with people you trust. Room members see nicknames, roles, companions, round contributions and results. No camera, microphone, personal health data, accounts or credentials are required. The service host naturally processes connection metadata; the application does not store IP addresses in its room records.

Room state, nickname, choices, presence timestamps and hashed session tokens are retained for six hours. Expired records become inaccessible immediately and are deleted when a new room is created; this is not a guaranteed immediate physical-deletion schedule. The current tab stores its own token in sessionStorage to reconnect after a brief refresh. Leaving explicitly closes/removes the session. A host missing for two minutes ends the room; an absent guest is removed after two minutes. Navigation within the app keeps the room connected. No host migration is implemented. All requests and rooms require internet access; solo play remains independent.

Solo saves and IAM quiz history remain device-local. Raid answers do not enter the IAM Practice Journal because these new questions use different subjects and identifiers. Gameplay is an educational beta, not a secure examination or professional assessment.

The service source is tracked in `room-service/worker.ts` and reuses `src/raid.ts`. `node scripts/build-room-service.mjs` prepares the separate Sites checkout at `../quest-rank-rooms`. Its manifest identity stays in that checkout; `room-service/deployment.json` records the verified service identity and endpoint. The SQL migration is schema-only and immutable after deployment. Future schema changes must add migrations.

## Content references

Original brief questions and explanations are based on these concepts, rather than copied examination items:

- Cloud: [AWS IAM best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html), [policy evaluation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html), and [CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html).
- Nursing teamwork: [AHRQ TeamSTEPPS tools](https://www.ahrq.gov/teamstepps-program/resources/modules/index.html), [WHO patient safety](https://www.who.int/news-room/fact-sheets/detail/patient-safety), and [WHO patient identification](https://www.who.int/docs/default-source/integrated-health-services-%28ihs%29/psf/patient-safety-solutions/ps-solution2-patient-identification.pdf). Fictional communication/safety exercises only; no diagnosis, treatment, licensing or clinical competency claims. Qualified educational review remains a future requirement before use as professional training.
- Software: [OWASP SQL injection prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html), [OWASP secrets management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html), version-control/debugging/testing fundamentals.
- AI: [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework), evaluation and held-out testing fundamentals, source verification and untrusted-document boundaries.
- Room storage and concurrency: Cloudflare D1, server-side revision checks, and the Sites hosting workflow.

## Handshake alignment

The Safari mission asks for a public no-account multiplayer game joined by room code, synchronized across players. Its displayed date says October 31, 2026, but the linked official rules specify October 30, 2026 at 11:59 p.m. Pacific. Work toward the earlier date and verify with Handshake. Execution, creativity, usefulness/value, and polish/thoughtfulness each carry 25% in those rules. No contest submission or terms acceptance is performed by this update.

## Next validation before calling it submission-ready

Automated rules, two independent browser peers, full victory/defeat/rematch, hints, disconnect behavior, responsive layouts, and production link must be verified. Actual separate physical devices and at least two different networks still need a human playtest. Do not claim guaranteed connectivity from same-machine browser testing.

## Verified for this release

- 59 automated tests: the previous 46 plus 11 cooperative rule tests and two HTTP/storage tests. The latter exercise real in-memory SQLite, member authentication, duplicate joins, simultaneous answers, host authority, origins and expiry.
- Production build passes. The published room service responds successfully, provisions the schema and creates/closes a room.
- Two browser clients completed a five-round Cloud/Nurse victory, including Owl/Fox hints, 40-point Cloud shielding, 40-point Nurse healing, second-phase damage, explanations and a mid-raid guest refresh/reconnect.
- Four browser clients with all four roles completed a four-round victory: boss 720→0, party 280→130, 210 damage per correct all-strike round, AI starts with four hints. Software's damage bonus is reflected in shared results.
- Host rematch keeps party/code and resets readiness/hints/scores. Replay victory did not repeat the 150 XP reward (test profile stayed at 550 XP).
- Explicit host leave closes the room and shows the other players the room-ended message.
- Four-player battle and result layouts have no horizontal overflow at 390 and 320 CSS pixels. The production client reported no console errors in the four-player test.
- Separate physical phones/networks, assistive technologies and independent professional content review remain unverified. This remains labeled beta. No contest submission has been performed.
