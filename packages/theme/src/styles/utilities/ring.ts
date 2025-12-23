import { RuleRegistry } from "../../core/runtime/RuleRegistry";
import { LoadedTheme } from "../../@types";
import { util, styleMany } from "./helper";

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  const { addExactDecl } = util(reg, theme);

  addExactDecl(reg, "ring", "--tw-ring-width", "3px");
  addExactDecl(reg, "ring-1", "--tw-ring-width", "1px");

  // default ring color
  addExactDecl(
    reg,
    "ring",
    "--tw-ring-color",
    theme.resolveColor?.("accent") ?? "currentColor",
  );
  addExactDecl(
    reg,
    "ring-1",
    "--tw-ring-color",
    theme.resolveColor?.("accent") ?? "currentColor",
  );

  // applies the ring
  reg.addExactRule("ring", {
    family: "ring",
    match: (cls) => (cls === "ring" ? { raw: cls } : false),
    apply: (m, meta, ctx) =>
      styleMany(
        {
          "box-shadow": `0 0 0 var(--tw-ring-width) var(--tw-ring-color)`,
        },
        ctx,
        meta,
      ),
    enumerate: () => ["ring"],
  });

  reg.addExactRule("ring-1", {
    family: "ring",
    match: (cls) => (cls === "ring-1" ? { raw: cls } : false),
    apply: (m, meta, ctx) =>
      styleMany(
        {
          "box-shadow": `0 0 0 var(--tw-ring-width) var(--tw-ring-color)`,
        },
        ctx,
        meta,
      ),
    enumerate: () => ["ring-1"],
  });

  // ring-{color}/{alpha} e.g. ring-slate-900/10
  reg.addPrefixRule("ring-", {
    family: "ring",
    match: (cls) =>
      cls.startsWith("ring-") ? { key: cls.slice(5), raw: cls } : false,
    apply: (m, meta, ctx) => {
      // reuse your color resolver if it supports "slate-900/10"
      const c =
        ctx.resolveColor?.(m.key) ?? theme.resolveColor?.(m.key) ?? m.key;
      return [
        {
          selector: `.${m.raw.replace(/([:.\/\\])/g, "\\$1")}`,
          "--tw-ring-color": c,
        } as any,
      ];
    },
    enumerate: () => [],
  });
}
