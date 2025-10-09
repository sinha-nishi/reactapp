import { CssBuilder, BuilderPlugin } from "../../builder/core";
import type { StyleOptions } from "../../@types/styleOptions";
import { defaultScales } from "../../tokens";

// export const utilitiesPlugin =
//   (opts: StyleOptions = {}): BuilderPlugin =>
//   (b: CssBuilder) => {
//     // 07-utilities: spacing
//     // const scale = opts.utilities?.spacingScale ?? [0, 4, 8, 12, 16, 24, 32];
//     // scale.forEach((px, i) => {
//     //   const rem = `${px / 16}rem`;
//     //   b.rule("utilities", `.u-m-${i}`, `margin:${rem}`, `u-m-${i}`);
//     //   b.rule("utilities", `.u-p-${i}`, `padding:${rem}`, `u-p-${i}`);
//     // });
//   };

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

export const utilitiesPlugin =
  (opts: UtilitiesOptions = {}): BuilderPlugin =>
  (b: CssBuilder) =>
    withTheme(b, opts);
