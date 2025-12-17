import { BuilderPlugin, type CssBuilder } from "../builder/core";
import { ClassEngine } from "../runtime/classEngine";
import { stringify } from "../runtime/stringify";

type Opts = { tailwind?: boolean; bootstrap?: boolean };

// Tailwind subset mapping (common classes 0..8 scale)
const tw = (b: any) => {
  const spacing = [0, 4, 8, 12, 16, 24, 32, 40, 48];
  const toRem = (px: number) => `${px / 16}rem`;
  const s = (i: number) => toRem(spacing[i] ?? 0);

  // Display
  b.utilities(`.flex`, `display:flex`, "tw-flex");
  b.utilities(`.inline-flex`, `display:inline-flex`, "tw-inline-flex");
  b.utilities(`.grid`, `display:grid`, "tw-grid");

  // Flex/grid alignment
  b.rule("utilities", `.items-center`, `align-items:center`, "tw-items-center");
  b.rule(
    "utilities",
    `.justify-center`,
    `justify-content:center`,
    "tw-justify-center",
  );
  b.rule(
    "utilities",
    `.justify-between`,
    `justify-content:space-between`,
    "tw-justify-between",
  );
  b.rule("utilities", `.gap-1`, `gap:${s(1)}`, "tw-gap-1");
  b.rule("utilities", `.gap-2`, `gap:${s(2)}`, "tw-gap-2");
  b.rule("utilities", `.gap-3`, `gap:${s(3)}`, "tw-gap-3");
  b.rule("utilities", `.gap-4`, `gap:${s(4)}`, "tw-gap-4");

  // Spacing (p/m + axis + sides, subset)
  const sides = [
    ["", ""],
    ["x", "inline-"],
    ["y", "block-"],
    ["t", "block-start-"],
    ["r", "inline-end-"],
    ["b", "block-end-"],
    ["l", "inline-start-"],
  ] as const;
  const props = (base: "margin" | "padding") =>
    [
      ["", base],
      ["x", base + "-inline"],
      ["y", base + "-block"],
      ["t", base + "-block-start"],
      ["r", base + "-inline-end"],
      ["b", base + "-block-end"],
      ["l", base + "-inline-start"],
    ] as const;

  for (let i = 0; i <= 4; i++) {
    const val = s(i);
    for (const [k, p] of props("padding"))
      b.rule(
        "utilities",
        `.p${k ? "-" + k : ""}-${i}`,
        `${p}:${val}`,
        `tw-p-${k}-${i}`,
      );
    for (const [k, p] of props("margin"))
      b.rule(
        "utilities",
        `.m${k ? "-" + k : ""}-${i}`,
        `${p}:${val}`,
        `tw-m-${k}-${i}`,
      );
  }

  // Border radius
  b.rule(
    "utilities",
    `.rounded`,
    `border-radius:var(--pkv-radius-md)`,
    "tw-rounded",
  );
  b.rule(
    "utilities",
    `.rounded-md`,
    `border-radius:var(--pkv-radius-md)`,
    "tw-rounded-md",
  );

  // Typography
  b.rule("utilities", `.text-sm`, `font-size:0.875rem`, "tw-text-sm");
  b.rule("utilities", `.text-base`, `font-size:1rem`, "tw-text-base");
  b.rule("utilities", `.text-lg`, `font-size:1.125rem`, "tw-text-lg");
  b.rule("utilities", `.font-semibold`, `font-weight:600`, "tw-font-semibold");

  // Colors (primary subset)
  b.rule(
    "utilities",
    `.bg-primary-500`,
    `background-color:var(--pkv-color-primary-500)`,
    "tw-bg-primary-500",
  );
  b.rule(
    "utilities",
    `.text-primary-500`,
    `color:var(--pkv-color-primary-500)`,
    "tw-text-primary-500",
  );

  // Container / centering
  b.rule(
    "utilities",
    `.container`,
    `max-width:1200px;margin-inline:auto;padding-inline:var(--pkv-space-3)`,
    "tw-container",
  );
  b.rule("utilities", `.mx-auto`, `margin-inline:auto`, "tw-mx-auto");
  b.rule("utilities", `.px-4`, `padding-inline:1rem`, "tw-px-4");

  // direction/wrap
  for (const [k, v] of Object.entries({ row: "row", col: "column" }))
    b.rule("utilities", `.flex-${k}`, `flex-direction:${v}`, `tw-flex-${k}`);
  for (const [k, v] of Object.entries({ wrap: "wrap", nowrap: "nowrap" }))
    b.rule("utilities", `.flex-${k}`, `flex-wrap:${v}`, `tw-flex-${k}`);
  // justify / items
  const jmap = {
    start: "flex-start",
    end: "flex-end",
    center: "center",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly",
  };
  for (const [k, v] of Object.entries(jmap))
    b.rule(
      "utilities",
      `.justify-${k}`,
      `justify-content:${v}`,
      `tw-justify-${k}`,
    );
  const amap = {
    start: "flex-start",
    end: "flex-end",
    center: "center",
    baseline: "baseline",
    stretch: "stretch",
  };
  for (const [k, v] of Object.entries(amap))
    b.rule("utilities", `.items-${k}`, `align-items:${v}`, `tw-items-${k}`);
  // widths/heights
  const fracs = {
    "1/2": "50%",
    "1/3": "33.333%",
    "2/3": "66.666%",
    "1/4": "25%",
    "3/4": "75%",
    full: "100%",
  };
  for (const [k, v] of Object.entries(fracs)) {
    const key = k.replace("/", "\\/");
    b.rule("utilities", `.w-${key}`, `width:${v}`, `tw-w-${k}`);
    b.rule("utilities", `.h-${key}`, `height:${v}`, `tw-h-${k}`);
  }
  // text align/weight
  for (const [k, v] of Object.entries({
    left: "left",
    center: "center",
    right: "right",
  }))
    b.rule("utilities", `.text-${k}`, `text-align:${v}`, `tw-text-${k}`);
  for (const [k, v] of Object.entries({
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  }))
    b.rule("utilities", `.font-${k}`, `font-weight:${v}`, `tw-font-${k}`);
  // rounding
  for (const [k, v] of Object.entries({
    sm: "6px",
    md: "var(--pkv-radius-md)",
    lg: "16px",
    full: "9999px",
  }))
    b.rule(
      "utilities",
      `.rounded-${k}`,
      `border-radius:${v}`,
      `tw-rounded-${k}`,
    );
  b.rule(
    "utilities",
    `.shadow`,
    `box-shadow:0 1px 2px rgba(0,0,0,.08),0 1px 1px rgba(0,0,0,.06)`,
    "tw-shadow",
  );
  b.rule("utilities", `.shadow-none`, `box-shadow:none`, "tw-shadow-none");
};

