import { CssBuilder, BuilderPlugin } from "../../core/builder";
import type { StyleOptions } from "../../@types/styleOptions";
import { defaultScales } from "../../tokens";
import { hexToRgb } from "../../utils/colors";
import { buildUtilities } from "./build";
import { Scanner } from "../../core/runtime/Scanner";
import { ClassEnginePlugin, CSSObject, UtilityContext } from "@/@types";
import { variants } from "../../utils/variants";

export interface ThemeNamespace<B> {
  add: (classes: string | string[]) => B;
  clear: () => B;
  queue: () => string[];
}

export type ThemeAugmented<B extends CssBuilder> = B & {
  theme: ThemeNamespace<B>;
};

export interface UtilitiesOptions {
  // allow custom user overrides from pkv.config.ts
  theme?: Partial<typeof defaultScales>;
  screens?: Record<string, string>; // e.g. { xs:"360px", sm:"640px", md:"768px", ... }
  important?: boolean | string; // true => global !important, or selector prefix like "#app"
  enableArbitraryValues?: boolean; // default true
  prefix?: string; // optional utility prefix, e.g. "tw-"
}

export function withTheme<B extends CssBuilder>(
  builder: B,
  opts: UtilitiesOptions,
): ThemeAugmented<B> {
  const queue = new Set<string>([]);
  // const key = opts.layerKey ?? "__compat.tailwind__";
  // const engine = new ClassEngine({ compat: [["tailwind", opts]] });
  const b = builder as ThemeAugmented<B>;
  const scanner = new Scanner();

  scanner.use();

  b.theme = {
    add: (classes) => {
      (Array.isArray(classes) ? classes : String(classes).split(/\s+/))
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((c) => queue.add(c));
      console.log("added classes to the tailwind queue: ", queue);
      return b;
    },
    clear: () => {
      queue.clear();
      return b;
    },
    queue: () => Array.from(queue),
  };

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

  // Late injection into the "utilities" layer
  builder.onBeforeSerialize(() => {
    console.log("serialising the tailwind classes:: ", queue.size, queue);
    if (queue.size === 0) return;
    // const cssObjects = engine.compile(Array.from(queue));
    // const css = stringify(cssObjects);
    // console.log("classes in css form: ", css);
    // if (css && css.trim()) builder.utilities(css, key);
  });

  return b;
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
