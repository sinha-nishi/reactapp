import { CssBuilder, BuilderPlugin } from "../builder/core";

export type ThemeOptions = {
  tokens?: Partial<Record<string, string>>;
  utilities?: { spacingScale?: number[] };
};

export const themePlugin =
  (opts: ThemeOptions = {}): BuilderPlugin =>
  (b: CssBuilder) => {
    // 01-settings: tokens
    const defaults = {
      "color-primary-500": "#4f46e5",
      "color-border": "#e5e7eb",
      "radius-md": "10px",
      "space-2": "0.5rem",
      "space-3": "0.75rem",
      "font-sans": "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
    };
    b.setTokens({ ...defaults, ...(opts.tokens || {}) });

    // 03-generic: reset/normalize (minimal)
    b.layer(
      "generic",
      `*,*::before,*::after{box-sizing:border-box}`,
      "generic-reset",
    );
    b.layer("generic", `html,body{padding:0;margin:0}`, "generic-html-body");

    // 07-utilities: spacing
    const scale = opts.utilities?.spacingScale ?? [0, 4, 8, 12, 16, 24, 32];
    scale.forEach((px, i) => {
      const rem = `${px / 16}rem`;
      b.rule("utilities", `.u-m-${i}`, `margin:${rem}`, `u-m-${i}`);
      b.rule("utilities", `.u-p-${i}`, `padding:${rem}`, `u-p-${i}`);
    });
  };
