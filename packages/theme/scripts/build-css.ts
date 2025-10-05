import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { createThemeBuilder } from "../src";

const outDir = resolve(process.cwd(), "dist");
mkdirSync(outDir, { recursive: true });

const builder = createThemeBuilder();
const css = builder.toString({ minify: false });
const cssMin = builder.toString({ minify: true });

writeFileSync(resolve(outDir, "pkv.theme.css"), css, "utf8");
writeFileSync(resolve(outDir, "pkv.theme.min.css"), cssMin, "utf8");
