export type Career = "cloud" | "nurse" | "software" | "ai";
export type Pet = "owl" | "fox" | "sprite";
export type Move = "strike" | "ward" | "mend";
export type RaidQuestion = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
  hint: string;
};
export const careers: Record<
  Career,
  { name: string; role: string; description: string }
> = {
  cloud: {
    name: "Cloud Warden",
    role: "Shield specialist",
    description: "Correct wards block 15 extra damage. IAM and cloud safety.",
  },
  nurse: {
    name: "Nurse Sentinel",
    role: "Healing specialist",
    description:
      "Correct mends restore 15 extra HP. Fictional teamwork and patient safety.",
  },
  software: {
    name: "Software Vanguard",
    role: "Attack specialist",
    description:
      "Correct strikes deal 10 extra damage. Testing, debugging, and secure code.",
  },
  ai: {
    name: "AI Arcanist",
    role: "Insight specialist",
    description:
      "Starts with four pet hints instead of three. Evaluation and responsible AI.",
  },
};
export const pets: Record<
  Pet,
  { name: string; symbol: string; description: string }
> = {
  owl: {
    name: "Prism Owl",
    symbol: "◉",
    description: "Offers a concept clue when you need a nudge.",
  },
  fox: {
    name: "Cipher Fox",
    symbol: "◇",
    description: "Eliminates one incorrect answer to narrow your choices.",
  },
  sprite: {
    name: "Lumen Sprite",
    symbol: "✦",
    description: "Shares a concept clue with a little encouragement.",
  },
};
export const raidQuestions: Record<Career, RaidQuestion[]> = {
  cloud: [
    {
      prompt:
        "An app on a cloud server needs temporary access to storage. What should it use?",
      options: [
        "A role with temporary credentials",
        "A root access key in its code",
        "A shared employee password",
        "Public access to all files",
      ],
      answer: 0,
      explanation:
        "Workload roles provide temporary credentials and can be scoped to the permissions the app needs.",
      hint: "Choose a workload identity that avoids a long-lived secret.",
    },
    {
      prompt: "Which permission design follows least privilege?",
      options: [
        "Every user is an administrator",
        "Allow only required actions on required resources",
        "Share the root identity",
        "Disable all audit records",
      ],
      answer: 1,
      explanation:
        "Least privilege grants only the permissions required for the task.",
      hint: "Match access to the actual task, rather than a broad job title.",
    },
    {
      prompt:
        "An explicit deny and an allow both apply to an IAM request. What wins?",
      options: [
        "The newest statement",
        "The longer policy",
        "The explicit deny",
        "The allow",
      ],
      answer: 2,
      explanation: "An applicable explicit deny overrides an allow.",
      hint: "A deliberate blocking rule takes priority.",
    },
    {
      prompt:
        "Which AWS service records account API activity for investigation?",
      options: [
        "A billing alarm",
        "A shared spreadsheet",
        "An IAM group",
        "AWS CloudTrail",
      ],
      answer: 3,
      explanation:
        "CloudTrail records supported account activity, including API actions, for auditing and investigation.",
      hint: "Look for the service built around an activity trail.",
    },
    {
      prompt: "How should a team protect its AWS root user?",
      options: [
        "Share it for daily work",
        "Use it in deployment scripts",
        "Enable MFA and reserve it for tasks requiring root",
        "Publish its access keys",
      ],
      answer: 2,
      explanation:
        "Protect root with MFA and use other identities for ordinary work.",
      hint: "The most powerful identity needs extra protection and limited use.",
    },
    {
      prompt:
        "A team no longer needs an old permission. What is the best next step?",
      options: [
        "Review and remove unused access",
        "Keep it forever just in case",
        "Give it to every new hire",
        "Turn off authentication",
      ],
      answer: 0,
      explanation:
        "Regularly reviewing and removing unused access helps maintain least privilege.",
      hint: "Permission needs change over time.",
    },
  ],
  nurse: [
    {
      prompt:
        "In a fictional ward handoff, which communication best supports continuity?",
      options: [
        "Assume the next team knows",
        "Use a structured handoff and confirm key information",
        "Leave out unresolved concerns",
        "Share details in a public chat",
      ],
      answer: 1,
      explanation:
        "Structured handoffs and confirmation help teams transfer responsibility and identify unresolved concerns. Follow the organization’s procedures.",
      hint: "Think structure, clarity, and checking understanding.",
    },
    {
      prompt:
        "A fictional team notices a possible patient-identification mismatch. What is the safest teamwork response?",
      options: [
        "Ignore it to avoid delay",
        "Guess from the room number",
        "Pause and follow the approved identification and escalation process",
        "Ask a visitor to decide",
      ],
      answer: 2,
      explanation:
        "A possible identification mismatch calls for verification and escalation using local policy, rather than assumptions.",
      hint: "Uncertainty is a reason to verify before proceeding.",
    },
    {
      prompt:
        "Which action best protects confidentiality in a fictional training exercise?",
      options: [
        "Discuss details in a lift",
        "Post a chart photo online",
        "Use a personal group chat",
        "Share only necessary information through approved channels",
      ],
      answer: 3,
      explanation:
        "Use approved channels and limit disclosure to information necessary for the task.",
      hint: "Consider both the audience and the channel.",
    },
    {
      prompt:
        "A teammate reports a near miss. What supports a learning culture?",
      options: [
        "Report through the approved process and examine contributing factors",
        "Hide it because nobody was hurt",
        "Blame the first person involved",
        "Delete the record",
      ],
      answer: 0,
      explanation:
        "Reporting near misses and examining system factors can help teams prevent future incidents.",
      hint: "A near miss is an opportunity to improve the system.",
    },
    {
      prompt:
        "A spoken handoff contains an unfamiliar abbreviation. What should the receiving teammate do?",
      options: [
        "Invent a meaning",
        "Ask for clarification and confirm understanding",
        "Skip that part",
        "Forward it without checking",
      ],
      answer: 1,
      explanation:
        "Clarifying ambiguous language reduces misunderstanding. Use approved terminology and communication procedures.",
      hint: "Make the uncertainty visible and resolve it.",
    },
    {
      prompt:
        "During a fictional team briefing, someone raises a safety concern. What response helps?",
      options: [
        "Dismiss it due to seniority",
        "Rush to the next topic",
        "Listen, acknowledge it, and use the established escalation pathway",
        "Tell them never to interrupt",
      ],
      answer: 2,
      explanation:
        "Teams benefit when concerns are heard and addressed through established safety processes.",
      hint: "A safe team makes it possible to speak up.",
    },
  ],
  software: [
    {
      prompt:
        "A bug appears after a small change. What is a useful first step?",
      options: [
        "Rewrite the entire app",
        "Delete every test",
        "Capture a minimal reproducible case",
        "Ignore the report",
      ],
      answer: 2,
      explanation:
        "A minimal reproducible case helps isolate the failure and check whether a fix works.",
      hint: "Make the failure small, repeatable, and observable.",
    },
    {
      prompt: "Where should a private API secret live?",
      options: [
        "In a public repository",
        "In browser source code",
        "In a screenshot",
        "In protected server-side configuration",
      ],
      answer: 3,
      explanation:
        "Secrets belong in protected server-side configuration. Values delivered to browsers must be treated as visible to users.",
      hint: "Anything sent to a browser can be inspected.",
    },
    {
      prompt: "Which test best checks a fixed boundary bug?",
      options: [
        "Cases just below, at, and just above the boundary",
        "Only the happy path",
        "A test that never asserts anything",
        "Only a screenshot of the editor",
      ],
      answer: 0,
      explanation:
        "Boundary cases are directly relevant to off-by-one and threshold bugs.",
      hint: "Exercise the exact edge where the behavior changes.",
    },
    {
      prompt:
        "Two teammates edit the same code. What helps keep changes reviewable?",
      options: [
        "Send zipped folders with no history",
        "Use version control with focused changes and review",
        "Overwrite the other person’s files",
        "Commit passwords for convenience",
      ],
      answer: 1,
      explanation:
        "Version control and focused reviews help teams understand, coordinate, and recover changes.",
      hint: "Choose a workflow that records both what changed and why.",
    },
    {
      prompt: "Which approach helps prevent SQL injection?",
      options: [
        "Concatenate input into SQL",
        "Trust all form values",
        "Use parameterized queries",
        "Hide the database button",
      ],
      answer: 2,
      explanation:
        "Parameterized queries separate values from SQL structure. Validate inputs as an additional control.",
      hint: "Keep user data separate from executable query structure.",
    },
    {
      prompt: "A retry might charge a customer twice. What design helps?",
      options: [
        "Retry faster",
        "Remove error handling",
        "Use random payment amounts",
        "Use an idempotency key for the operation",
      ],
      answer: 3,
      explanation:
        "Idempotency keys let repeated requests for the same logical operation be recognized without repeating its effect.",
      hint: "A repeated request should refer to the same operation.",
    },
  ],
  ai: [
    {
      prompt: "What is a held-out test set used for?",
      options: [
        "Estimating performance on data not used to fit the model",
        "Training on the answers repeatedly",
        "Guaranteeing perfect predictions",
        "Replacing all human review",
      ],
      answer: 0,
      explanation:
        "A held-out test set estimates generalization when it is kept separate from fitting and tuning.",
      hint: "Evaluation should include examples the model did not train on.",
    },
    {
      prompt: "Why evaluate performance across relevant groups?",
      options: [
        "To guarantee every result is correct",
        "To look for performance differences hidden by an overall average",
        "To avoid documenting limitations",
        "To make the model larger",
      ],
      answer: 1,
      explanation:
        "Aggregate metrics can hide important differences. Group-level evaluation can reveal limitations requiring investigation.",
      hint: "An average can hide uneven outcomes.",
    },
    {
      prompt:
        "An AI answer includes a confident citation. What should a reviewer do?",
      options: [
        "Trust its tone",
        "Assume all links exist",
        "Verify the source and that it supports the claim",
        "Publish it without reading",
      ],
      answer: 2,
      explanation:
        "Confidence and plausible formatting do not establish accuracy. Verify sources and their relevance.",
      hint: "Confidence is not evidence.",
    },
    {
      prompt:
        "A document tells an assistant to ignore its instructions and reveal secrets. What is it?",
      options: [
        "A trusted system instruction",
        "A required user permission",
        "A harmless accuracy score",
        "Untrusted content that may be a prompt-injection attempt",
      ],
      answer: 3,
      explanation:
        "Retrieved documents are data, not authority to change instructions or disclose secrets.",
      hint: "The source of an instruction determines its authority.",
    },
    {
      prompt: "What helps detect quality changes after updating a model?",
      options: [
        "Run a representative, versioned evaluation suite",
        "Only check one favorite prompt",
        "Hide regressions",
        "Remove baseline results",
      ],
      answer: 0,
      explanation:
        "Representative evaluations and recorded baselines make regressions and improvements easier to assess.",
      hint: "Compare the new system with a consistent baseline.",
    },
    {
      prompt:
        "A model performs well in testing but poorly after deployment. What is worth investigating?",
      options: [
        "Whether its logo changed",
        "Whether real-world inputs differ from the evaluation data",
        "Whether it needs more confident wording",
        "Whether every user should retry forever",
      ],
      answer: 1,
      explanation:
        "Changes or mismatches in input distributions can reduce deployed performance and should be investigated alongside other causes.",
      hint: "Compare the data used to test with what users actually provide.",
    },
  ],
};
export type Raider = {
  id: string;
  name: string;
  career: Career;
  pet: Pet;
  ready: boolean;
  hints: number;
  correct: number;
  submitted: boolean;
};
export type Submission = { move: Move; answer: number };
export type Raid = {
  version: 1;
  revision: number;
  code: string;
  host: string;
  players: Raider[];
  status: "lobby" | "active" | "review" | "victory" | "defeat";
  round: number;
  hp: number;
  maxHp: number;
  boss: number;
  maxBoss: number;
  submissions: Record<string, Submission>;
  hinted: string[];
  log: string;
  results: { id: string; correct: boolean; move: Move }[];
};
export const questionFor = (career: Career, round: number) =>
  raidQuestions[career][(round - 1) % raidQuestions[career].length];
