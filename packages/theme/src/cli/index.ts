import { Command } from "commander";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { resolve, dirname, isAbsolute, posix } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import fg from "fast-glob";

// Import builder + plugins from your monorepo packages
import { createThemeBuilder } from "../styles";
import { compatPlugin } from "@/compat";
import { loadAndParse } from "../builder/parser/ingest";
import { applyParsedToBuilder } from "@/builder/parser";
import { formatCss } from "./format";
import { lookupConfig } from "./config";

const program = new Command();

program
  .name("pkv-design")
  .description("Build CSS bundles using pkv builder + presets")
  .version("0.1.0");

program
  .command("build")
  .description("Build CSS from presets or a tokens JSON")
  .option(
    "-i, --in <globs>",
    'one or more input globs (comma-separated), e.g. "styles/**/*.scss,overrides/*.css"',
  )
  .option("-p, --preset <nameOrPath>", "material | ant | path/to/preset.json")
  .option(
    "--presets-dir <dir>",
    "directory with preset JSONs (name resolution)",
  )
  .option("-c, --config <path>", "path to pkv.config.(mjs|cjs|js|json)")
  .option(
    "-t, --tokens <path>",
    "path to custom tokens JSON (same shape as presets)",
  )

  .option("-o, --out <file>", "output CSS file", "dist/pkv.custom.css")
  .option("--min", "minify output")
  .option("--legacy", "emit legacy build (no @layer)")
  .option("--compat <list>", "comma-separated: tailwind,bootstrap")

  .option("--strict", "treat validation warnings as errors (exit code 1)")
  .action(async (opts) => {
    const tokens: Record<string, string> = {};

    const loadJson = (p: string) => JSON.parse(readFileSync(p, "utf8"));
    const here = dirname(fileURLToPath(import.meta.url));

    // Load config (auto-discover if not passed)
    let cfg: any = {};
    const [guess, dir] = await lookupConfig();
    console.log(
      `ℹ️ config file ${opts.config || guess || "(none)"} from cwd: `,
      dir,
    );

    const configPath = opts.config || guess;
    // Merge: flags override config
    // const opt = (k: string, fallback: any) => opts[k] ?? cfg[k] ?? fallback;
    // const compatCfg = cfg.compat || {};
    if (configPath) {
      if (configPath.endsWith(".json"))
        cfg = JSON.parse(readFileSync(configPath, "utf8"));
      else {
        const mod = await import(pathToFileURL(configPath).href);
        cfg = mod.default ?? mod;
      }
    }

    // Helper to resolve option value with fallback to config
    // const opt = (k: string, fallback?: any) =>
    //   (opts as any)[k] ?? cfg[k] ?? fallback;

    const opt = (keys: string | string[], fallback?: any) => {
      const arr = Array.isArray(keys) ? keys : [keys];
      for (const k of arr) {
        if ((opts as any)[k] !== undefined) return (opts as any)[k];
        if (cfg[k] !== undefined) return cfg[k];
      }
      return fallback;
    };

    // Resolve preset path by name using presetsDir (CLI or config or package default)
    const resolvePreset = (nameOrPath: string): string => {
      if (/[\\/]|\\.json$/.test(nameOrPath))
        return isAbsolute(nameOrPath)
          ? nameOrPath
          : resolve(process.cwd(), nameOrPath);
      const presetsDir = opt("presetsDir", resolve(here, "../presets")); // default to pkg presets/
      const candidate = resolve(presetsDir, `${nameOrPath}.json`);
      return candidate;
    };

    const presetArg = opt("preset");
    if (presetArg) {
      const p = resolvePreset(presetArg);
      const preset = loadJson(p);
      Object.assign(tokens, preset.tokens || {});
    }

    const tokensFile = opt("tokens");
    if (tokensFile) {
      const p = isAbsolute(tokensFile)
        ? tokensFile
        : resolve(process.cwd(), tokensFile);
      const custom = loadJson(p);
      Object.assign(tokens, custom.tokens || custom);
    }

    let builder = createThemeBuilder({ tokens });

    const compat = opt("compat");
    if (compat) {
      const list = String(compat)
        .split(",")
        .map((s: string) => s.trim());
      builder = builder.use(
        compatPlugin({
          tailwind: list.includes("tailwind"),
          bootstrap: list.includes("bootstrap"),
        }),
      );
    }

    const strict = opt("strict", false) || !!opts.strict;
    const include = opt(["in", "include"], "");
    console.log(`ℹ️  inclusion pattern ${include}...`);
    if (include) {
      const patterns = String(include)
        .split(",")
        .map((p: string) => posix.normalize(p.trim().replace(/\\/g, "/"))); // normalize backslashes
      console.log(`ℹ️  locating input files pattern ${patterns}...`);
      const files = await fg(patterns, { dot: true, onlyFiles: true });
      console.log(`ℹ️  processing ${files.length} input files...`, files);
      for (const f of files) {
        const parsed = await loadAndParse(f);
        applyParsedToBuilder(builder, parsed);
        if (parsed.diagnostics?.length) {
          for (const d of parsed.diagnostics) {
            const tag = d.type === "error" ? "ERROR" : "WARN";
            const loc = d.node?.source?.start
              ? ` (${f}:${d.node.source.start.line}:${d.node.source.start.column})`
              : "";
            console.log(`[${tag}] ${d.message}${loc}`);
          }
          if (
            opts.strict &&
            parsed.diagnostics.some((d: any) => d.type !== "warn")
          )
            process.exitCode = 1;
          if (
            opts.strict &&
            parsed.diagnostics.some((d: any) => d.type === "warn")
          )
            process.exitCode = 1; // strict: warnings fail too

          if (strict && parsed.diagnostics.length) process.exitCode = 1;
        }
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
