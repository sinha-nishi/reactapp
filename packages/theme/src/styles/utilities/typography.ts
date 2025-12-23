import { RuleRegistry } from "@/core/runtime/RuleRegistry";
import type { LoadedTheme } from "../../@types";
import { style, styleMany, util } from "./helper";

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  const fontSizeKeys = new Set(theme.keys("fontSize"));
  const colorKeys = theme.keys("colors");

  reg.addPrefixRule("text-", {
    family: "typography",
    match: (cls) => {
      const body = cls.slice(5);
      if (["left", "right", "center", "justify"].includes(body)) return false;
      if (fontSizeKeys.has(body))
        return { kind: "fontSize", key: body, raw: cls };
      return { kind: "color", key: body, raw: cls };
    },
    apply: (m: any, meta, ctx) => {
      if (m.kind === "fontSize") {
        const fs = String(theme.value(`fontSize.${m.key}`));
        return styleMany({ "font-size": fs }, ctx, meta);
      }
      return style("color", theme.resolveColor(m.key), ctx, meta);
    },
    enumerate: () => [
      ...Array.from(fontSizeKeys).map((k) => `text-${k}`),
      ...colorKeys.map((k) => `text-${k}`),
    ],
  });

  const { addExactDecl, scaleMap } = util(reg, theme);

  // font weights
  const fw = scaleMap("fontWeight");
  for (const k of Object.keys(fw)) {
    reg.addExactRule(`font-${k}`, {
      family: "typography",
      match: (cls) => (cls === `font-${k}` ? { raw: cls } : false),
      apply: (m, meta, ctx) => style("font-weight", fw[k], ctx, meta),
      enumerate: () => [`font-${k}`],
    });
  }

  // leading / tracking
  const lh = scaleMap("lineHeight");
  reg.addPrefixRule("leading-", {
    family: "typography",
    match: (cls) => {
      const key = cls.slice("leading-".length);
      return key in lh ? { key, raw: cls } : false;
    },
    apply: (m, meta, ctx) => style("line-height", lh[m.key], ctx, meta),
    enumerate: () => Object.keys(lh).map((k) => `leading-${k}`),
  });

  const ls = scaleMap("letterSpacing");
  reg.addPrefixRule("tracking-", {
    family: "typography",
    match: (cls) => {
      const key = cls.slice("tracking-".length);
      return key in ls ? { key, raw: cls } : false;
    },
    apply: (m, meta, ctx) => style("letter-spacing", ls[m.key], ctx, meta),
    enumerate: () => Object.keys(ls).map((k) => `tracking-${k}`),
  });

  // alignment
  addExactDecl(reg, "text-left", "text-align", "left");
  addExactDecl(reg, "text-center", "text-align", "center");
  addExactDecl(reg, "text-right", "text-align", "right");
  addExactDecl(reg, "text-justify", "text-align", "justify");

  // truncate
  addExactDecl(reg, "truncate", "overflow", "hidden");
  addExactDecl(reg, "truncate", "text-overflow", "ellipsis");
  addExactDecl(reg, "truncate", "white-space", "nowrap");

  // underline
  addExactDecl(reg, "underline", "text-decoration-line", "underline");

  // case
  addExactDecl(reg, "uppercase", "text-transform", "uppercase");
  addExactDecl(reg, "lowercase", "text-transform", "lowercase");

  // sr-only
  addExactDecl(reg, "sr-only", "position", "absolute");
  addExactDecl(reg, "sr-only", "width", "1px");
  addExactDecl(reg, "sr-only", "height", "1px");
  addExactDecl(reg, "sr-only", "padding", "0");
  addExactDecl(reg, "sr-only", "margin", "-1px");
  addExactDecl(reg, "sr-only", "overflow", "hidden");
  addExactDecl(reg, "sr-only", "clip", "rect(0, 0, 0, 0)");
  addExactDecl(reg, "sr-only", "white-space", "nowrap");
  addExactDecl(reg, "sr-only", "border-width", "0");
}
