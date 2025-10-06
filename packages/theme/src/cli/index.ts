import { Command } from "commander";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { resolve, dirname, isAbsolute, posix } from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";

// Import builder + plugins from your monorepo packages
import { createThemeBuilder } from "../styles";
import { compatPlugin } from "@/compat";
import { loadAndParse } from "../builder/parser/ingest";
import { applyParsedToBuilder } from "@/builder/parser";
import { formatCss } from "./format";

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
  .option(
    "-i, --in <globs>",
    'one or more input globs (comma-separated), e.g. "styles/**/*.scss,overrides/*.css"',
  )
  .option("-o, --out <file>", "output CSS file", "dist/pkv.custom.css")
  .option("--min", "minify output")
  .option("--legacy", "emit legacy build (no @layer)")
  .option("--compat <list>", "comma-separated: tailwind,bootstrap")
  .option("-c, --config <path>", "path to pkv.config.(mjs|cjs|js|json)")
  .action(async (opts) => {
    const tokens: Record<string, string> = {};

    const loadJson = (p: string) => JSON.parse(readFileSync(p, "utf8"));
    const root = dirname(fileURLToPath(import.meta.url));

    if (opts.preset) {
      if (opts.preset === "material" || opts.preset === "ant") {
        const rel =
          opts.preset === "material"
            ? "../presets/material.json"
            : "../presets/ant.json";
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

    let cfg: any = {};
    const guess = (
      await fg(["pkv.config.{mjs,cjs,js,json}"], {
        cwd: process.cwd(),
        absolute: true,
      })
    ).at(0);
    const configPath = opts.config || guess;
    if (configPath) {
      if (configPath.endsWith(".json"))
        cfg = JSON.parse(readFileSync(configPath, "utf8"));
      else {
        const { pathToFileURL } = await import("url");
        const mod = await import(pathToFileURL(configPath).href);
        cfg = mod.default ?? mod;
      }
    }
    // Merge: flags override config
    const opt = (k: string, fallback: any) => opts[k] ?? cfg[k] ?? fallback;
    const compatCfg = cfg.compat || {};

    // const cfg = {
    //   validation: { classPrefix: ["pkv-", "app-"], severity: "warn" },
    // };

    // NEW: ingest authored styles
    const include = opts.in || (cfg.include ? [].concat(cfg.include).join(',') : '');
    if (include) {
      const patterns = String(include)
        .split(",")
        .map((p: string) => posix.normalize(p.trim().replace(/\\/g, "/"))); // normalize backslashes
      const files = await fg(patterns, { dot: true, onlyFiles: true });
      for (const f of files) {
        const parsed = await loadAndParse(
          f,
          cfg.validation ? { validation: cfg.validation } : undefined,
        );
        if (parsed.diagnostics?.length) {
          for (const d of parsed.diagnostics) {
            const tag = d.type === "error" ? "ERROR" : "WARN";
            const loc = d.node?.source?.start
              ? ` (${f}:${d.node.source.start.line}:${d.node.source.start.column})`
              : "";
            console.log(`[${tag}] ${d.message}${loc}`);
          }
          if (parsed.diagnostics.some((d) => d.type === "error"))
            process.exitCode = 1;
        }
        applyParsedToBuilder(builder, parsed);
      }
    }

    const css = builder.toString({ minify: !!opts.min, legacy: !!opts.legacy });
    const outPath = isAbsolute(opts.out)
      ? opts.out
      : resolve(process.cwd(), opts.out);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, await formatCss(css), "utf8");

    console.log(`✔ wrote ${outPath}`);
  });

program.parse();
