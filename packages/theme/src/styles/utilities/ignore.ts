import { RuleRegistry } from "../../core/runtime/RuleRegistry";
import { LoadedTheme } from "../../@types";
import { style } from "./helper";

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  // top-<n> and -top-<n> (we only need 3 for now)
  reg.addExactRule("top-3", {
    family: "position",
    match: (cls) => (cls === "top-3" ? { raw: cls } : false),
    apply: (_m, meta, ctx) =>
      style("top", String(theme.value("spacing.3")), ctx, meta),
    enumerate: () => ["top-3", "-top-3"],
  });

  reg.addExactRule("-top-3", {
    family: "position",
    match: (cls) => (cls === "-top-3" ? { raw: cls } : false),
    apply: (_m, meta, ctx) =>
      style("top", `-${theme.value("spacing.3")}`, ctx, meta),
    enumerate: () => [],
  });

  // z-10 / -z-10
  reg.addExactRule("z-10", {
    family: "z",
    match: (cls) => (cls === "z-10" ? { raw: cls } : false),
    apply: (_m, meta, ctx) => style("z-index", "10", ctx, meta),
    enumerate: () => ["z-10", "-z-10"],
  });

  reg.addExactRule("-z-10", {
    family: "z",
    match: (cls) => (cls === "-z-10" ? { raw: cls } : false),
    apply: (_m, meta, ctx) => style("z-index", "-10", ctx, meta),
    enumerate: () => [],
  });

  // translate-x-1/2 and -translate-x-1/2
  reg.addExactRule("translate-x-1/2", {
    family: "transform",
    match: (cls) => (cls === "translate-x-1/2" ? { raw: cls } : false),
    apply: (_m, meta, ctx) => [
      { selector: `.translate-x-1\\/2`, transform: "translateX(50%)" } as any,
    ],
    enumerate: () => ["translate-x-1/2", "-translate-x-1/2"],
  });

  reg.addExactRule("-translate-x-1/2", {
    family: "transform",
    match: (cls) => (cls === "-translate-x-1/2" ? { raw: cls } : false),
    apply: (_m, meta, ctx) => [
      {
        selector: `.\\-translate-x-1\\/2`,
        transform: "translateX(-50%)",
      } as any,
    ],
    enumerate: () => [],
  });

  // translate-y-2 and -translate-y-2 (needed for md:-translate-y-2)
  const y2 = theme.value("spacing.2"); // Tailwind spacing.2 = 0.5rem
  reg.addExactRule("-translate-y-2", {
    family: "transform",
    match: (cls) => (cls === "-translate-y-2" ? { raw: cls } : false),
    apply: (_m, meta, ctx) => [
      { selector: `.\\-translate-y-2`, transform: `translateY(-${y2})` } as any,
    ],
    enumerate: () => ["-translate-y-2"],
  });

  reg.addExactRule("sr-only-focusable:not", {
    family: "a11y",
    match: (cls) => (cls === "sr-only-focusable:not" ? { raw: cls } : false),
    apply: (_m, meta, ctx) => [
      {
        selector: `.sr-only-focusable:not(:focus):not(:focus-within)`,
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: "0",
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        "white-space": "nowrap",
        border: "0",
      } as any,
    ],
    enumerate: () => ["sr-only-focusable:not"],
  });
}
