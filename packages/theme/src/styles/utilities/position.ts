import { RuleRegistry } from "../../core/runtime/RuleRegistry";
import { LoadedTheme } from "../../@types";
import { util, style } from "./helper";

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  const { scaleMap, addExactDecl, propScale } = util(reg, theme);

  // position keywords
  addExactDecl(reg, "static", "position", "static");
  addExactDecl(reg, "relative", "position", "relative");
  addExactDecl(reg, "absolute", "position", "absolute");
  addExactDecl(reg, "fixed", "position", "fixed");
  addExactDecl(reg, "sticky", "position", "sticky");

  // inset sides (use spacing scale)
  // assumes your propScale uses spacing scale under the hood
  propScale("top-", "top");
  propScale("right-", "right");
  propScale("bottom-", "bottom");
  propScale("left-", "left");

  // common exacts
  addExactDecl(reg, "top-0", "top", "0px");
  addExactDecl(reg, "right-0", "right", "0px");
  addExactDecl(reg, "bottom-0", "bottom", "0px");
  addExactDecl(reg, "left-0", "left", "0px");

  addExactDecl(reg, "left-1/2", "left", "50%");
  addExactDecl(reg, "right-1/2", "right", "50%");
  addExactDecl(reg, "top-1/2", "top", "50%");
  addExactDecl(reg, "bottom-1/2", "bottom", "50%");

  // z-index
  const Z: Record<string, string> = {
    "0": "0",
    "10": "10",
    "20": "20",
    "30": "30",
    "40": "40",
    "50": "50",
    auto: "auto",
  };

  reg.addPrefixRule("z-", {
    family: "position",
    match: (cls) =>
      cls.startsWith("z-") ? { key: cls.slice(2), raw: cls } : false,
    apply: (m, meta, ctx) => style("z-index", Z[m.key] ?? m.key, ctx, meta),
    enumerate: () => Object.keys(Z).map((k) => `z-${k}`),
  });
}
