import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { createThemeBuilder } from "@pkvsinha/react-theme";
import { basePlugin } from "@pkvsinha/react-base";
import { layoutPlugin } from "../src/builder/plugin/layout";

const outDir = resolve(process.cwd(), "dist");
mkdirSync(outDir, { recursive: true });

const builder = createThemeBuilder().use(basePlugin()).use(layoutPlugin());
const css = builder.toString({ minify: false });
const cssMin = builder.toString({ minify: true });

writeFileSync(resolve(outDir, "pkv.layout.css"), css, "utf8");
writeFileSync(resolve(outDir, "pkv.layout.min.css"), cssMin, "utf8");
