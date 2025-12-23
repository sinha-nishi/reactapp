import { RuleRegistry } from "../../core/runtime/RuleRegistry";
import { LoadedTheme } from "../../@types";
import { util, styleMany } from "./helper";
import { presetColors } from "./preset";

const stops = [
  "from-cyan-600",
  "from-transparent",
  "to-blue-600",
  "to-transparent",
  "via-slate-50",
  "via-slate-300",
  "via-slate-950",
  "to-slate-50",
  "to-slate-950",
  "from-cyan-900/20",
  "from-cyan-100/40",
];

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  const { addExactDecl } = util(reg, theme);

  // direction
  addExactDecl(
    reg,
    "bg-gradient-to-r",
    "background-image",
    "linear-gradient(to right, var(--ky-gradient-stops))",
  );
  addExactDecl(
    reg,
    "bg-gradient-to-b",
    "background-image",
    "linear-gradient(to bottom, var(--ky-gradient-stops))",
  );

  reg.addExactRule("from-transparent", {
    family: "gradient",
    match: (cls) => (cls === "from-transparent" ? { raw: cls } : false),
    apply: (m, meta, ctx) => {
      return styleMany(
        {
          "--ky-gradient-from": "transparent",
          "--ky-gradient-stops":
            "var(--ky-gradient-from), var(--ky-gradient-to, rgb(255 255 255 / 0))",
        },
        ctx,
        meta,
      );
    },
    enumerate: () => ["from-transparent"],
  });

  reg.addExactRule("to-transparent", {
    family: "gradient",
    match: (cls) => (cls === "to-transparent" ? { raw: cls } : false),
    // cls.startsWith("from-") ? { key: cls.slice(5), raw: cls } : false,
    apply: (m, meta, ctx) =>
      styleMany({ "--ky-gradient-to": "transparent" }, ctx, meta),
    enumerate: () => ["to-transparent"],
  });

  // stops (we keep Tailwind's var contract)
  reg.addPrefixRule("from-", {
    family: "gradient",
    match: (cls) =>
      cls.startsWith("from-") ? { key: cls.slice(5), raw: cls } : false,
    apply: (m, meta, ctx) => {
      const c = theme.resolveColor(m.key);

      return styleMany(
        {
          "--ky-gradient-from": c,
          "--ky-gradient-stops":
            "var(--ky-gradient-from), var(--ky-gradient-to, rgb(255 255 255 / 0))",
        },
        ctx,
        meta,
      );
    },
    enumerate: () => presetColors(false).map((c) => `from-${c}`),
  });

  reg.addPrefixRule("via-", {
    family: "gradient",
    match: (cls) =>
      cls.startsWith("via-") ? { key: cls.slice(4), raw: cls } : false,
    apply: (m, meta, ctx) => {
      const c = theme.resolveColor(m.key);

      return styleMany(
        {
          "--ky-gradient-stops":
            "var(--ky-gradient-from), " +
            c +
            ", var(--ky-gradient-to, rgb(255 255 255 / 0))",
        },
        ctx,
        meta,
      );
    },
    enumerate: () => presetColors(false).map((c) => `via-${c}`),
  });

  reg.addPrefixRule("to-", {
    family: "gradient",
    match: (cls) =>
      cls.startsWith("to-") ? { key: cls.slice(3), raw: cls } : false,
    apply: (m, meta, ctx) => {
      const c = theme.resolveColor(m.key);
      return styleMany({ "--ky-gradient-to": c }, ctx, meta);
    },
    enumerate: () => presetColors(false).map((c) => `to-${c}`),
  });
}
