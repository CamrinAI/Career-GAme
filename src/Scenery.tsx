import type { Career, Pet } from "./raid";
import { classAppearances } from "./appearances";

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
  const look = classAppearances[career];
  return (
    <svg
      className={`hunter-illustration pixel-sprite career-${career}`}
      viewBox="0 0 100 120"
      role="img"
      aria-label={look.label}
    >
      <ellipse cx="50" cy="116" rx="29" ry="3" fill="#302534" opacity=".2" />
      <path d="M35 115h30" stroke={look.accent} strokeWidth="2" />
      <g className="adventurer-idle">
        <image
          href={look.asset}
          x="0"
          y="0"
          width="100"
          height="114"
          preserveAspectRatio="xMidYMax meet"
        />
      </g>
      {career === "ai" && (
        <g transform="translate(0 -18)" aria-hidden="true">
          <g className="holo-assistant">
            <path d="M79 54 84 51 89 54" fill="#59dfff" opacity=".12" />
            <ellipse
              className="holo-orbit"
              cx="84"
              cy="42"
              rx="15"
              ry="5"
              fill="none"
              stroke="#79f7f4"
              strokeWidth=".8"
            />
            <circle
              cx="84"
              cy="42"
              r="11"
              fill="#142c55"
              fillOpacity=".85"
              stroke="#8ffff6"
              strokeWidth="1.2"
            />
            <path
              d="M77 35h14v2H77zM75 38h18v11H75zM78 49h12v2H78z"
              fill="#56bff0"
              fillOpacity=".45"
            />
            <path d="M78 40h3v2h-3zM87 40h3v2h-3z" fill="#d4ffff" />
            <path
              d="M79 46h2v-2h2v4h2v-3h2v1h2"
              fill="none"
              stroke="#a5fff3"
              strokeWidth="1"
            />
            <path
              d="M74 27h4M92 27h4M74 57h4M92 57h4"
              stroke="#c5b4ff"
              strokeWidth="1"
            />
          </g>
        </g>
      )}
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
