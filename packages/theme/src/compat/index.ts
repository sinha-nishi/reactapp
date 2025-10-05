import { BuilderPlugin } from "../builder/core";

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
};

export const compatPlugin =
  (opts: Opts = {}): BuilderPlugin =>
  (b) => {
    if (opts.tailwind) tw(b);
    if (opts.bootstrap) bs(b);
  };