const bs = (b: any) => {
  // container / row / col (very small subset)
  b.rule(
    "utilities",
    `.container`,
    `max-width:1200px;margin-inline:auto;padding-inline:var(--pkv-space-3)`,
    "bs-container",
  );
  b.rule(
    "utilities",
    `.row`,
    `display:flex;flex-wrap:wrap;margin:-0.5rem`,
    "bs-row",
  );
  b.rule("utilities", `.col`, `flex:1 0 0%;padding:0.5rem`, "bs-col");

  // Buttons mapping to your component classes
  b.rule(
    "utilities",
    `.btn`,
    `display:inline-flex;align-items:center;justify-content:center;border-radius:var(--pkv-radius-md);padding:.5rem .875rem;line-height:1`,
    "bs-btn",
  );
  b.rule(
    "utilities",
    `.btn-primary`,
    `background:var(--pkv-color-primary-500);color:#fff`,
    "bs-btn-primary",
  );

  // display
  for (const d of ["block", "inline", "inline-block", "flex", "grid", "none"])
    b.rule("utilities", `.d-${d}`, `display:${d}`, `bs-d-${d}`);
  // justify/align
  const jmap = {
    start: "flex-start",
    end: "flex-end",
    center: "center",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly",
  };
  for (const [k, v] of Object.entries(jmap))
    b.rule(
      "utilities",
      `.justify-content-${k}`,
      `justify-content:${v}`,
      `bs-justify-${k}`,
    );
  const amap = {
    start: "flex-start",
    end: "flex-end",
    center: "center",
    baseline: "baseline",
    stretch: "stretch",
  };
  for (const [k, v] of Object.entries(amap))
    b.rule(
      "utilities",
      `.align-items-${k}`,
      `align-items:${v}`,
      `bs-align-${k}`,
    );
  // spacing 0..5 (0..3rem)
  const step = {
    0: "0",
    1: ".25rem",
    2: ".5rem",
    3: "1rem",
    4: "1.5rem",
    5: "3rem",
  };
  const dirs = [
    ["", ""],
    ["x", "inline"],
    ["y", "block"],
    ["t", "block-start"],
    ["r", "inline-end"],
    ["b", "block-end"],
    ["l", "inline-start"],
  ];
  for (const [i, val] of Object.entries(step))
    for (const [k, prop] of dirs) {
      b.rule(
        "utilities",
        `.m${k ? "-" + k : ""}-${i}`,
        `${prop ? `margin-${prop}` : "margin"}:${val}`,
        `bs-m-${k}-${i}`,
      );
      b.rule(
        "utilities",
        `.p${k ? "-" + k : ""}-${i}`,
        `${prop ? `padding-${prop}` : "padding"}:${val}`,
        `bs-p-${k}-${i}`,
      );
    }
  // columns
  for (let i = 1; i <= 12; i++) {
    const pct = ((i / 12) * 100)
      .toFixed(6)
      .replace(/0+$/, "")
      .replace(/\\.$/, "");
    b.rule(
      "utilities",
      `.col-${i}`,
      `flex:0 0 auto;width:${pct}%`,
      `bs-col-${i}`,
    );
  }
};

export const compatPlugin =
  (opts: Opts = {}): BuilderPlugin<CssBuilder> =>
  (b) => {
    if (opts.tailwind) tw(b);
    if (opts.bootstrap) bs(b);
  };

// Keep the options type light; pass through to TailwindCompat inside ClassEngine.
export type TailwindCompatEngineOptions = {
  prefix?: string;
  important?: boolean | string;
  screens?: Record<string, string>;
  theme?: Record<string, any>;
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
  const engine = new ClassEngine({ compat: [["tailwind", opts]] });
  const b = builder as TailwindAugmented<B>;

  b.tw = {
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

  // Late injection into the "utilities" layer
  builder.onBeforeSerialize(() => {
    console.log("serialising the tailwind classes:: ", queue.size, queue);
    if (queue.size === 0) return;
    const cssObjects = engine.compile(Array.from(queue));
    const css = stringify(cssObjects);
    console.log("classes in css form: ", css);
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
export function compatTailwindPlugin<B extends CssBuilder>(
  opts: TailwindCompatEngineOptions = {},
) {
  return (builder: B) => withTailwind(builder, opts);
}
