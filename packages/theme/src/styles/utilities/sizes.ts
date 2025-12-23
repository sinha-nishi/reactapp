import { RuleRegistry } from "../../core/runtime/RuleRegistry";
import { LoadedTheme } from "../../@types";
import { util, style } from "./helper";

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  const { scaleMap, addExactDecl } = util(reg, theme);

  const spacing = scaleMap("spacing");

  const SIZE: Record<string, string> = {
    ...spacing,
    px: "1px",
    full: "100%",
    screen: "100vw",
    fit: "fit-content",
    auto: "auto",
    "1/2": "50%",
    "1/3": "33.333333%",
    "2/3": "66.666667%",
  };

  // width
  reg.addPrefixRule("w-", {
    family: "sizes",
    match: (cls) =>
      cls.startsWith("w-") ? { key: cls.slice(2), raw: cls } : false,
    apply: (m, meta, ctx) => style("width", SIZE[m.key] ?? m.key, ctx, meta),
    enumerate: () => Object.keys(SIZE).map((k) => `w-${k}`),
  });

  // height
  const H: Record<string, string> = {
    ...SIZE,
    screen: "100vh",
  };

  reg.addPrefixRule("h-", {
    family: "sizes",
    match: (cls) =>
      cls.startsWith("h-") ? { key: cls.slice(2), raw: cls } : false,
    apply: (m, meta, ctx) => style("height", H[m.key] ?? m.key, ctx, meta),
    enumerate: () => Object.keys(H).map((k) => `h-${k}`),
  });

  // min-h-
  addExactDecl(reg, "min-h-screen", "min-height", "100vh");

  reg.addPrefixRule("min-h-", {
    family: "sizes",
    match: (cls) =>
      cls.startsWith("min-h-")
        ? { key: cls.slice("min-h-".length), raw: cls }
        : false,
    apply: (m, meta, ctx) => style("min-height", H[m.key] ?? m.key, ctx, meta),
    enumerate: () => ["min-h-screen"],
  });

  // max-w-
  const MAXW: Record<string, string> = {
    xs: "20rem",
    sm: "24rem",
    md: "28rem",
    lg: "32rem",
    xl: "36rem",
    "2xl": "42rem",
    "3xl": "48rem",
    "4xl": "56rem",
    "5xl": "64rem",
    "6xl": "72rem",
    full: "100%",
  };

  reg.addPrefixRule("max-w-", {
    family: "sizes",
    match: (cls) =>
      cls.startsWith("max-w-")
        ? { key: cls.slice("max-w-".length), raw: cls }
        : false,
    apply: (m, meta, ctx) =>
      style("max-width", MAXW[m.key] ?? m.key, ctx, meta),
    enumerate: () => Object.keys(MAXW).map((k) => `max-w-${k}`),
  });
}
