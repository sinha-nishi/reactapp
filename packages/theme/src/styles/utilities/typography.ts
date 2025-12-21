import { RuleRegistry } from "@/core/runtime/RuleRegistry";
import type { Theme } from "../../@types";
import { style, styleMany, util } from "./helper";

export function register(reg: RuleRegistry, theme: Theme) {
  // text-* size or color
  reg.addPrefixRule("text-", {
    match: (cls) => {
      const body = cls.slice(5);
      if (theme.fontSize?.[body])
        return { kind: "fontSize", key: body, raw: cls };
      return { kind: "color", key: body, raw: cls };
    },
    apply: (m: any, meta, ctx) => {
      if (m.kind === "fontSize") {
        const val = theme.fontSize[m.key];
        const [fs, more] = Array.isArray(val) ? val : [val, {}];
        const extra: Record<string, string> = {};
        if (more?.lineHeight) extra["line-height"] = more.lineHeight;
        return styleMany({ "font-size": fs, ...extra }, ctx, meta);
      }
      return style("color", ctx.resolveColor(m.key), ctx, meta);
    },
  });

  // font weight
  const fw = theme.fontWeight || {};
  const FW = [
    ["font-thin", fw.thin],
    ["font-extralight", fw.extralight],
    ["font-light", fw.light],
    ["font-normal", fw.normal],
    ["font-medium", fw.medium],
    ["font-semibold", fw.semibold],
    ["font-bold", fw.bold],
    ["font-extrabold", fw.extrabold],
    ["font-black", fw.black],
  ] as const;

  const { addScale, addExactDecl } = util(reg, theme);

  for (const [name, val] of FW) {
    if (!val) continue;
    reg.addExactRule(name, {
      match: (cls) => (cls === name ? { raw: cls } : false),
      apply: (m, meta, ctx) => style("font-weight", String(val), ctx, meta),
    });
  }

  // line-height / letter-spacing TODO:
  // addScale(reg, "leading-", "line-height", theme.lineHeight);
  // addScale(reg, "tracking-", "letter-spacing", theme.letterSpacing);

  // alignment
  addExactDecl(reg, "text-left", "text-align", "left");
  addExactDecl(reg, "text-center", "text-align", "center");
  addExactDecl(reg, "text-right", "text-align", "right");
  addExactDecl(reg, "text-justify", "text-align", "justify");
}
