import { access } from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";

const CANDIDATES = [
  "kitsy.config.mjs",
  "kitsy.config.cjs",
  "kitsy.config.js",
  "kitsy.config.json",
];

async function findConfig(cwd = process.cwd()) {
  const matches = await fg(
    [
      "kitsy.config.{mjs,cjs,js,json}",
      "{src,config}/kitsy.config.{mjs,cjs,js,json}",
    ],
    {
      cwd,
      absolute: true,
      onlyFiles: true,
      ignore: ["**/node_modules/**", "**/dist/**", "**/.git/**"],
    },
  );
  return matches.at(0);
}

async function lookupConfig(start = process.cwd()) {
  let dir = path.resolve(start);
  // stop at filesystem root
  while (true) {
    try {
      const config = await findConfig(dir);
      if (config) return [config, dir] as [string, string]; // file exists & is readable
    } catch {}
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return [undefined, dir];
}
export { lookupConfig };
