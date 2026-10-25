import type { Save } from "./engine.ts";

export type PerkId = "none" | "aegis-weave" | "focused-core" | "warden-sigil";
export type Rank = "E" | "D" | "C";
export type Destination = "academy" | "dungeon" | "profile";
export type Perk = {
  id: PerkId;
  name: string;
  description: string;
  requirement: string;
  hp: number;
  sp: number;
  special: number;
};

export const perks: Perk[] = [
  {
    id: "none",
    name: "Unmodified core",
    description: "The original Hunter loadout. No passive bonuses.",
    requirement: "Always available",
    hp: 0,
    sp: 0,
    special: 0,
  },
  {
    id: "aegis-weave",
    name: "Aegis Weave",
    description: "Begin each battle with 140 HP instead of 120.",
    requirement: "Complete your first Academy lesson",
    hp: 20,
    sp: 0,
    special: 0,
  },
  {
    id: "focused-core",
    name: "Focused Core",
    description: "Begin each battle with 40 SP instead of 20.",
    requirement: "Finish one Mastery Trial at any score",
    hp: 0,
    sp: 20,
    special: 0,
  },
  {
    id: "warden-sigil",
    name: "Warden Sigil",
    description: "Correct special skills deal 75 damage instead of 65.",
    requirement: "Defeat the IAM Warden",
    hp: 0,
    sp: 0,
    special: 10,
  },
];

export const perkFor = (id: PerkId): Perk =>
  perks.find((perk) => perk.id === id) ?? perks[0];
export function isPerkUnlocked(
  save: Pick<Save, "completed" | "rewards" | "wins">,
  id: PerkId,
): boolean {
  switch (id) {
    case "none":
      return true;
    case "aegis-weave":
      return save.completed.length > 0;
    case "focused-core":
      return save.rewards.includes("trial");
    case "warden-sigil":
      return save.wins > 0;
  }
}

export function rankFor(save: Pick<Save, "completed" | "rewards" | "wins">): {
  rank: Rank;
  title: string;
} {
  const academyComplete = [0, 1, 2, 3].every((id) =>
    save.completed.includes(id),
  );
  if (academyComplete && save.rewards.includes("trial") && save.wins > 0)
    return { rank: "C", title: "Cloud Warden" };
  if (academyComplete) return { rank: "D", title: "Cloud Apprentice" };
  return { rank: "E", title: "Cloud Initiate" };
}

export function nextObjective(
  save: Pick<Save, "completed" | "rewards" | "wins" | "clearedContracts">,
) {
  const lesson = [0, 1, 2, 3].find((id) => !save.completed.includes(id));
  if (lesson !== undefined)
    return {
      title: `Complete Academy lesson ${lesson + 1}`,
      detail: "A short lesson, a real-world example, and a knowledge check.",
      reward: "+100 XP · +100 mastery",
      destination: "academy" as Destination,
      trial: false,
      button: "Continue learning",
    };
  if (!save.rewards.includes("trial"))
    return {
      title: "Take your first Mastery Trial",
      detail:
        "Practice six questions at your own pace. Any score counts toward your milestone.",
      reward: "+150 XP · Focused Core unlock",
      destination: "academy" as Destination,
      trial: true,
      button: "Begin the trial",
    };
  if (save.wins === 0)
    return {
      title: "Defeat the IAM Warden",
      detail:
        "Equip a perk in your Hunter Profile, then bring your knowledge to the Citadel.",
      reward: "+300 XP · C-rank ascension",
      destination: "dungeon" as Destination,
      trial: false,
      button: "Challenge the Warden",
    };
  if (!contractsComplete(save))
    return {
      title: "Put your new powers to the test",
      detail:
        "Three optional contracts reward a victory with each earned perk. No timer or streak to maintain.",
      reward: "+75 XP · +25 mastery per contract",
      destination: "profile" as Destination,
      trial: false,
      button: "View field contracts",
    };
  return {
    title: "Your first chapter is complete",
    detail:
      "Your contracts are complete. Wear the Citadel Vanguard title, revisit a lesson, or try another strategy.",
    reward: "All current milestones earned",
    destination: "profile" as Destination,
    trial: false,
    button: "Explore your unlocks",
  };
}

export function milestones(save: Pick<Save, "completed" | "rewards" | "wins">) {
  return [
    {
      id: "first-lesson",
      title: "A spark of knowledge",
      detail: "Complete any Academy lesson.",
      reward: "Aegis Weave",
      earned: save.completed.length > 0,
    },
    {
      id: "academy",
      title: "The apprentice awakens",
      detail: "Complete all four IAM lessons.",
      reward: "D-rank · Cloud Apprentice",
      earned: [0, 1, 2, 3].every((id) => save.completed.includes(id)),
    },
    {
      id: "trial",
      title: "Practice makes a Hunter",
      detail: "Finish a Mastery Trial. Every score counts.",
      reward: "150 XP · Focused Core",
      earned: save.rewards.includes("trial"),
    },
    {
      id: "warden",
      title: "Breaker of the seal",
      detail: "Defeat the IAM Warden.",
      reward: "300 XP · Warden Sigil",
      earned: save.wins > 0,
    },
    {
      id: "ascension",
      title: "Citadel ascension",
      detail: "Finish the Academy, complete a trial, and defeat the Warden.",
      reward: "C-rank · Cloud Warden",
      earned: rankFor(save).rank === "C",
    },
  ];
}

export const contracts = [
  {
    id: "aegis-weave",
    name: "Stand unbroken",
    detail: "Defeat the IAM Warden with Aegis Weave equipped.",
    perk: "aegis-weave",
  },
  {
    id: "focused-core",
    name: "Channel the storm",
    detail: "Defeat the IAM Warden with Focused Core equipped.",
    perk: "focused-core",
  },
  {
    id: "warden-sigil",
    name: "Turn the seal",
    detail: "Defeat the IAM Warden with Warden Sigil equipped.",
    perk: "warden-sigil",
  },
] as const;
export type ContractId = (typeof contracts)[number]["id"];
export function contractsComplete(
  save: Pick<Save, "clearedContracts">,
): boolean {
  return contracts.every((contract) =>
    save.clearedContracts.includes(contract.id),
  );
}
