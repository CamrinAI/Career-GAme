import { build } from "esbuild";
import { cp, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const target = path.resolve("../quest-rank-rooms");
await mkdir(path.join(target, "worker"), { recursive: true });
await build({
  entryPoints: ["room-service/worker.ts"],
  outfile: path.join(target, "worker/index.js"),
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
});
await cp("room-service/drizzle", path.join(target, "drizzle"), {
  recursive: true,
});
console.log("Prepared room service Worker and schema migrations.");
