import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { createThemeBuilder, compatPlugin } from "../src";

const outDir = resolve(process.cwd(), "dist");
mkdirSync(outDir, { recursive: true });

const builder = createThemeBuilder();
builder.use(compatPlugin({ tailwind: true }));

const css = builder.toString({ minify: false });
const cssMin = builder.toString({ minify: true });
const cssLegacy = builder.toString({ minify: false, legacy: true });
const cssLegacyMin = builder.toString({ minify: true, legacy: true });

writeFileSync(resolve(outDir, "pkv.theme.css"), css, "utf8");
writeFileSync(resolve(outDir, "pkv.theme.min.css"), cssMin, "utf8");
writeFileSync(resolve(outDir, "pkv.theme.legacy.css"), cssLegacy, "utf8");
writeFileSync(
  resolve(outDir, "pkv.theme.legacy.min.css"),
  cssLegacyMin,
  "utf8",
);

// const cssCompat = builder.toString({ minify: false });
// const cssCompatMin = builder.toString({ minify: true });

// writeFileSync(resolve(outDir, "pkv.theme.compat.css"), cssCompat, "utf8");
// writeFileSync(resolve(outDir, "pkv.theme.compat.min.css"), cssCompatMin, "utf8");
