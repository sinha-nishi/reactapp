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

  reg.addExactRule("border", {
    family: "colors",
    match: (cls) => (cls === "border" ? { raw: cls } : false),
    apply: (m, meta, ctx) => [
      style("border-width", "1px", ctx, meta),
      style("border-style", "solid", ctx, meta),
      style("border-color", theme.resolveColor("border"), ctx, meta),
    ],
    enumerate: () => ["border"],
  });

  reg.addExactRule("bg-transparent", {
    family: "colors",
    match: (cls) => (cls === "bg-transparent" ? { raw: cls } : false),
    apply: (m, meta, ctx) =>
      style("background-color", "transparent", ctx, meta),
    enumerate: () => ["bg-transparent"],
  });

  reg.addExactRule("text-transparent", {
    family: "colors",
    match: (cls) => (cls === "text-transparent" ? { raw: cls } : false),
    apply: (m, meta, ctx) => style("color", "transparent", ctx, meta),
    enumerate: () => ["text-transparent"],
  });
}
