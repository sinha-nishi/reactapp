import { readFileSync } from "node:fs";
import { resolve, extname } from "node:path";
import { parsePkvCss } from "./parse";
import { PkvOptions } from "./postcss";

export async function loadAndParse(file: string, opts?: any) {
  const abs = resolve(process.cwd(), file);
  console.log(`ℹ️  loading file and parsing ${abs}...`);
  const ext = extname(abs);

  let css = "";
  if (ext === ".scss" || ext === ".sass") {
    const { compile } = await import("sass"); // dart-sass
    css = compile(abs, { style: "expanded" }).css;
  } else if (ext === ".less") {
    const less = await import("less");
    const src = readFileSync(abs, "utf8");
    const out = await less.render(src, { filename: abs });
    css = out.css;
  } else {
    css = readFileSync(abs, "utf8");
  }

  return parsePkvCss(css, {
    layerFromPath: true,
    acceptUnprefixedLayer: true,
    ...(opts || {}),
  });
}
