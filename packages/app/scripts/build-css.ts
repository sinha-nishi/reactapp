import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { material, app, ant } from "../src/theme";

const outDir = resolve(process.cwd(), "dist");
mkdirSync(outDir, { recursive: true });

writeFileSync(
  resolve(outDir, "kitsy.app.css"),
  app.toString({ minify: false }),
  "utf8",
);
writeFileSync(
  resolve(outDir, "kitsy.app.min.css"),
  app.toString({ minify: true }),
  "utf8",
);
writeFileSync(
  resolve(outDir, "kitsy.material.css"),
  material.toString({ minify: false }),
  "utf8",
);
writeFileSync(
  resolve(outDir, "kitsy.material.min.css"),
  material.toString({ minify: true }),
  "utf8",
);
writeFileSync(
  resolve(outDir, "kitsy.ant.css"),
  ant.toString({ minify: false }),
  "utf8",
);
writeFileSync(
  resolve(outDir, "kitsy.ant.min.css"),
  ant.toString({ minify: true }),
  "utf8",
);
