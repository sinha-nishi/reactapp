// Tailwind-compat entrypoint: registers utilities, variants, and resolver
import { tailwindRules } from "./rules";
import { variants } from "../../../utils/variants";
import type {
  CSSObject,
  ClassEnginePlugin,
  BuilderContext,
} from "../../../@types";
import { defaultTokens } from "../../../tokens";

export interface TailwindCompatOptions {
  // allow custom user overrides from pkv.config.ts
  theme?: Partial<typeof defaultTokens>;
  screens?: Record<string, string>; // e.g. { xs:"360px", sm:"640px", md:"768px", ... }
  important?: boolean | string; // true => global !important, or selector prefix like "#app"
  enableArbitraryValues?: boolean; // default true
  prefix?: string; // optional utility prefix, e.g. "tw-"
}

export const TailwindCompat = (
  opts: TailwindCompatOptions = {},
): ClassEnginePlugin => {
  const theme = { ...(defaultTokens.primitive as any), ...(opts.theme ?? {}) };
  const screens = opts.screens ?? {
    xs: "360px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  };

  const rules = tailwindRules(theme, {
    enableArbitraryValues: opts.enableArbitraryValues !== false,
    prefix: opts.prefix ?? "",
  });

  const ctx: BuilderContext = {
    theme,
    screens,
    important: opts.important ?? false,
    resolveColor(nameOrHex: string, alpha?: string) {
      // accepts palette key "red-500" or hex/rgb; supports "/<alpha>" notation
      const [base, a] = (alpha ? [nameOrHex, alpha] : nameOrHex.split("/")) as [
        string,
        string?,
      ];
      // TODO: fix reference to light view
      // const hex = (theme.view("light").colors as Record<string, string>)[base] ?? base;
      const hex = "#FFFFFF";
      if (!a) return hex;
      // convert hex to rgba with alpha percentage (00..100 or 0..1)
      const alphaVal = a.includes("%")
        ? parseFloat(a) / 100
        : parseFloat(a) > 1
          ? parseFloat(a) / 100
          : parseFloat(a);
      const { r, g, b } = hexToRgb(hex);
      return `rgba(${r}, ${g}, ${b}, ${Number.isFinite(alphaVal) ? alphaVal : 1})`;
    },
  };

  return {
    name: "tailwind-compat",
    variants: variants(screens),
    match(className: string) {
      return rules.match(className);
    },
    render(match, meta): CSSObject[] {
      return rules.render(match, meta, ctx);
    },
    enumerate: (ctx, o) => rules.enumerate(ctx, o),
  };
};

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const n =
    h.length === 3
      ? h
          .split("")
          .map((x) => x + x)
          .join("")
      : h;
  const int = parseInt(n, 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}
