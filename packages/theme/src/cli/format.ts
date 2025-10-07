import fs from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";

export async function formatCss(css: string, opts: { filepath?: string } = {}) {
  // If you know where this file will be written, pass that path as `filepath`.
  // It lets Prettier find the right config and infer the parser.
  const { filepath } = opts;

  // Load user config (prettier.config.* / .prettierrc*), if any.
  const userConfig = await prettier.resolveConfig(filepath ?? process.cwd(), {
    useCache: true,
  });

  // Decide the parser. CSS output can use "css" explicitly.
  // If you pass a real CSS filepath, Prettier can infer it, but being explicit is safe.
  const parser = "css";

  const code = await prettier.format(css, {
    ...(userConfig ?? {}),
    filepath, // helps plugin resolution & config cascading
    parser, // "css" | "scss" | "less" if you emit those
  });

  return code;
}

export async function writeFormattedCss(css: string, outPath: string) {
  // Check ignore rules relative to the output file
  const info = await prettier.getFileInfo(outPath, {
    ignorePath: path.join(process.cwd(), ".prettierignore"),
    resolveConfig: true,
  });
  if (info.ignored) {
    await fs.writeFile(outPath, css, "utf8");
    return;
  }

  const config = await prettier.resolveConfig(outPath, { useCache: true });
  const formatted = await prettier.format(css, {
    ...(config ?? {}),
    filepath: outPath, // allow plugin + config resolution
    parser: "css",
  });

  await fs.writeFile(outPath, formatted, "utf8");
}