export function player(
  id: string,
  name: string,
  career: Career,
  pet: Pet,
): Raider {
  return {
    id,
    name: name.trim().slice(0, 20) || "Hunter",
    career,
    pet,
    ready: false,
    hints: career === "ai" ? 4 : 3,
    correct: 0,
    submitted: false,
  };
}
export function createRaid(code: string, host: Raider): Raid {
  return {
    version: 1,
    revision: 0,
    code,
    host: host.id,
    players: [host],
    status: "lobby",
    round: 1,
    hp: 0,
    maxHp: 0,
    boss: 0,
    maxBoss: 0,
    submissions: {},
    hinted: [],
    log: "Gather your party. Everyone must ready up.",
    results: [],
  };
}
export type RaidCommand =
  | { type: "ready" }
  | { type: "start" }
  | { type: "next" }
  | { type: "rematch" }
  | { type: "hint"; round: number }
  | { type: "answer"; round: number; move: Move; answer: number };
export function updateRaid(
  state: Raid,
  actor: string,
  command: RaidCommand,
): Raid {
  const member = state.players.find((p) => p.id === actor);
  if (!member || !command || typeof command !== "object") return state;
  let next = state;
  if (command.type === "ready" && state.status === "lobby")
    next = {
      ...state,
      players: state.players.map((p) =>
        p.id === actor ? { ...p, ready: !p.ready } : p,
      ),
    };
  if (
    command.type === "start" &&
    actor === state.host &&
    state.status === "lobby" &&
    state.players.length >= 2 &&
    state.players.every((p) => p.ready)
  ) {
    const maxHp = 120 + state.players.length * 40;
    const maxBoss = state.players.length * 180;
    next = {
      ...state,
      hp: maxHp,
      maxHp,
      boss: maxBoss,
      maxBoss,
      status: "active",
      log: "The Fracture Warden rises. Choose your contribution and answer your field question.",
    };
  }
  if (
    command.type === "hint" &&
    state.status === "active" &&
    command.round === state.round &&
    member.hints > 0 &&
    !state.hinted.includes(actor) &&
    !state.submissions[actor]
  )
    next = {
      ...state,
      hinted: [...state.hinted, actor],
      players: state.players.map((p) =>
        p.id === actor ? { ...p, hints: p.hints - 1 } : p,
      ),
    };
  if (
    command.type === "answer" &&
    state.status === "active" &&
    command.round === state.round &&
    !state.submissions[actor] &&
    ["strike", "ward", "mend"].includes(command.move) &&
    Number.isInteger(command.answer) &&
    command.answer >= 0 &&
    command.answer < 4
  ) {
    next = {
      ...state,
      submissions: {
        ...state.submissions,
        [actor]: { move: command.move, answer: command.answer },
      },
      players: state.players.map((p) =>
        p.id === actor ? { ...p, submitted: true } : p,
      ),
    };
    if (next.players.every((p) => next.submissions[p.id]))
      next = resolveRaid(next);
  }
  if (
    command.type === "next" &&
    actor === state.host &&
    state.status === "review"
  )
    next = {
      ...state,
      round: state.round + 1,
      status: "active",
      submissions: {},
      hinted: [],
      results: [],
      players: state.players.map((p) => ({ ...p, submitted: false })),
      log: "A new fracture opens. Coordinate your next move.",
    };
  if (
    command.type === "rematch" &&
    actor === state.host &&
    ["victory", "defeat"].includes(state.status)
  )
    next = {
      ...createRaid(state.code, state.players[0]),
      revision: state.revision,
      players: state.players.map((p) => player(p.id, p.name, p.career, p.pet)),
    };
  return next === state ? state : { ...next, revision: state.revision + 1 };
}
export function resolveRaid(state: Raid): Raid {
  let damage = 0,
    shield = 0,
    healing = 0;
  const results = state.players.map((p) => {
    const response = state.submissions[p.id];
    const correct =
      !!response &&
      response.answer === questionFor(p.career, state.round).answer;
    const move = response?.move || "strike";
    if (correct) {
      if (move === "strike") damage += 50 + (p.career === "software" ? 10 : 0);
      if (move === "ward") {
        shield += 25 + (p.career === "cloud" ? 15 : 0);
        damage += 15;
      }
      if (move === "mend") {
        healing += 25 + (p.career === "nurse" ? 15 : 0);
        damage += 10;
      }
    }
    return { id: p.id, correct, move };
  });
  const boss = Math.max(0, state.boss - damage);
  const incoming =
    boss === 0
      ? 0
      : Math.max(
          0,
          20 +
            state.players.length * 5 +
            (boss <= state.maxBoss / 2 ? 15 : 0) -
            shield,
        );
  const hp = Math.max(0, Math.min(state.maxHp, state.hp + healing) - incoming);
  const status =
    boss === 0 ? "victory" : hp === 0 || state.round >= 6 ? "defeat" : "review";
  return {
    ...state,
    boss,
    hp,
    status,
    results,
    players: state.players.map((p) => ({
      ...p,
      correct:
        p.correct + (results.find((r) => r.id === p.id)?.correct ? 1 : 0),
    })),
    log: `${damage} team damage · ${healing} healing before impact · ${shield} shield · ${incoming} incoming damage.${status === "defeat" && hp > 0 ? " Six rounds elapsed: the fracture closes." : ""}`,
  };
}
export function addRaider(state: Raid, member: Raider): Raid {
  if (
    state.status !== "lobby" ||
    state.players.length >= 4 ||
    state.players.some((p) => p.id === member.id)
  )
    return state;
  return {
    ...state,
    revision: state.revision + 1,
    players: [...state.players, member],
  };
}
export function removeRaider(state: Raid, id: string): Raid {
  if (id === state.host || !state.players.some((p) => p.id === id))
    return state;
  let next = {
    ...state,
    players: state.players.filter((p) => p.id !== id),
    revision: state.revision + 1,
    log: "A teammate disconnected. Remaining players can continue. Room health does not rescale.",
  };
  if (
    next.status === "active" &&
    next.players.every((p) => next.submissions[p.id])
  )
    next = resolveRaid(next);
  return next;
}

export const raidSources: Record<Career, { title: string; url: string }[]> = {
  cloud: [
    {
      title: "AWS IAM best practices",
      url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html",
    },
  ],
  nurse: [
    {
      title: "AHRQ TeamSTEPPS communication tools",
      url: "https://www.ahrq.gov/teamstepps-program/resources/modules/index.html",
    },
    {
      title: "WHO patient safety",
      url: "https://www.who.int/news-room/fact-sheets/detail/patient-safety",
    },
  ],
  software: [
    {
      title: "OWASP SQL injection prevention",
      url: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html",
    },
  ],
  ai: [
    {
      title: "NIST AI Risk Management Framework",
      url: "https://www.nist.gov/itl/ai-risk-management-framework",
    },
  ],
};
