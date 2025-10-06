import { access } from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";

const CANDIDATES = [
  "pkv.config.mjs",
  "pkv.config.cjs",
  "pkv.config.js",
  "pkv.config.json",
];

async function findConfig(cwd = process.cwd()) {
  const matches = await fg(["pkv.config.{mjs,cjs,js,json}"], {
    cwd,
    absolute: true,
    onlyFiles: true,
  });
  return matches.at(0);
}

async function lookupConfig(start = process.cwd()) {
  let dir = path.resolve(start);
  // stop at filesystem root
  while (true) {
    for (const name of CANDIDATES) {
      const p = path.join(dir, name);
      try {
        await access(p); // file exists & is readable
        return [await findConfig(dir), dir] as [string, string];
      } catch {}
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return [undefined, dir];
}
export { lookupConfig };
