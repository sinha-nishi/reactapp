import { RuleRegistry } from "../../core/runtime/RuleRegistry";
import { LoadedTheme } from "../../@types";
import { util, style, styleMany } from "./helper";

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  const { scaleMap } = util(reg, theme);
  const S = scaleMap("spacing");

  // gap-*
  reg.addPrefixRule("gap-", {
    family: "spacing",
    match: (cls) =>
      cls.startsWith("gap-") ? { key: cls.slice(4), raw: cls } : false,
    apply: (m, meta, ctx) => style("gap", S[m.key] ?? m.key, ctx, meta),
    enumerate: () => Object.keys(S).map((k) => `gap-${k}`),
  });

  // space-x-* and space-y-*
  // minimal Tailwind behavior using child combinator
  reg.addPrefixRule("space-x-", {
    family: "spacing",
    match: (cls) =>
      cls.startsWith("space-x-")
        ? { key: cls.slice("space-x-".length), raw: cls }
        : false,
    apply: (m, meta, ctx) =>
      styleMany(
        {
          selector: `.${escapeClass(m.raw)} > :not([hidden]) ~ :not([hidden])`,
          "margin-left": S[m.key] ?? m.key,
        } as any,
        ctx,
        meta,
      ),
    enumerate: () => Object.keys(S).map((k) => `space-x-${k}`),
  });

  reg.addPrefixRule("space-y-", {
    family: "spacing",
    match: (cls) =>
      cls.startsWith("space-y-")
        ? { key: cls.slice("space-y-".length), raw: cls }
        : false,
    apply: (m, meta, ctx) =>
      styleMany(
        {
          selector: `.${escapeClass(m.raw)} > :not([hidden]) ~ :not([hidden])`,
          "margin-top": S[m.key] ?? m.key,
        } as any,
        ctx,
        meta,
      ),
    enumerate: () => Object.keys(S).map((k) => `space-y-${k}`),
  });
}

function escapeClass(cls: string) {
  // minimal escape: ":" "/" "." etc
  return cls.replace(/([:.\/\\])/g, "\\$1");
}
