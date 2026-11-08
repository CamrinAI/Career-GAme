import type { Career, Pet } from "./raid";

// Original low-resolution sprites. One character is one pixel; SVG keeps the
// integer grid sharp at every display size without external asset requests.
const hunter = [
  "........hhhhh...........",
  ".......hHHHHHh..........",
  "......hHHHHHHHh.........",
  "......hHssssHh..........",
  "......heeeeeeh..........",
  ".......sssss............",
  ".....ccaaaaac...........",
  "....cCCaAAaAcc..........",
  "...cCCcaAAAacc..........",
  "...cCcgaAAAgacc.........",
  "...cCgggaAgggcc....w....",
  "....cgggAAAggc....wWw...",
  "....c.ggAAAgg....wWWw...",
  "...cc..aaaaa.....wWWw...",
  "...cc..bBBbbgggggwWWw...",
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
      aria-label={`Pixel ${career} pilot in powered armor with a plasma blade`}
      shapeRendering="crispEdges"
    >
      <path d="M4 24h17v1H4z" fill="#080e24" opacity=".6" />
      <g className="sprite-idle">
        <Pixels
          rows={hunter}
          palette={{
            h: "#17213c",
            H: "#b7cfdf",
            s: "#456a8d",
            e: "#a2ffff",
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
      aria-label="Pixel Warden security mech with a glowing reactor"
      shapeRendering="crispEdges"
    >
      <path d="M3 29h20v1H3z" fill="#090d23" opacity=".65" />
      <g className="sprite-idle">
        <Pixels
          rows={warden}
          palette={{
            v: "#1e1c37",
            V: "#3b537c",
            L: "#84b6d4",
            d: "#30334d",
            E: "#9ffff3",
            p: "#bb56c9",
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
      className={`scenery pixel-landscape orbital-scene ${arena ? "arena-scenery" : ""}`}
      viewBox="0 0 320 168"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={
        arena
          ? "Pixel orbital hangar with holographic conduits and a planet beyond the viewport"
          : "Pixel Nexus space station orbiting a cyan planet beneath a star field"
      }
      shapeRendering="crispEdges"
    >
      <path fill="#050d20" d="M0 0h320v168H0z" />
      {Array.from({ length: 65 }, (_, i) => (
        <rect
          key={i}
          className={i % 7 === 0 ? "pixel-star" : ""}
          x={(i * 43 + 9) % 320}
          y={(i * 19 + 4) % 125}
          width={i % 6 === 0 ? 2 : 1}
          height="1"
          fill={i % 3 ? "#47638a" : "#d0eaff"}
        />
      ))}
      <g className="orbital-planet">
        <path
          fill="#163c66"
          d="M222 14h44v4h12v6h8v10h5v14h3v26h-3v14h-5v10h-8v7h-12v4h-44v-4h-12v-7h-8V88h-5V74h-3V48h3V34h5V24h8v-6h12z"
        />
        <path
          fill="#246b89"
          d="M222 18h35v4h-15v6h-17v8h-12v15h-7v17h-8V48h3V34h5v-8h16zM264 29h13v7h8v16h4v22h-6V59h-9V45h-10zM218 74h13v6h15v9h14v12h-35v-5h-13V84h6z"
        />
        <path
          fill="#58bcbd"
          d="M223 23h14v3h-14zM207 43h3v16h-3zM252 86h15v3h-15z"
        />
        <path
          d="M184 81h21v-3h22v-3h26v-3h28v-3h27"
          stroke="#83e7ee"
          strokeWidth="2"
          fill="none"
        />
      </g>
      <g className="orbital-traffic" fill="#7ef0e4">
        <path d="M151 34h8v2h-8zM146 35h5v1h-5z" />
        <path fill="#ff8cc8" d="M286 117h11v2h-11z" />
      </g>
      <g className="nexus-station">
        <path
          fill="#15253e"
          d="M161 97h129v8H161zM174 105h102v6H174zM189 111h70v9h-70zM214 120h22v17h-22z"
        />
        <path fill="#536c88" d="M161 96h129v3H161zM185 108h79v2h-79z" />
        <path
          fill="#1e3450"
          d="M181 79h99v17h-99zM199 62h62v17h-62zM218 32h25v64h-25z"
        />
        <path
          fill="#4a6284"
          d="M218 32h4v64h-4zM199 62h3v17h-3zM181 79h3v17h-3z"
        />
        <path
          fill="#a4f5f0"
          d="M225 42h10v3h-10zM225 49h10v3h-10zM225 56h10v3h-10z"
        />
        <path
          fill="#6ee4e0"
          d="M186 84h22v2h-22zM247 84h26v2h-26zM203 69h11v2h-11zM248 69h9v2h-9z"
        />
        <path
          fill="#ce79dd"
          d="M226 23h8v9h-8zM229 14h2v9h-2zM216 99h28v3h-28z"
        />
        <path fill="#0c192e" d="M211 96V79h4v-5h25v5h4v17z" />
        <path
          className="portal-light"
          fill="#66dfec"
          d="M217 95V81h4v-3h13v3h4v14z"
        />
        {[163, 268].map((x) => (
          <g key={x}>
            <path fill="#354d71" d={`M${x} 67h12v29h-12z`} />
            <path
              fill="#12233f"
              d={`M${x - 14} 62h10v23h-10zM${x + 17} 62h10v23h-10z`}
            />
            <path
              stroke="#6c92bf"
              strokeWidth="1"
              d={`M${x - 9} 63v21M${x + 22} 63v21`}
            />
            <path fill="#d182db" d={`M${x + 4} 70h4v8h-4z`} />
          </g>
        ))}
        <g className="station-thrust" fill="#54d5ed">
          <path d="M193 114h8v14h-8zM249 114h8v14h-8z" />
          <path fill="#bbfbff" d="M195 114h4v8h-4zM251 114h4v8h-4z" />
        </g>
      </g>
      {arena && (
        <g>
          <path fill="#0c1b30" d="M0 126h320v42H0z" />
          <path fill="#294963" d="M0 126h320v3H0z" />
          {Array.from({ length: 7 }, (_, i) => (
            <path
              key={i}
              stroke="#26485e"
              strokeWidth="1"
              d={`M${i * 65 - 35} 168 ${128 + i * 10} 128M0 ${130 + i * i}h320`}
            />
          ))}
          <path
            className="hangar-conduit"
            fill="#64deda"
            d="M0 145h70v3h35v3h45v2h-48v-2H67v-3H0zM320 145h-64v3h-40v3h-38v2h41v-2h40v-3h61z"
          />
          <path
            fill="#2a3e58"
            d="M0 0h10v130H0zM310 0h10v130h-10zM0 0h320v5H0z"
          />
          <path fill="#6ce9e1" d="M7 24h2v42H7zM311 24h2v42h-2z" />
          <path fill="#bd6ef0" d="M7 85h2v26H7zM311 85h2v26h-2z" />
        </g>
      )}
    </svg>
  );
}
