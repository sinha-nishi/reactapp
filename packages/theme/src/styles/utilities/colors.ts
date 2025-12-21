import { RuleRegistry } from "@/core/runtime/RuleRegistry";
import type { LoadedTheme } from "../../@types";
import { style, withColorKey } from "./helper";
import {
  getSemanticColorKeys,
  semanticToColorKey,
} from "../../tokens/semantic";

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  const semanticKeys = getSemanticColorKeys(theme as any).map(
    semanticToColorKey,
  );

  // bg-<color>
  reg.addPrefixRule("bg-", {
    family: "colors",
    match: (cls) => withColorKey(cls, "bg-"),
    apply: (m, meta, ctx) =>
      style("background-color", ctx.resolveColor(m.key), ctx, meta),
    enumerate: () => semanticKeys.map((k) => `bg-${k}`),
  });

  // border-<color>
  reg.addPrefixRule("border-", {
    family: "colors",
    match: (cls) => withColorKey(cls, "border-"),
    apply: (m, meta, ctx) =>
      style("border-color", ctx.resolveColor(m.key), ctx, meta),
    enumerate: () => semanticKeys.map((k) => `border-${k}`),
  });
}
