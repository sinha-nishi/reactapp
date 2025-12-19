import { CssBuilder, BuilderPlugin } from "../../core/builder";
import type { BuilderOptions, UtilitiesOptions } from "../../@types";
import { defaultScales } from "../../tokens";
import { hexToRgb } from "../../utils/colors";
import { buildUtilities } from "./build";
import { ClassEngine } from "../../core/runtime/ClassEngine";
import { ClassEnginePlugin, CSSObject, BuilderContext } from "@/@types";
import { variants } from "../../utils/variants";

export function withTheme<B extends CssBuilder>(
  builder: B,
  opts: UtilitiesOptions,
): CssBuilder {
  const engine = new ClassEngine({ plugins: [utilitiesEngine(opts)] });

  // Late injection into the "utilities" layer
  builder.onBeforeSerialize(() => {
    const presetClasses = engine.enumerate(builder.ctx, {});
    const cssObjects = engine.compile(presetClasses);
    const css = ClassEngine.toCss(cssObjects);
    if (css && css.trim()) builder.utilities(css, "key");
  });

  return builder;
}

export const utilitiesEngine = (opts: UtilitiesOptions): ClassEnginePlugin => {
  const theme = { ...defaultScales, ...(opts.theme ?? {}) };

  const screens = opts.screens ?? {
    xs: "360px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  };

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

  const util = buildUtilities(theme, {
    enableArbitraryValues: opts.enableArbitraryValues !== false,
    prefix: opts.prefix ?? "",
  });

  return {
    name: "utilities-engine",
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

export const utilitiesPlugin =
  (opts: UtilitiesOptions = {}): BuilderPlugin =>
  (b: CssBuilder) =>
    withTheme(b, opts);

  