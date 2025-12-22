import { RuleRegistry } from "@/core/runtime/RuleRegistry";
import type { LoadedTheme } from "../../@types";
import { style, withColorKey } from "./helper";

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  const colorKeys = theme.keys("colors");

  reg.addPrefixRule("bg-", {
    family: "colors",
    match: (cls) => withColorKey(cls, "bg-"),
    apply: (m, meta, ctx) =>
      style("background-color", theme.resolveColor(m.key), ctx, meta),
    enumerate: () => colorKeys.map((k) => `bg-${k}`),
  });

  reg.addPrefixRule("border-", {
    family: "colors",
    match: (cls) => withColorKey(cls, "border-"),
    apply: (m, meta, ctx) =>
      style("border-color", theme.resolveColor(m.key), ctx, meta),
    enumerate: () => colorKeys.map((k) => `border-${k}`),
  });
}
