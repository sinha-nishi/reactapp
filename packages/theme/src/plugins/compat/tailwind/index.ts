// Tailwind-compat entrypoint: registers utilities, variants, and resolver
import { buildUtilities } from "./utilities";
import { variants } from "../../../utils/variants";
import type {
  CSSObject,
  ClassEnginePlugin,
  UtilityContext,
} from "../../../@types";
import { defaultScales } from "../../../tokens";

export interface TailwindCompatOptions {
  // allow custom user overrides from pkv.config.ts
  theme?: Partial<typeof defaultScales>;
  screens?: Record<string, string>; // e.g. { xs:"360px", sm:"640px", md:"768px", ... }
  important?: boolean | string; // true => global !important, or selector prefix like "#app"
  enableArbitraryValues?: boolean; // default true
  prefix?: string; // optional utility prefix, e.g. "tw-"
}

export const TailwindCompat = (
  opts: TailwindCompatOptions = {},
): ClassEnginePlugin => {
  const theme = { ...defaultScales, ...(opts.theme ?? {}) };
  const screens = opts.screens ?? {
    xs: "360px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  };

  const util = buildUtilities(theme, {
    enableArbitraryValues: opts.enableArbitraryValues !== false,
    prefix: opts.prefix ?? "",
  });

  const ctx: UtilityContext = {
    theme,
    screens,
    important: opts.important ?? false,
    resolveColor(nameOrHex: string, alpha?: string) {
      // accepts palette key "red-500" or hex/rgb; supports "/<alpha>" notation
      const [base, a] = (alpha ? [nameOrHex, alpha] : nameOrHex.split("/")) as [
        string,
        string?,
      ];
      const hex = (theme.colors as Record<string, string>)[base] ?? base;
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
      return util.match(className);
    },
    render(match, meta): CSSObject[] {
      return util.render(match, meta, ctx);
    },
    enumerate: (ctx, o) => util.enumerate(ctx, o),
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
