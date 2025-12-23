import { RuleRegistry } from "../../core/runtime/RuleRegistry";
import { LoadedTheme } from "../../@types";
import { util } from "./helper";

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  const { addExactDecl } = util(reg, theme);

  // widths
  addExactDecl(reg, "border", "border-width", "1px");
  addExactDecl(reg, "border-8", "border-width", "8px");
  addExactDecl(reg, "border-2", "border-width", "2px");

  // sides
  addExactDecl(reg, "border-t", "border-top-width", "1px");
  addExactDecl(reg, "border-r", "border-right-width", "1px");
  addExactDecl(reg, "border-b", "border-bottom-width", "1px");
  addExactDecl(reg, "border-l", "border-left-width", "1px");
  addExactDecl(reg, "border-l-2", "border-left-width", "2px");

  // axis
  addExactDecl(reg, "border-y", "border-top-width", "1px");
  addExactDecl(reg, "border-y", "border-bottom-width", "1px");
}
