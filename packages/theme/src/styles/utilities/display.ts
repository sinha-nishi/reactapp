import { RuleRegistry } from "../../core/runtime/RuleRegistry";
import { LoadedTheme } from "../../@types";
import { util } from "./helper";

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  const { addExactDecl } = util(reg, theme);

  addExactDecl(reg, "block", "display", "block");
  addExactDecl(reg, "inline", "display", "inline");
  addExactDecl(reg, "inline-block", "display", "inline-block");
  addExactDecl(reg, "inline-flex", "display", "inline-flex");
  addExactDecl(reg, "flex", "display", "flex");
  addExactDecl(reg, "grid", "display", "grid");
  addExactDecl(reg, "table", "display", "table");
  addExactDecl(reg, "contents", "display", "contents");
  addExactDecl(reg, "hidden", "display", "none");
  addExactDecl(reg, "visible", "visibility", "visible");
  addExactDecl(reg, "invisible", "visibility", "hidden");

  // list
  addExactDecl(reg, "list-item", "display", "list-item");
  addExactDecl(reg, "list-inside", "list-style-position", "inside");
  addExactDecl(reg, "list-outside", "list-style-position", "outside");
  addExactDecl(reg, "list-disc", "list-style-type", "disc");
  addExactDecl(reg, "list-decimal", "list-style-type", "decimal");
}
