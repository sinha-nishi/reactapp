import { CssBuilder, BuilderPlugin } from "../../core/builder";
import type { BuilderOptions, UtilitiesOptions } from "../../@types";
import { defaultTokens } from "../../tokens";
import { hexToRgb } from "../../utils/colors";
import { buildUtilities } from "./build";
import { ClassEngine } from "../../core/runtime/ClassEngine";
import { ClassEnginePlugin, CSSObject, BuilderContext } from "@/@types";
import { variants } from "../../utils/variants";

export function withTheme<B extends CssBuilder>(
  builder: B,
  opts: BuilderOptions,
): CssBuilder {
  console.log("applying utilitiesPlugin with opts: ");
  const engine = new ClassEngine({ plugins: [utilitiesEngine(builder)] });

  // Late injection into the "utilities" layer
  builder.onBeforeSerialize(() => {
    console.log("stsarted presetClasses utilities count: 2 = ");
    const presetClasses = engine.enumerate(builder.ctx, {});
    console.log("presetClasses utilities count: 3 = ", presetClasses);
    const cssObjects = engine.compile(presetClasses);
    const css = ClassEngine.toCss(cssObjects);
    if (css && css.trim()) builder.utilities(css, "key");
  });

  return builder;
}

const utilitiesEngine = (b: CssBuilder): ClassEnginePlugin => {
  const { theme } = b.ctx;
  const themeView = theme.view("light");

  const util = buildUtilities(themeView, {
    enableArbitraryValues: false /*b.opts.enableArbitraryValues !== false*/,
    prefix: b.opts.prefix ?? "",
  });

  return {
    name: "utilities-engine",
    variants: variants(b.opts.screens),
    match(className: string) {
      return util.match(className);
    },
    render(match, meta): CSSObject[] {
      return util.render(match, meta, b.ctx);
    },
    enumerate: (ctx, o) => util.enumerate(b.ctx, o),
  };
};

export const utilitiesPlugin =
  (opts: BuilderOptions = {}): BuilderPlugin =>
  (b: CssBuilder) =>
    withTheme(b, opts);
