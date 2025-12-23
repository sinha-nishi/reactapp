import { RuleRegistry } from "../../core/runtime/RuleRegistry";
import { LoadedTheme } from "../../@types";
import { util, style } from "./helper";

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  const { addExactDecl } = util(reg, theme);

  // grid-cols-N
  const COLS = Array.from({ length: 12 }, (_, i) => i + 1);
  reg.addPrefixRule("grid-cols-", {
    family: "grid",
    match: (cls) =>
      cls.startsWith("grid-cols-")
        ? { key: cls.slice("grid-cols-".length), raw: cls }
        : false,
    apply: (m, meta, ctx) =>
      style(
        "grid-template-columns",
        `repeat(${m.key}, minmax(0, 1fr))`,
        ctx,
        meta,
      ),
    enumerate: () => COLS.map((n) => `grid-cols-${n}`),
  });

  // col-span-N
  reg.addPrefixRule("col-span-", {
    family: "grid",
    match: (cls) =>
      cls.startsWith("col-span-")
        ? { key: cls.slice("col-span-".length), raw: cls }
        : false,
    apply: (m, meta, ctx) =>
      style("grid-column", `span ${m.key} / span ${m.key}`, ctx, meta),
    enumerate: () => COLS.map((n) => `col-span-${n}`),
  });

  addExactDecl(reg, "col-span-full", "grid-column", "1 / -1");
}
