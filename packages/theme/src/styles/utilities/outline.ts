import { RuleRegistry } from "../../core/runtime/RuleRegistry";
import { LoadedTheme } from "../../@types";
import { styleMany } from "./helper";

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  reg.addExactRule("outline-none", {
    family: "outline",
    match: (cls) =>
      cls === "outline-none" ? { raw: cls } : false,
    apply: (_m, meta, ctx) =>
      styleMany(
        {
          outline: "2px solid transparent",
          "outline-offset": "2px",
        },
        ctx,
        meta,
      ),
    enumerate: () => ["outline-none", "focus:outline-none"],
  });
}
