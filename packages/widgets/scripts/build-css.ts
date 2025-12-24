import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { createThemeBuilder } from "@pkvsinha/react-theme";
import { basePlugin } from "@pkvsinha/react-base";
import { layoutPlugin } from "@pkvsinha/react-layout";
import { componentsPlugin } from "@pkvsinha/react-components";
import { widgetsPlugin } from "../src/builder/plugin/widget";

const outDir = resolve(process.cwd(), "dist");
mkdirSync(outDir, { recursive: true });

const builder = createThemeBuilder()
  .use(basePlugin())
  .use(layoutPlugin())
  .use(componentsPlugin())
  .use(widgetsPlugin());
const css = builder.toString({ minify: false });
const cssMin = builder.toString({ minify: true });

writeFileSync(resolve(outDir, "kitsy.widgets.css"), css, "utf8");
writeFileSync(resolve(outDir, "kitsy.widgets.min.css"), cssMin, "utf8");
