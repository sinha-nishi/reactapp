import { CssBuilder, BuilderPlugin } from "../../core/builder";
import type { BuilderOptions } from "../../@types/styleOptions";

export const settingsPlugin =
  (opts: BuilderOptions = {}): BuilderPlugin =>
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
  };
