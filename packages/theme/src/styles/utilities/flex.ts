import { RuleRegistry } from "../../core/runtime/RuleRegistry";
import { LoadedTheme } from "../../@types";
import { util } from "./helper";

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  const { addExactDecl } = util(reg, theme);

  // direction
  addExactDecl(reg, "flex-row", "flex-direction", "row");
  addExactDecl(reg, "flex-col", "flex-direction", "column");
  addExactDecl(reg, "flex-row-reverse", "flex-direction", "row-reverse");
  addExactDecl(reg, "flex-col-reverse", "flex-direction", "column-reverse");

  // wrap
  addExactDecl(reg, "flex-wrap", "flex-wrap", "wrap");
  addExactDecl(reg, "flex-nowrap", "flex-wrap", "nowrap");

  // grow/shrink
  addExactDecl(reg, "flex-1", "flex", "1 1 0%");
  addExactDecl(reg, "flex-auto", "flex", "1 1 auto");
  addExactDecl(reg, "flex-initial", "flex", "0 1 auto");
  addExactDecl(reg, "flex-none", "flex", "none");
  addExactDecl(reg, "flex-grow", "flex-grow", "1");
  addExactDecl(reg, "flex-grow-0", "flex-grow", "0");
  addExactDecl(reg, "flex-shrink", "flex-shrink", "1");
  addExactDecl(reg, "flex-shrink-0", "flex-shrink", "0");

  // align-items
  addExactDecl(reg, "items-start", "align-items", "flex-start");
  addExactDecl(reg, "items-center", "align-items", "center");
  addExactDecl(reg, "items-end", "align-items", "flex-end");
  addExactDecl(reg, "items-stretch", "align-items", "stretch");
  addExactDecl(reg, "items-baseline", "align-items", "baseline");

  // justify-content
  addExactDecl(reg, "justify-start", "justify-content", "flex-start");
  addExactDecl(reg, "justify-center", "justify-content", "center");
  addExactDecl(reg, "justify-end", "justify-content", "flex-end");
  addExactDecl(reg, "justify-between", "justify-content", "space-between");
  addExactDecl(reg, "justify-around", "justify-content", "space-around");
  addExactDecl(reg, "justify-evenly", "justify-content", "space-evenly");
}
