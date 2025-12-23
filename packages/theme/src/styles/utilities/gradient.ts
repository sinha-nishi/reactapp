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
    "linear-gradient(to right, var(--tw-gradient-stops))",
  );
  addExactDecl(
    reg,
    "bg-gradient-to-b",
    "background-image",
    "linear-gradient(to bottom, var(--tw-gradient-stops))",
  );

  // stops (we keep Tailwind's var contract)
  reg.addPrefixRule("from-", {
    family: "gradient",
    match: (cls) =>
      cls.startsWith("from-") ? { key: cls.slice(5), raw: cls } : false,
    apply: (m, meta, ctx) => {
      const c =
        (ctx.resolveColor ?? (theme as any).resolveColor)?.(m.key) ?? m.key;
      return styleMany(
        {
          "--tw-gradient-from": c,
          "--tw-gradient-stops":
            "var(--tw-gradient-from), var(--tw-gradient-to, rgb(255 255 255 / 0))",
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
      const c =
        (ctx.resolveColor ?? (theme as any).resolveColor)?.(m.key) ?? m.key;
      return styleMany(
        {
          "--tw-gradient-stops":
            "var(--tw-gradient-from), " +
            c +
            ", var(--tw-gradient-to, rgb(255 255 255 / 0))",
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
      const c =
        (ctx.resolveColor ?? (theme as any).resolveColor)?.(m.key) ?? m.key;
      return styleMany({ "--tw-gradient-to": c }, ctx, meta);
    },
    enumerate: () => presetColors(false).map((c) => `to-${c}`),
  });
}
