import { RuleRegistry } from "../../core/runtime/RuleRegistry";
import { LoadedTheme } from "../../@types";
import { util, styleMany } from "./helper";

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  const { scaleMap, addExactDecl } = util(reg, theme);

  const spacing = scaleMap("spacing");

  // add common fractions Tailwind uses
  const T: Record<string, string> = {
    ...spacing,
    "0": "0px",
    "1/2": "50%",
    "1/3": "33.333333%",
    "2/3": "66.666667%",
    full: "100%",
  };

  addExactDecl(reg, "transform", "transform", "translateZ(0)");

  reg.addPrefixRule("translate-x-", {
    family: "transform",
    match: (cls) =>
      cls.startsWith("translate-x-")
        ? { key: cls.slice("translate-x-".length), raw: cls }
        : false,
    apply: (m, meta, ctx) =>
      styleMany({ transform: `translateX(${T[m.key] ?? m.key})` }, ctx, meta),
    enumerate: () => Object.keys(T).map((k) => `translate-x-${k}`),
  });

  reg.addPrefixRule("translate-y-", {
    family: "transform",
    match: (cls) =>
      cls.startsWith("translate-y-")
        ? { key: cls.slice("translate-y-".length), raw: cls }
        : false,
    apply: (m, meta, ctx) =>
      styleMany({ transform: `translateY(${T[m.key] ?? m.key})` }, ctx, meta),
    enumerate: () => Object.keys(T).map((k) => `translate-y-${k}`),
  });

  // the `transform` class itself (no-op but used in Tailwind)
  reg.addExactRule("transform", {
    family: "transform",
    match: (cls) => (cls === "transform" ? { raw: cls } : false),
    apply: (m, meta, ctx) =>
      styleMany({ transform: "translateZ(0)" }, ctx, meta),
    enumerate: () => ["transform"],
  });
}
