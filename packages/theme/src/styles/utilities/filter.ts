import { RuleRegistry } from "../../core/runtime/RuleRegistry";
import { LoadedTheme } from "../../@types";
import { util } from "./helper";

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  const { addExactDecl } = util(reg, theme);

  addExactDecl(reg, "filter", "filter", "var(--tw-filter, none)");
  addExactDecl(reg, "blur", "--tw-filter", "blur(8px)");
  addExactDecl(
    reg,
    "drop-shadow",
    "--tw-filter",
    "drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))",
  );

  addExactDecl(reg, "mix-blend-multiply", "mix-blend-mode", "multiply");
}
