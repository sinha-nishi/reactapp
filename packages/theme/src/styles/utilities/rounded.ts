import { RuleRegistry } from "../../core/runtime/RuleRegistry";
import { LoadedTheme } from "../../@types";
import { util, style } from "./helper";

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  const { addExactDecl } = util(reg, theme);

  const R: Record<string, string> = {
    none: "0px",
    sm: "0.125rem",
    DEFAULT: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    full: "9999px",
  };

  addExactDecl(reg, "rounded", "border-radius", R.DEFAULT);
  addExactDecl(reg, "rounded-sm", "border-radius", R.sm);
  addExactDecl(reg, "rounded-md", "border-radius", R.md);
  addExactDecl(reg, "rounded-lg", "border-radius", R.lg);
  addExactDecl(reg, "rounded-xl", "border-radius", R.xl);
  addExactDecl(reg, "rounded-full", "border-radius", R.full);

  addExactDecl(reg, "rounded-l-xl", "border-top-left-radius", R.xl);
  addExactDecl(reg, "rounded-l-xl", "border-bottom-left-radius", R.xl);
  addExactDecl(reg, "rounded-r-xl", "border-top-right-radius", R.xl);
  addExactDecl(reg, "rounded-r-xl", "border-bottom-right-radius", R.xl);
}
