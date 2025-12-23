import { RuleRegistry } from "../../core/runtime/RuleRegistry";
import { LoadedTheme } from "../../@types";
import { style } from "./helper";
import { presetColors } from "./preset";

type Match = { family: "bg" | "text" | "border"; color: string; raw: string };

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  const colors = (prefix: string, withAlpha: boolean = false) =>
    [...theme.keys("colors"), ...presetColors(withAlpha)].map(
      (c) => `${prefix}-${c}`,
    );

  //   match: (cls) => withColorKey(cls, "bg-"),
  //   apply: (m, meta, ctx) => {
  //     return style("background-color", theme.resolveColor(m.key), ctx, meta);
  //   },

  // bg-<color>-<shade>[/alpha]
  reg.addPrefixRule("bg-", {
    family: "palette",
    match: (cls) => parsePalette("bg", cls),
    apply: (m: Match, meta, ctx) =>
      style(
        "background-color",
        resolveTailwindColor(ctx, theme, m.color),
        ctx,
        meta,
      ),
    enumerate: () => colors("bg", true),
  });

  reg.addPrefixRule("text-", {
    family: "palette",
    match: (cls) => parsePalette("text", cls),
    apply: (m: Match, meta, ctx) =>
      style("color", resolveTailwindColor(ctx, theme, m.color), ctx, meta),
    enumerate: () => colors("text", false),
  });

  //reg.addPrefixRule("border-", {
  //   family: "colors",
  //   match: (cls) => withColorKey(cls, "border-"),
  //   apply: (m, meta, ctx) =>
  //     style("border-color", theme.resolveColor(m.key), ctx, meta),
  //   enumerate: () => colorKeys.map((k) => `border-${k}`),
  // });

  reg.addPrefixRule("border-", {
    family: "palette",
    match: (cls) => parsePalette("border", cls),
    apply: (m: Match, meta, ctx) =>
      style(
        "border-color",
        resolveTailwindColor(ctx, theme, m.color),
        ctx,
        meta,
      ),
    enumerate: () => colors("border", false),
  });
}

function parsePalette(family: Match["family"], cls: string): Match | false {
  const p = `${family}-`;
  if (!cls.startsWith(p)) return false;

  // supports: slate-900, cyan-900/30
  const rest = cls.slice(p.length);
  if (!rest) return false;

  return { family, color: rest, raw: cls };
}

function normalizeColorKey(key: string) {
  // "orange-600" -> "orange.600"
  // "slate-900/50" -> "slate.900/50"
  // "cyan-900/30" -> "cyan.900/30"
  return key.replace(
    /^([a-zA-Z]+)-([0-9]+)(\/[0-9]+)?$/,
    (_, fam, shade, alpha) => `${fam}.${shade}${alpha ?? ""}`,
  );
}

/**
 * Resolve Tailwind-ish color strings like:
 * - "slate-900"
 * - "slate-900/50"
 * - "cyan-200"
 *
 * Uses ctx.resolveColor/theme.resolveColor if available.
 * This is important because you already fixed token paths + resolveRefs.
 */
function resolveTailwindColor(
  ctx: any,
  theme: LoadedTheme,
  key: string,
): string {
  if (typeof theme.resolveColor === "function")
    return theme.resolveColor(normalizeColorKey(key));
  // fallback: use raw if resolver not present (shouldn't happen)
  return key;
}
