import { Theme } from "../../@types";
import { type CssBuilder } from "../../core/builder";
import { ClassEngine } from "../../core/runtime/ClassEngine";
import { stringify } from "../../core/runtime/stringify";
import { TailwindCompat } from "./tailwind";

// Keep the options type light; pass through to TailwindCompat inside ClassEngine.
export type TailwindCompatEngineOptions = {
  prefix?: string;
  important?: boolean | string;
  screens?: Record<string, string>;
  theme?: Theme;
  safelist?: string[];
  layerKey?: string; // optional stable key for de-dupe
};

export interface TWNamespace<B> {
  add: (classes: string | string[]) => B;
  clear: () => B;
  queue: () => string[];
}

export type TailwindAugmented<B extends CssBuilder> = B & {
  tw: TWNamespace<B>;
};

export function withTailwind<B extends CssBuilder>(
  builder: B,
  opts: TailwindCompatEngineOptions,
): TailwindAugmented<B> {
  const queue = new Set<string>(opts.safelist ?? []);
  const key = opts.layerKey ?? "__compat.tailwind__";
  const engine = new ClassEngine({
    plugins: [TailwindCompat(builder, {})],
  });
  const b = builder as TailwindAugmented<B>;

  b.tw = {
    add: (classes) => {
      (Array.isArray(classes) ? classes : String(classes).split(/\s+/))
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((c) => queue.add(c));
      return b;
    },
    clear: () => {
      queue.clear();
      return b;
    },
    queue: () => Array.from(queue),
  };

  // Late injection into the "utilities" layer
  builder.onBeforeSerialize(() => {
    if (queue.size === 0) return;
    const cssObjects = engine.compile(Array.from(queue));
    const css = stringify(cssObjects);
    if (css && css.trim()) builder.utilities(css, key);
  });

  return b;
}

/**
 * Programmatic API (available only when this plugin is installed).
 * Typical usage (SSR/UMD):
 * ```
 *    builder.tw.add("text-sm md:hover:bg-blue-600");
 *    builder.tw.add(["ring", "blur-md"]);
 * ```
 *
 * @param opts TailwindCompatEngineOptions
 * @returns TailwindAugmented
 */
export function tailwindScanPlugin<B extends CssBuilder>(
  opts: TailwindCompatEngineOptions = {},
) {
  return (builder: B) => withTailwind(builder, opts);
}
