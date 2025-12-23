import { RuleRegistry } from "../../core/runtime/RuleRegistry";
import { LoadedTheme } from "../../@types";
import { util, styleMany } from "./helper";
import { presetColors } from "./preset";

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  const { addExactDecl } = util(reg, theme);

  addExactDecl(reg, "ring", "--ky-ring-width", "3px");
  addExactDecl(reg, "ring-1", "--ky-ring-width", "1px");

  // default ring color
  addExactDecl(
    reg,
    "ring",
    "--ky-ring-color",
    theme.resolveColor?.("accent") ?? "currentColor",
  );
  addExactDecl(
    reg,
    "ring-1",
    "--ky-ring-color",
    theme.resolveColor?.("accent") ?? "currentColor",
  );

  // applies the ring
  reg.addExactRule("ring", {
    family: "ring",
    match: (cls) => (cls === "ring" ? { raw: cls } : false),
    apply: (m, meta, ctx) =>
      styleMany(
        {
          "box-shadow": `0 0 0 var(--ky-ring-width) var(--ky-ring-color)`,
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
          "box-shadow": `0 0 0 var(--ky-ring-width) var(--ky-ring-color)`,
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
      const c = theme.resolveColor(m.key);

      return [
        {
          selector: `.${m.raw.replace(/([:.\/\\])/g, "\\$1")}`,
          "--ky-ring-color": c,
        } as any,
      ];
    },
    enumerate: () => [],
  });

  reg.addPrefixRule("ring-", {
    family: "ring",
    match: (cls) =>
      cls.startsWith("ring-") ? { key: cls.slice(5), raw: cls } : false,
    apply: (m, meta, ctx) => {
      const c = theme.resolveColor(m.key);
      return [
        { selector: `.${escapeClass(m.raw)}`, "--ky-ring-color": c } as any,
      ];
    },
    enumerate: () => presetColors(true).map((c) => `ring-${c}`),
  });
}

function escapeClass(cls: string) {
  return cls.replace(/([:.\/\\])/g, "\\$1");
}
