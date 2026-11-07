import type { Career, Pet } from "./raid";

// Original low-resolution sprites. One character is one pixel; SVG keeps the
// integer grid sharp at every display size without external asset requests.
const hunter = [
  "........hhhhh...........",
  ".......hHHHHHh..........",
  "......hHHHHHHHh.........",
  "......hHssssHh..........",
  "......hssesssh..........",
  ".......sssss............",
  ".....ccaaaaac...........",
  "....cCCaAAaAcc..........",
  "...cCCcaAAAacc..........",
  "...cCcgaAAAgacc.........",
  "...cCgggaAgggcc....w....",
  "....cgggAAAggc....wWw...",
  "....c.ggAAAgg....wWWw...",
  "...cc..aaaaa.....wWWw...",
  "...cc..bBBbb.....wWWw...",
  "...cc..bBBbb.....wWWw...",
  "...cc..bB.bb......wW....",
  "...cc..bB.bb.....gggg...",
  "...cc..bB.bb......gg....",
  "....c..bB.bb............",
  ".......bb.bbb...........",
  "......ggg.gggg..........",
  "......ggg.gggg..........",
  "........................",
];
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
      viewBox="0 0 24 26"
      role="img"
      aria-label={`Pixel ${career} hunter with an energy blade`}
      shapeRendering="crispEdges"
    >
      <path d="M4 24h17v1H4z" fill="#080e24" opacity=".6" />
      <g className="sprite-idle">
        <Pixels
          rows={hunter}
          palette={{
            h: "#17213c",
            H: "#dfecff",
            s: "#ecba9c",
            e: "#20334b",
            c: "#29284f",
            C: "#645a9c",
            a: "#304b65",
            A: accents[career],
            g: "#b4c8dc",
            b: "#16223b",
            B: "#48627f",
            w: "#479aaf",
            W: "#c7fff3",
          }}
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
      aria-label="Pixel Warden in violet crystal armor"
      shapeRendering="crispEdges"
    >
      <path d="M3 29h20v1H3z" fill="#090d23" opacity=".65" />
      <g className="sprite-idle">
        <Pixels
          rows={warden}
          palette={{
            v: "#1e1c37",
            V: "#60538e",
            L: "#b49bcc",
            d: "#30334d",
            E: "#9ffff3",
            p: "#a16bdf",
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
    <svg
      className={`scenery pixel-landscape ${arena ? "arena-scenery" : ""}`}
      viewBox="0 0 320 168"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={
        arena
          ? "Pixel moonlit citadel battleground"
          : "Pixel floating citadel above moonlit mountains and a glowing river"
      }
      shapeRendering="crispEdges"
    >
      <path fill="#111b35" d="M0 0h320v168H0z" />
      <path fill="#1c2848" d="M0 45h320v123H0z" />
      <path fill="#303853" d="M0 80h320v88H0z" />
      {Array.from({ length: 40 }, (_, i) => (
        <rect
          className={i % 5 === 0 ? "pixel-star" : ""}
          key={i}
          x={(i * 43 + 7) % 320}
          y={(i * 17 + 4) % 75}
          width={i % 5 === 0 ? 2 : 1}
          height="1"
          fill={i % 3 ? "#849cbb" : "#e3d8b3"}
        />
      ))}
      <path
        fill="#e5d9b0"
        d="M257 12h14v3h5v5h3v14h-3v5h-5v3h-14v-3h-5v-5h-3V20h3v-5h5z"
      />
      <path fill="#bcb9a1" d="M271 15h5v5h3v14h-3v5h-5v3h-7v-3h6v-5h3V21h-2z" />
      <g fill="#4a506b">
        <path d="M0 94h15v-8h12v-9h9v-8h8v-8h9v14h9v9h13v12h14v72H0zM90 100h12V88h12V77h9V65h8v-9h9v14h10v13h13v17h16v68H90zM230 105h12V88h9V78h9V62h7v-9h10v19h10v15h15v11h18v70h-90z" />
      </g>
      <path
        fill="#303e5b"
        d="M0 114h24v-9h19v-9h15v10h15v12h16v-9h19v-8h12v-7h13v12h17v12h19v-10h20V96h18v12h19v10h16v-12h21v-9h15v14h18v12h24v45H0z"
      />
      <path
        fill="#1b3048"
        d="M0 130h32v-8h28v10h27v-7h30v9h39v-10h30v9h30v-10h32v10h30v-9h42v44H0z"
      />
      <path
        fill="#3a6676"
        d="M135 124h36v5h-15v5h-21v6h40v6h30v7h-18v5h-80v-7h30v-7h-30v-7h15v-6h13z"
      />
      <g className="river-shimmer" fill="#80b5b0">
        <path d="M138 129h19v1h-19zM129 138h25v1h-25zM143 147h32v1h-32zM124 155h45v1h-45z" />
      </g>
      <g className="floating-citadel">
        <path
          fill="#1b223b"
          d="M185 111h92v7h-9v9h-13v10h-12v10h-11v-8h-13v-12h-18v-8h-16z"
        />
        <path
          fill="#43516c"
          d="M180 105h102v7H180zM192 112h75v5h-75zM216 119h9v12h-9zM238 125h6v14h-6z"
        />
        <path fill="#627584" d="M185 101h92v5h-92z" />
        {[198, 219, 244, 261].map((x, i) => (
          <g key={x}>
            <path fill="#394862" d={`M${x} ${i % 2 ? 61 : 73}h12v39h-12z`} />
            <path fill="#77849b" d={`M${x} ${i % 2 ? 61 : 73}h3v39h-3z`} />
            <path
              fill="#433b69"
              d={`M${x - 3} ${i % 2 ? 61 : 73}h18v-4h-3v-4h-3v-4h-6v4h-3v4h-3z`}
            />
            <rect
              x={x + 5}
              y={i % 2 ? 71 : 82}
              width="3"
              height="6"
              fill="#ffdb9e"
            />
          </g>
        ))}
        <path fill="#52617e" d="M228 42h17v62h-17z" />
        <path fill="#94a1b2" d="M228 42h3v62h-3z" />
        <path
          fill="#625485"
          d="M224 42h25v-4h-4v-7h-4v-7h-4v-8h-2v8h-4v7h-3v7h-4z"
        />
        <path fill="#e5c1ff" d="M235 48h4v7h-4zM235 60h4v7h-4z" />
        <path fill="#1e263e" d="M222 104V86h5v-5h18v5h5v18z" />
        <path
          className="portal-light"
          fill="#b6a3ee"
          d="M228 103V88h5v-3h7v3h4v15z"
        />
        <path fill="#8391a5" d="M226 104h20v3h-20zM222 107h28v3h-28z" />
        <path className="pixel-banner" fill="#d7a46d" d="M239 17h12v6h-12z" />
      </g>
      {arena && (
        <g>
          <path fill="#293a4e" d="M0 130h320v38H0z" />
          <path fill="#58707e" d="M0 131h320v2H0z" />
          {Array.from({ length: 7 }, (_, y) =>
            Array.from({ length: 17 }, (_, x) => (
              <rect
                key={`${x}-${y}`}
                x={x * 21 - (y % 2) * 10}
                y={135 + y * 6}
                width="19"
                height="4"
                fill={(x + y) % 3 ? "#34495b" : "#3f5767"}
              />
            )),
          )}
        </g>
      )}
      {[5, 29, 70, 292, 312].map((x, i) => (
        <g
          key={x}
          transform={`translate(${x} ${arena ? 109 : 132 - (i % 2) * 8})`}
        >
          <path d="M0 0h4v6h4v6h4v5H-8v-5h4V6h4z" fill="#132a37" />
          <path d="M0 16h4v10H0z" fill="#162337" />
        </g>
      ))}
    </svg>
  );
}
