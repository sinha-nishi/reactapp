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
  const engine = new ClassEngine({ plugins: [utilitiesEngine(builder)] });

  // Late injection into the "utilities" layer
  builder.onBeforeSerialize(() => {
    const presetClasses = engine.enumerate(builder.ctx, { variants: true });
    const cssObjects = engine.compile(presetClasses);
    const css = ClassEngine.toCss(cssObjects);
    if (css && css.trim()) builder.utilities(css, "key");
  });

  return builder;
}

const utilitiesEngine = (b: CssBuilder): ClassEnginePlugin => {
  const { theme } = b.ctx;

  const util = buildUtilities(theme, {
    enableArbitraryValues: false /*b.opts.enableArbitraryValues !== false*/,
    prefix: b.opts.prefix ?? "",
  });

  const v = variants(
    b.ctx?.screens ?? {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  );

  return {
    name: "utilities-engine",
    variants(tokens, decls) {
      return v(tokens ?? [], decls ?? []);
    },
    // variants(tokens: string[], decls: CSSObject[]): CSSObject[] {
    //   console.log("Utility variants:", tokens, decls);
    //   if (!tokens?.length) return decls;

    //   const responsive = new Set(["sm", "md", "lg", "xl", "2xl"]);

    //   // NOTE: put your actual breakpoint values here (Tailwind defaults)
    //   const screens: Record<string, string> = b.ctx?.screens ??
    //     (theme as any)?.screens ?? {
    //       sm: "640px",
    //       md: "768px",
    //       lg: "1024px",
    //       xl: "1280px",
    //       "2xl": "1536px",
    //     };

    //   const applySelectorVariant = (t: string, sel: string) => {
    //     if (t === "hover") return `${sel}:hover`;
    //     if (t === "focus") return `${sel}:focus`;
    //     if (t === "active") return `${sel}:active`;
    //     if (t === "disabled") return `${sel}:disabled`;

    //     if (t === "group-hover") return `.group:hover ${sel}`;
    //     if (t === "dark") return `.dark ${sel}`;

    //     return sel;
    //   };

    //   // First apply selector-level variants
    //   let out = decls.map((o) => {
    //     let selector = o.selector;
    //     for (const t of tokens) {
    //       if (responsive.has(t)) continue;
    //       selector = applySelectorVariant(t, selector);
    //     }
    //     return { ...o, selector };
    //   });

    //   // Then wrap responsive tokens (media queries)
    //   // Your stringify already outputs @media blocks (seen in pkv.theme.css),
    //   // so we can safely emit media wrapper objects.
    //   for (const t of tokens) {
    //     if (!responsive.has(t)) continue;
    //     const min = screens[t];
    //     if (!min) continue;

    //     out = [
    //       {
    //         selector: `@media (min-width: ${min})`,
    //         // IMPORTANT: this assumes your CSSObject supports nesting via `children`.
    //         // If your type uses `rules`/`body` instead, tell me and I’ll adjust.
    //         children: out,
    //       } as any,
    //     ];
    //   }

    //   return out;
    // },

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
