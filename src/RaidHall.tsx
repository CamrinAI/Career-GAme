import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  Heart,
  Shield,
  Sparkles,
  Swords,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  careers,
  pets,
  questionFor,
  raidSources,
  type Career,
  type Move,
  type Pet,
} from "./raid";
import { useRaidRoom } from "./useRaidRoom";
import { Warden, Scenery } from "./Scenery";
export function PetPortrait({ pet }: { pet: Pet }) {
  return (
    <svg
      className={"pet-portrait pet-" + pet}
      viewBox="0 0 100 100"
      role="img"
      aria-label={pets[pet].name}
    >
      <circle cx="50" cy="50" r="43" fill="currentColor" opacity=".08" />
      {pet === "owl" ? (
        <>
          <path
            d="M25 30 29 16 45 28 55 28 72 16 75 33C85 74 65 86 50 86S15 74 25 30Z"
            fill="currentColor"
            opacity=".3"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            cx="37"
            cy="47"
            r="14"
            fill="#101529"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            cx="63"
            cy="47"
            r="14"
            fill="#101529"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="37" cy="47" r="5" fill="currentColor" />
          <circle cx="63" cy="47" r="5" fill="currentColor" />
          <path
            d="m46 60 4 8 4-8M36 74l5 4M59 78l5-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
        </>
      ) : pet === "fox" ? (
        <>
          <path
            d="M20 57 15 15 40 33 60 33 85 15 80 57 50 84Z"
            fill="currentColor"
            opacity=".3"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="m25 49 25 27 25-27-15 6-10 15-10-15Z"
            fill="#e7e4ff"
            opacity=".8"
          />
          <path
            d="m29 45 10 4m22 0 10-4"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path d="m44 66 6 7 6-7" fill="#101529" />
        </>
      ) : (
        <>
          <path
            d="m50 12 10 24 26 14-26 14-10 24-10-24-26-14 26-14Z"
            fill="currentColor"
            opacity=".25"
            stroke="currentColor"
            strokeWidth="2"
          />
          <ellipse
            cx="50"
            cy="51"
            rx="20"
            ry="23"
            fill="currentColor"
            opacity=".4"
          />
          <circle cx="43" cy="48" r="3" fill="#101529" />
          <circle cx="57" cy="48" r="3" fill="#101529" />
          <path
            d="M44 60q6 7 12 0"
            stroke="#101529"
            strokeWidth="2"
            fill="none"
          />
        </>
      )}
    </svg>
  );
}
export function RaidHall({
  defaultName,
  onVictory,
}: {
  defaultName: string;
  onVictory: () => void;
}) {
  const {
    room,
    identity,
    status,
    error,
    connecting,
    busy,
    connect,
    leave,
    send,
  } = useRaidRoom();
  const [name, setName] = useState(defaultName.slice(0, 20));
  const [career, setCareer] = useState<Career>("cloud");
  const [pet, setPet] = useState<Pet>("owl");
  const [code, setCode] = useState(
    () =>
      new URLSearchParams(location.search)
        .get("raid")
        ?.slice(0, 8)
        .toUpperCase() || "",
  );
  const [move, setMove] = useState<Move>("strike");
  const [answer, setAnswer] = useState<number | null>(null);
  const [copied, setCopied] = useState("");
  const [confirmLeave, setConfirmLeave] = useState(false);
  const me = room?.players.find((p) => p.id === identity);
  const host = room?.host === identity;
  const ended = room?.status === "victory" || room?.status === "defeat";
  const question = me && room ? questionFor(me.career, room.round) : null;
  const submitted = !!room?.submissions[identity];
  const revealed = room?.status === "review" || ended;
  const hinted = room?.hinted.includes(identity);
  const eliminated =
    me?.pet === "fox" && hinted && question
      ? question.options.findIndex((_, i) => i !== question.answer)
      : -1;
  const disconnected = status === "Room ended" || status === "Reconnecting…";
  useEffect(() => {
    setMove("strike");
    setAnswer(null);
  }, [room?.round, room?.status === "lobby"]);
  useEffect(() => {
    if (room?.status === "victory") onVictory();
  }, [room?.status, onVictory]);
  async function copyInvite() {
    if (!room) return;
    const url = new URL(location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("raid", room.code);
    try {
      await navigator.clipboard.writeText(url.href);
      setCopied("Invite link copied.");
    } catch {
      setCopied("Copy the room code shown above and share this game’s link.");
    }
  }
  function exit() {
    leave();
    setConfirmLeave(false);
    const url = new URL(location.href);
    url.searchParams.delete("raid");
    history.replaceState(null, "", url);
  }
  return (
    <div className="raid-hall">
      <div className="page-heading">
        <div>
          <div className="eyebrow">CROSS-CAREER COOPERATIVE EXPEDITION</div>
          <h1>
            Rift Raids <span className="tag purple-tag">BETA</span>
          </h1>
          <p>
            Different skills. One party. Break the Fracture Warden’s seal
            together.
          </p>
        </div>
      </div>
      {!room && status && (
        <p role="status" className="raid-note">
          {status}
        </p>
      )}
      {!room ? (
        <>
          <section className="panel raid-intro">
            <div>
              <span className="tag teal-tag">
                <Users size={14} /> 2–4 PLAYERS · NO ACCOUNTS
              </span>
              <h2>Your knowledge is the party’s power.</h2>
              <p>
                Each Hunter answers questions from their field. Coordinate
                attacks, shields, and healing across six rounds. Your companion
                can help when you get stuck.
              </p>
              <div className="raid-feature-row">
                <span>
                  <Swords size={16} /> Shared boss
                </span>
                <span>
                  <Heart size={16} /> Shared health
                </span>
                <span>
                  <Sparkles size={16} /> Pet hints
                </span>
              </div>
            </div>
            <div className="raid-intro-art" aria-hidden="true">
              <Warden />
            </div>
          </section>
          <section className="panel raid-setup">
            <div className="eyebrow">01 · CHOOSE YOUR RAID IDENTITY</div>
            <label className="raid-label">
              Hunter nickname{" "}
              <input
                maxLength={20}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Choose a nickname"
                autoComplete="off"
                disabled={connecting}
              />
            </label>
            <p className="raid-note">
              Use a nickname. Party members see your name, role, pet, and round
              results. Your solo save stays on this device.
            </p>
            <div
              className="career-choice-grid"
              role="group"
              aria-label="Raid career"
            >
              {(
                Object.entries(careers) as [Career, (typeof careers)[Career]][]
              ).map(([id, entry]) => (
                <button
                  key={id}
                  className={
                    "career-choice " + (career === id ? "selected" : "")
                  }
                  aria-pressed={career === id}
                  disabled={connecting}
                  onClick={() => setCareer(id)}
                >
                  <span className="eyebrow">{entry.role}</span>
                  <strong>{entry.name}</strong>
                  <span>{entry.description}</span>
                  {career === id && <Check size={18} />}
                </button>
              ))}
            </div>
            <p className="raid-note">
              These are raid roles, not complete career courses or credentials.
              Nursing scenarios teach fictional teamwork and general safety;
              they do not provide diagnosis, treatment, or clinical competency
              assessment.
            </p>
          </section>
          <section className="panel raid-setup">
            <div className="eyebrow">02 · MEET YOUR COMPANION</div>
            <div
              className="pet-choice-grid"
              role="group"
              aria-label="Hint companion"
            >
              {(Object.entries(pets) as [Pet, (typeof pets)[Pet]][]).map(
                ([id, entry]) => (
                  <button
                    key={id}
                    className={"pet-choice " + (pet === id ? "selected" : "")}
                    aria-pressed={pet === id}
                    disabled={connecting}
                    onClick={() => setPet(id)}
                  >
                    <PetPortrait pet={id} />
                    <strong>{entry.name}</strong>
                    <span>{entry.description}</span>
                  </button>
                ),
              )}
            </div>
            <p className="raid-note">
              Three hints per raid; four for AI Arcanists. One hint per round.
              Hints never reduce your reward.
            </p>
          </section>
          <section className="panel raid-connect">
            <div>
              <div className="eyebrow">03 · GATHER YOUR PARTY</div>
              <h2>Open a room. Share the code.</h2>
              <button
                className="primary"
                disabled={connecting || !name.trim()}
                onClick={() => connect("host", "", name, career, pet)}
              >
                <Users size={17} />{" "}
                {connecting ? "Connecting…" : "Create raid room"}
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (/^[A-HJ-NP-Z2-9]{8}$/.test(code) && name.trim())
                  connect("join", code, name, career, pet);
              }}
            >
              <label className="raid-label">
                Have an invite? Enter the 8-character room code
                <input
                  value={code}
                  maxLength={8}
                  onChange={(e) =>
                    setCode(
                      e.target.value.toUpperCase().replace(/[^A-Z2-9]/g, ""),
                    )
                  }
                  placeholder="ABCD2345"
                  autoComplete="off"
                  spellCheck={false}
                />
              </label>
              <button
                className="secondary"
                disabled={
                  connecting ||
                  !/^[A-HJ-NP-Z2-9]{8}$/.test(code) ||
                  !name.trim()
                }
              >
                Join room <ArrowRight size={16} />
              </button>
            </form>
          </section>
          <details className="panel raid-rules">
            <summary>How to play & connection details</summary>
            <ol>
              <li>
                Open the same game on each device. Pick a role and a pet, then
                join the host’s code.
              </li>
              <li>
                Everyone readies up. The host starts when at least two Hunters
                are ready.
              </li>
              <li>
                Pick Strike, Ward, or Mend and answer one question. Correct
                answers power your chosen move; incorrect answers contribute no
                effect. Answers lock when submitted.
              </li>
              <li>
                All submitted? The round resolves for everyone. Review the
                explanations, then the host advances.
              </li>
              <li>
                Defeat the boss in six rounds. Shared HP reaching zero also ends
                the raid. Healing happens before damage. There is no timer.
              </li>
            </ol>
            <p>
              Keep the host connected. Leaving ends the room; a brief refresh
              can reconnect this tab automatically. You can visit other game
              pages while connected. Rooms sync through a shared service, with
              no camera or microphone. Sessions expire after six hours or two
              minutes without the host. Use nicknames and share room codes with
              people you trust. Temporary room data is retained for up to six
              hours; expired records are removed when new rooms are created.
            </p>
            <p>
              First raid victory earns 150 XP once. Raids do not grant solo boss
              clears, career ranks, or certifications.
            </p>
          </details>
        </>
      ) : (
        <>
          <section className="panel raid-room-bar">
            <div>
              <span className="eyebrow">ROOM CODE</span>
              <strong className="room-code">{room.code}</strong>
              <span className="raid-note">
                {busy ? "Sending…" : status} · {room.players.length}/4 Hunters
              </span>
            </div>
            <div className="button-row">
              <button className="secondary" onClick={copyInvite}>
                <Copy size={16} /> Copy invite
              </button>
              <button
                className="secondary"
                onClick={() => setConfirmLeave(true)}
              >
                <X size={16} /> Leave room
              </button>
            </div>
          </section>
          {copied && (
            <p role="status" className="raid-note">
              {copied}
            </p>
          )}
          {confirmLeave && (
            <section
              className="panel raid-leave"
              role="region"
              aria-label="Confirm leaving room"
            >
              <p>
                {host
                  ? "You are the host. Leaving closes this room for everyone."
                  : "Leave this expedition? You can rejoin only while it is in the lobby."}
              </p>
              <div className="button-row">
                <button
                  className="secondary"
                  onClick={() => setConfirmLeave(false)}
                >
                  Stay in room
                </button>
                <button className="primary" onClick={exit}>
                  Leave room
                </button>
              </div>
            </section>
          )}
          <div className="raid-roster">
            {room.players.map((p) => (
              <article
                className={
                  "panel raider-card " + (p.id === identity ? "is-you" : "")
                }
                key={p.id}
              >
                <PetPortrait pet={p.pet} />
                <div>
                  <strong>
                    {p.name} {p.id === identity && <small>(you)</small>}
                  </strong>
                  <span>
                    {careers[p.career].name}
                    {p.id === room.host ? " · Host" : ""}
                  </span>
                  <small>
                    {room.status === "lobby"
                      ? p.ready
                        ? "Ready"
                        : "Choosing loadout"
                      : `${p.correct} correct · ${p.hints} hints left`}
                  </small>
                </div>
                <span
                  className={
                    "raider-indicator " +
                    ((room.status === "lobby" ? p.ready : p.submitted)
                      ? "ready"
                      : "")
                  }
                >
                  {room.status === "lobby"
                    ? p.ready
                      ? "Ready"
                      : "Waiting"
                    : p.submitted
                      ? "Locked in"
                      : "Thinking"}
                </span>
              </article>
            ))}
          </div>
          {room.status === "lobby" ? (
            <section className="panel raid-lobby">
              <div className="eyebrow">PREPARE FOR THE FRACTURE</div>
              <h2>Every role can make the difference.</h2>
              <p>
                Bring any combination of roles. Strike deals 50 damage; Ward
                deals 15 damage and blocks 25; Mend deals 10 damage and restores
                25 HP. Your role adds its listed specialty bonus on correct
                answers.
              </p>
              <p>
                Defeat the Warden in six rounds. Boss health scales to the
                starting party size. No timer—talk through your strategy
                together.
              </p>
              <div className="button-row">
                <button
                  className="primary"
                  disabled={disconnected || busy}
                  onClick={() => send({ type: "ready" })}
                >
                  {me?.ready ? "Not ready yet" : "Ready up"} <Check size={16} />
                </button>
                {host && (
                  <button
                    className="secondary"
                    disabled={
                      busy ||
                      room.players.length < 2 ||
                      !room.players.every((p) => p.ready)
                    }
                    onClick={() => send({ type: "start" })}
                  >
                    Start raid <Swords size={16} />
                  </button>
                )}
              </div>
              <p className="raid-note">
                {room.players.length < 2
                  ? "Invite at least one teammate to begin."
                  : host
                    ? "Everyone must ready up before you start."
                    : "The host starts when everyone is ready."}{" "}
                You can explore the game without closing your room. A brief
                refresh reconnects this tab; two minutes away removes you.
              </p>
            </section>
          ) : (
            <>
              <section
                className={
                  "panel raid-arena " +
                  (room.boss <= room.maxBoss / 2 ? "enraged" : "")
                }
              >
                <Scenery arena />
                <div className="raid-arena-content">
                  <div className="raid-arena-top">
                    <span className="tag purple-tag">
                      {ended
                        ? room.status === "victory"
                          ? "FRACTURE SEALED"
                          : "EXPEDITION ENDED"
                        : room.boss <= room.maxBoss / 2
                          ? "PHASE II · FRACTURE SURGE"
                          : "PHASE I · THE FRACTURE"}
                    </span>
                    <strong>ROUND {room.round} / 6</strong>
                  </div>
                  <h2>The Fracture Warden</h2>
                  <div className="raid-hp">
                    <span>
                      WARDEN · {room.boss}/{room.maxBoss} HP
                    </span>
                    <progress
                      aria-label="Warden health"
                      value={room.boss}
                      max={room.maxBoss}
                    />
                  </div>
                  <div className="raid-warden" aria-hidden="true">
                    <Warden />
                  </div>
                  <div className="raid-hp team">
                    <span>
                      <Heart size={15} /> PARTY · {room.hp}/{room.maxHp} HP
                    </span>
                    <progress
                      aria-label="Party health"
                      value={room.hp}
                      max={room.maxHp}
                    />
                  </div>
                </div>
              </section>
              <div className="panel battle-log" role="status">
                <Zap size={18} />
                <span>{room.log}</span>
              </div>
              {room.status === "active" && me && question && (
                <section className="panel raid-question">
                  <div className="reader-meta">
                    <span className="tag teal-tag">
                      {careers[me.career].name}
                    </span>
                    <span>
                      NO TIME LIMIT ·{" "}
                      {room.players.filter((p) => p.submitted).length}/
                      {room.players.length} LOCKED IN
                    </span>
                  </div>
                  <h2>
                    {submitted
                      ? "Your contribution is locked in."
                      : "Choose your contribution."}
                  </h2>
                  <div
                    className="raid-moves"
                    role="group"
                    aria-label="Raid contribution"
                  >
                    {(
                      [
                        [
                          "strike",
                          Swords,
                          "Strike",
                          `${me.career === "software" ? 60 : 50} damage`,
                        ],
                        [
                          "ward",
                          Shield,
                          "Ward",
                          `15 damage · ${me.career === "cloud" ? 40 : 25} shield`,
                        ],
                        [
                          "mend",
                          Heart,
                          "Mend",
                          `10 damage · ${me.career === "nurse" ? 40 : 25} healing`,
                        ],
                      ] as const
                    ).map(([id, Icon, label, detail]) => (
                      <button
                        key={id}
                        className={move === id ? "selected" : ""}
                        aria-pressed={move === id}
                        disabled={submitted || disconnected || busy}
                        onClick={() => setMove(id)}
                      >
                        <Icon size={20} />
                        <strong>{label}</strong>
                        <small>{detail}</small>
                      </button>
                    ))}
                  </div>
                  <h3>{question.prompt}</h3>
                  <div className="raid-options">
                    {question.options.map((option, i) => (
                      <button
                        key={option}
                        className={answer === i ? "selected" : ""}
                        disabled={
                          submitted || disconnected || busy || i === eliminated
                        }
                        aria-pressed={answer === i}
                        onClick={() => setAnswer(i)}
                      >
                        <span>{String.fromCharCode(65 + i)}</span>
                        {i === eliminated ? "Eliminated by Cipher Fox" : option}
                        {answer === i && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                  <div className="raid-pet-hint">
                    <PetPortrait pet={me.pet} />
                    <div>
                      <strong>{pets[me.pet].name}</strong>
                      {hinted ? (
                        <p>
                          {me.pet === "fox"
                            ? "I ruled out one incorrect choice. Consider the remaining options."
                            : `${me.pet === "sprite" ? "You can do this, Hunter. " : ""}${question.hint}`}
                        </p>
                      ) : (
                        <p>{me.hints} hints remaining this raid.</p>
                      )}
                    </div>
                    <button
                      className="secondary"
                      disabled={
                        submitted ||
                        hinted ||
                        me.hints <= 0 ||
                        disconnected ||
                        busy
                      }
                      onClick={() => {
                        if (
                          me.pet === "fox" &&
                          answer ===
                            question.options.findIndex(
                              (_, i) => i !== question.answer,
                            )
                        )
                          setAnswer(null);
                        send({ type: "hint", round: room.round });
                      }}
                    >
                      <Sparkles size={15} /> Ask for hint
                    </button>
                  </div>
                  <button
                    className="primary"
                    disabled={
                      answer === null ||
                      submitted ||
                      disconnected ||
                      busy ||
                      answer === eliminated
                    }
                    onClick={() =>
                      answer !== null &&
                      send({ type: "answer", round: room.round, move, answer })
                    }
                  >
                    {submitted
                      ? "Waiting for your party…"
                      : "Lock in contribution"}{" "}
                    <ArrowRight size={16} />
                  </button>
                  <p className="raid-note">
                    Correct answers activate the chosen move. An incorrect
                    answer contributes no damage, shield, or healing. Coordinate
                    outside the game; there is no built-in chat.
                  </p>
                </section>
              )}
              {revealed && me && question && (
                <section className="panel raid-round-review">
                  <div className="eyebrow">
                    {ended ? "EXPEDITION DEBRIEF" : "ROUND DEBRIEF"}
                  </div>
                  <h2>
                    {ended
                      ? room.status === "victory"
                        ? "Different paths. One victory."
                        : "Regroup. Learn. Return stronger."
                      : "Your party’s choices shaped the battle."}
                  </h2>
                  {ended && (
                    <p>
                      {room.status === "victory"
                        ? "The seal breaks! Your first raid victory earns 150 XP once. Replays are for teamwork and practice."
                        : "The party must defeat the Warden before HP runs out or the sixth round ends. Try balancing attack pressure with role specialties."}
                    </p>
                  )}
                  <div className="raid-result-list">
                    {room.results.map((r) => (
                      <div key={r.id}>
                        <span>
                          {room.players.find((p) => p.id === r.id)?.name}
                        </span>
                        <span>
                          {r.move} · {r.correct ? "Powered" : "Faltered"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="raid-explanation">
                    <BookOpen size={20} />
                    <div>
                      <strong>Your field question</strong>
                      <p>{question.prompt}</p>
                      <p>
                        Your answer:{" "}
                        {question.options[room.submissions[identity]?.answer] ||
                          "Not submitted"}
                      </p>
                      <p>
                        <strong>
                          Correct: {question.options[question.answer]}
                        </strong>
                      </p>
                      <p>{question.explanation}</p>
                      <div className="raid-study-links">
                        {raidSources[me.career].map((source) => (
                          <a
                            key={source.url}
                            className="source-link"
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Explore: {source.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  {host ? (
                    <button
                      className="primary"
                      disabled={disconnected || busy}
                      onClick={() => send({ type: ended ? "rematch" : "next" })}
                    >
                      {ended ? "Return party to lobby" : "Next round"}{" "}
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <p className="raid-note">
                      {disconnected
                        ? "The host disconnected. Leave this room to create a new expedition."
                        : "Waiting for the host to continue."}
                    </p>
                  )}
                </section>
              )}
            </>
          )}
        </>
      )}
      {error && (
        <div className="panel raid-error" role="alert">
          <strong>Connection update</strong>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
