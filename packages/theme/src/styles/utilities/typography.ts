import { RuleRegistry } from "@/core/runtime/RuleRegistry";
import type { LoadedTheme } from "../../@types";
import { style, styleMany, util } from "./helper";

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  const { addScale, addExactDecl, defaultThemeName } = util(reg, theme);

  const fontSizeKeys = new Set(theme.keys("fontSize"));

  // text-* (font-size OR semantic color)
  reg.addPrefixRule("text-", {
    family: "typography",
    match: (cls) => {
      const body = cls.slice(5);
      if (fontSizeKeys.has(body))
        return { kind: "fontSize", key: body, raw: cls };
      return { kind: "color", key: body, raw: cls };
    },
    apply: (m: any, meta, ctx) => {
      if (m.kind === "fontSize") {
        // Prefer theme.value() so theme switching works via vars.
        // If your view stores tuple values, we apply the extra lineHeight if present.
        const viewFontSize = (theme.view(defaultThemeName) as any)?.fontSize?.[
          m.key
        ];
        const fs = theme.value(`fontSize.${m.key}`);

        if (Array.isArray(viewFontSize)) {
          const [, more] = viewFontSize as [
            string,
            { lineHeight?: string; letterSpacing?: string },
          ];
          const extra: Record<string, string> = {};
          if (more?.lineHeight) extra["line-height"] = more.lineHeight;
          if (more?.letterSpacing) extra["letter-spacing"] = more.letterSpacing;
          return styleMany({ "font-size": String(fs), ...extra }, ctx, meta);
        }

        return style("font-size", String(fs), ctx, meta);
      }

      return style("color", ctx.resolveColor(m.key), ctx, meta);
    },
  });

  // font weight (exact tailwind-style names)
  const fwNames = [
    "thin",
    "extralight",
    "light",
    "normal",
    "medium",
    "semibold",
    "bold",
    "extrabold",
    "black",
  ] as const;

  for (const k of fwNames) {
    // only emit if key exists
    const all = new Set(theme.keys("fontWeight"));
    if (!all.has(k)) continue;

    reg.addExactRule(`font-${k}`, {
      family: "typography",
      match: (cls) => (cls === `font-${k}` ? { raw: cls } : false),
      apply: (m, meta, ctx) => {
        const fw = theme.value(`fontWeight.${k}`);
        return style("font-weight", String(fw), ctx, meta);
      },
    });
  }

  // line-height (leading-*)
  addScale(reg, "typography", "leading-", "line-height", "lineHeight");

  // letter-spacing (tracking-*)
  addScale(reg, "typography", "tracking-", "letter-spacing", "letterSpacing");

  // alignment
  addExactDecl(reg, "text-left", "text-align", "left");
  addExactDecl(reg, "text-center", "text-align", "center");
  addExactDecl(reg, "text-right", "text-align", "right");
  addExactDecl(reg, "text-justify", "text-align", "justify");
}
