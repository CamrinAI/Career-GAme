import type { Career, Pet } from "./raid";

// Original low-resolution sprites. One character is one pixel; SVG keeps the
// integer grid sharp at every display size without external asset requests.
const warden = [
  "......v............v......",
  "......vv..........vv......",
  "......vVv........vVv......",
  ".......vVvVVVVVVvVv.......",
  ".......vVVVVVVVVVVv.......",
  ".......vVddddddVVVv.......",
  ".......vVdEddEdVVVv.......",
  "........vddddddVVv........",
  ".........vvVVVVvv.........",
  "....vvvVVVVVVVVVVVVvvv....",
  "...vVVVLLVVVVVVVVLLVVVv...",
  "..vVVVLLLVVppVVVLLLVVVVv..",
  "..vVvvvvVVppPpVVVvvvvVVv..",
  "..vVVv.vVVpPPpVVv.vVVVVv..",
  "..vVVv.vVVVppVVVv.vVVVVv..",
  "..vVVv.vVVVppVVVv.vVLLVv..",
  "..vVVv.vVVVVVVVVv.vVLLVv..",
  "..vVVv..vVVVVVVv..vVLLVv..",
  "..vddv..vLLLLLLv..vVVVVv..",
  "..vddv..vvvvvvvv..vVVVVv..",
  "...vv...vVVvvVVv...vvvv...",
  "........vVVvvVVv..........",
  ".......vVVv..vVVv.........",
  ".......vVVv..vVVv.........",
  ".......vVVv..vVVv.........",
  "......vVVVv..vVVVv........",
  ".....vLLLLv..vLLLLv.......",
  ".....vvvvvv..vvvvvv.......",
  "..........................",
];
const petSprites: Record<Pet, string[]> = {
  owl: [
    "..p.........p..",
    "..pp.......pp..",
    "..pPpppppppPp..",
    ".pPPPPPPPPPPPp.",
    ".pPwwwPPPwwwPp.",
    ".pPwDwPPPwDwPp.",
    ".pPwwwPPPwwwPp.",
    ".pPPPPPqPPPPPp.",
    "..pPPPPqPPPPp..",
    "..pPPpPPPpPPp..",
    "...pPPpppPPp...",
    "....ppppppp....",
    ".....q...q.....",
  ],
  fox: [
    "..p.........p..",
    "..pp.......pp..",
    "..pwp.....pwp..",
    "..pPpppppppPp..",
    "..pPPPPPPPPPp..",
    ".pPPDPPPPPDPPp.",
    ".pPwwPPPPPwwPp.",
    "..pwwwwDwwwwp..",
    "...pwwwwwwwp...",
    "....pPPPPPp..pp",
    "....pPPPPp..pwp",
    "....pPPPPpppwwp",
    ".....pppppppp..",
  ],
  sprite: [
    ".......p.......",
    "......pwp......",
    "......pwp......",
    "...pppPPPppp...",
    "..pPPwwwwwPPp..",
    ".pPPwDwDwDwPPp.",
    "pwwPwDwwwDwPwwp",
    ".pPPwwwwwwwPPp.",
    "..pPPwwwwwPPp..",
    "...pppPPPppp...",
    "......pwp......",
    "......pwp......",
    ".......p.......",
  ],
};
const accents: Record<Career, string> = {
  cloud: "#74e4e8",
  nurse: "#90e6b1",
  software: "#ffc878",
  ai: "#bd9dff",
};
function Pixels({
  rows,
  palette,
}: {
  rows: string[];
  palette: Record<string, string>;
}) {
  return (
    <>
      {rows.flatMap((row, y) =>
        [...row].map((color, x) =>
          color === "." ? null : (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="1"
              height="1"
              fill={palette[color] || "#121326"}
            />
          ),
        ),
      )}
    </>
  );
}
export function Hunter({ career = "cloud" }: { career?: Career }) {
  return (
    <svg
      className={`hunter-illustration pixel-sprite career-${career}`}
      viewBox="0 0 100 120"
      role="img"
      aria-label={
        career === "nurse"
          ? "Pixel Nurse Sentinel field medic with a scanner and medical backpack"
          : `Pixel ${career} space explorer with a life-support pack and energy tool`
      }
    >
      <ellipse cx="50" cy="116" rx="29" ry="3" fill="#302534" opacity=".2" />
      <path d="M35 115h30" stroke={accents[career]} strokeWidth="2" />
      <g className="adventurer-idle">
        <image
          href={
            career === "nurse"
              ? new URL("./assets/medic.png", import.meta.url).href
              : new URL("./assets/space-explorer.png", import.meta.url).href
          }
          x="0"
          y="0"
          width="100"
          height="114"
          preserveAspectRatio="xMidYMax meet"
        />
      </g>
    </svg>
  );
}
export function Warden() {
  return (
    <svg
      className="warden pixel-sprite"
      viewBox="0 0 26 31"
      role="img"
      aria-label="Pixel Citadel security robot with a glowing energy core"
      shapeRendering="crispEdges"
    >
      <path d="M3 29h20v1H3z" fill="#090d23" opacity=".65" />
      <g className="sprite-idle">
        <Pixels
          rows={warden}
          palette={{
            v: "#1e1c37",
            V: "#596cc0",
            L: "#b2c5eb",
            d: "#30334d",
            E: "#9ffff3",
            p: "#dfb950",
            P: "#f0cfff",
          }}
        />
      </g>
    </svg>
  );
}
export function PixelPet({ pet, name }: { pet: Pet; name: string }) {
  return (
    <svg
      className={`pet-portrait pixel-sprite pet-${pet}`}
      viewBox="0 0 15 15"
      role="img"
      aria-label={name}
      shapeRendering="crispEdges"
    >
      <g className="pet-bob">
        <Pixels
          rows={petSprites[pet]}
          palette={{
            p: "#26243f",
            P:
              pet === "fox"
                ? "#e0a263"
                : pet === "sprite"
                  ? "#7fe3c4"
                  : "#b29ce4",
            w: "#f9edcf",
            D: "#263751",
            q: "#efbb70",
          }}
        />
      </g>
    </svg>
  );
}
export function Scenery({ arena = false }: { arena?: boolean }) {
  return (
    <div
      className={`scenery skybound-scenery ${arena ? "arena-scenery" : ""}`}
      role="img"
      aria-label={
        arena
          ? "Pixel eco-station landing platform beneath a floating research facility"
          : "Colorful pixel eco-tech islands with biodomes, solar panels, spacecraft and a waterfall"
      }
    >
      <img
        src={new URL("./assets/eco-station.png", import.meta.url).href}
        alt=""
      />
      <span className="sky-sparkles" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}
