import { RuleRegistry } from "@/core/runtime/RuleRegistry";
import type { Theme } from "../../@types";
import { style, util, withColorKey } from "./helper";
import { getSemanticColorKeys, semanticToColorKey } from "@/tokens/semantic";

export function register(reg: RuleRegistry, theme: Theme) {
  const semanticKeys = getSemanticColorKeys(theme).map(semanticToColorKey);

  // bg-<color>
  reg.addPrefixRule("bg-", {
    family: "colors",
    match: (cls) => withColorKey(cls, "bg-", theme.colors),
    apply: (m, meta, ctx) =>
      style("background-color", ctx.resolveColor(m.key), ctx, meta),
    enumerate: () => semanticKeys.map((k) => `bg-${k}`),
  });

  // border-<color>
  reg.addPrefixRule("border-", {
    family: "colors",
    match: (cls) => withColorKey(cls, "border-", theme.colors),
    apply: (m, meta, ctx) =>
      style("border-color", ctx.resolveColor(m.key), ctx, meta),
    enumerate: () => semanticKeys.map((k) => `border-${k}`),
  });

  // text-<color>
  // reg.addPrefixRule("text-", {
  //   family: "typography", // or "colors" if you prefer
  //   match: (cls) => { /* your existing text-size vs color logic */ },
  //   apply: (m, meta, ctx) => { /* existing */ },
  //   // enumerate only semantic text colors if you want (optional)
  //   // enumerate: () => semanticKeys.map(k => `text-${k}`),
  // });
}
