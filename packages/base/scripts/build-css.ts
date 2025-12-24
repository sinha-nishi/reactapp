import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { createThemeBuilder } from "@pkvsinha/react-theme";
import { basePlugin } from "../src/builder/plugin/base";

const outDir = resolve(process.cwd(), "dist");
mkdirSync(outDir, { recursive: true });

const builder = createThemeBuilder().use(basePlugin());
const css = builder.toString({ minify: false });
const cssMin = builder.toString({ minify: true });

writeFileSync(resolve(outDir, "kitsy.base.css"), css, "utf8");
writeFileSync(resolve(outDir, "kitsy.base.min.css"), cssMin, "utf8");
