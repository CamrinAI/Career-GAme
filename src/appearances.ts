import type { Career } from "./raid";

// Appearance is shared by selection, party sprites and the solo Cloud Warden.
// These costumes and the AI hologram are cosmetic; raid abilities live in raid.ts.
export const classAppearances: Record<
  Career,
  {
    asset: string;
    label: string;
    description: string;
    accent: string;
  }
> = {
  cloud: {
    asset: new URL("./assets/cloud-warden.png", import.meta.url).href,
    label:
      "Cloud Warden in cloud-shaped white and azure armor with a shield projector",
    description:
      "Cloud pauldrons · azure flight armor · shield projector · vapor jetpack.",
    accent: "#74e4e8",
  },
  nurse: {
    asset: new URL("./assets/medic.png", import.meta.url).href,
    label: "Nurse Sentinel field medic with a scanner and medical backpack",
    description: "Field medic uniform · medical backpack · diagnostic scanner.",
    accent: "#90e6b1",
  },
  software: {
    asset: new URL("./assets/software-vanguard.png", import.meta.url).href,
    label:
      "Software Vanguard in an amber tech hoodie with a laptop, headphones and developer tools",
    description:
      "Amber tech hoodie · headphones · debugging belt · rugged laptop.",
    accent: "#ffc878",
  },
  ai: {
    asset: new URL("./assets/ai-arcanist.png", import.meta.url).href,
    label:
      "AI Arcanist in a violet neural coat with a hovering holographic assistant",
    description:
      "Neural research coat · wrist projector · hovering holo assistant.",
    accent: "#bd9dff",
  },
};
