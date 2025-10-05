#!/usr/bin/env node
import { Command } from "commander";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { resolve, dirname, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";

// Import builder + plugins from your monorepo packages
import { createThemeBuilder } from "../styles";
import { compatPlugin } from "@/compat";
import { loadAndParse } from "../builder/parser/ingest";

const program = new Command();

program
  .name("pkv-design")
  .description("Build CSS bundles using pkv builder + presets")
  .version("0.1.0");

program
  .command("build")
  .description("Build CSS from presets or a tokens JSON")
  .option("-p, --preset <nameOrPath>", "material | ant | path/to/preset.json")
  .option(
    "-t, --tokens <path>",
    "path to custom tokens JSON (same shape as presets)",
  )
  .option("-o, --out <file>", "output CSS file", "dist/pkv.custom.css")
  .option("--min", "minify output")
  .option("--legacy", "emit legacy build (no @layer)")
  .option("--compat <list>", "comma-separated: tailwind,bootstrap")
  .action((opts) => {
    const tokens: Record<string, string> = {};

    const loadJson = (p: string) => JSON.parse(readFileSync(p, "utf8"));
    const root = dirname(fileURLToPath(import.meta.url));

    if (opts.preset) {
      if (opts.preset === "material" || opts.preset === "ant") {
        const rel =
          opts.preset === "material"
            ? "../../presets/material.json"
            : "../../presets/ant.json";
        const preset = loadJson(resolve(root, rel));
        Object.assign(tokens, preset.tokens || {});
      } else {
        const p = isAbsolute(opts.preset)
          ? opts.preset
          : resolve(process.cwd(), opts.preset);
        const preset = loadJson(p);
        Object.assign(tokens, preset.tokens || {});
      }
    }

    if (opts.tokens) {
      const p = isAbsolute(opts.tokens)
        ? opts.tokens
        : resolve(process.cwd(), opts.tokens);
      const custom = loadJson(p);
      Object.assign(tokens, custom.tokens || custom);
    }

    let builder = createThemeBuilder({ tokens });

    if (opts.compat) {
      const list = String(opts.compat)
        .split(",")
        .map((s) => s.trim());
      builder = builder.use(
        compatPlugin({
          tailwind: list.includes("tailwind"),
          bootstrap: list.includes("bootstrap"),
        }),
      );
    }

    const css = builder.toString({ minify: !!opts.min, legacy: !!opts.legacy });
    const outPath = isAbsolute(opts.out)
      ? opts.out
      : resolve(process.cwd(), opts.out);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, css, "utf8");

    console.log(`✔ wrote ${outPath}`);
  });

program.parse();
