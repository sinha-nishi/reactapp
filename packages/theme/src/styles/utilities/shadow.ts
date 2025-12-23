import { RuleRegistry } from "../../core/runtime/RuleRegistry";
import { LoadedTheme } from "../../@types";
import { styleMany, util } from "./helper";
import { presetColors } from "./preset";

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  const { addExactDecl } = util(reg, theme);

  // Tailwind-ish defaults (can later map to theme tokens)
  addExactDecl(reg, "shadow-sm", "box-shadow", "0 1px 2px 0 rgb(0 0 0 / 0.05)");
  addExactDecl(
    reg,
    "shadow",
    "box-shadow",
    "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.06)",
  );
  addExactDecl(
    reg,
    "shadow-md",
    "box-shadow",
    "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  );
  addExactDecl(
    reg,
    "shadow-lg",
    "box-shadow",
    "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  );
  addExactDecl(
    reg,
    "shadow-xl",
    "box-shadow",
    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  );
  addExactDecl(
    reg,
    "shadow-2xl",
    "box-shadow",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  );
  addExactDecl(
    reg,
    "shadow-inner",
    "box-shadow",
    "inset 0 2px 4px 0 rgb(0 0 0 / 0.06)",
  );
  addExactDecl(reg, "shadow-none", "box-shadow", "none");

  reg.addPrefixRule("shadow-", {
    family: "shadow",
    match: (cls) =>
      cls.startsWith("shadow-") ? { key: cls.slice(7), raw: cls } : false,
    apply: (m, meta, ctx) => {
      const fn = ctx?.resolveColor ?? (theme as any)?.resolveColor;
      const c = typeof fn === "function" ? fn(m.key) : m.key;
      // Use a safe “colored shadow” preset.
      return styleMany(
        { "box-shadow": `0 10px 15px -3px ${c}, 0 4px 6px -4px ${c}` },
        ctx,
        meta,
      );
    },
    enumerate: () => presetColors(false).map((c) => `shadow-${c}`),
  });
}
