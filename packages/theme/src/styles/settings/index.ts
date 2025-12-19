import { CssBuilder, BuilderPlugin } from "../../core/builder";
import type { SettingsPluginOptions } from "../../@types";

export const settingsPlugin =
  (opts?: SettingsPluginOptions): BuilderPlugin =>
  (b: CssBuilder) => {
    const { theme } = b.ctx;
    const defaultTheme = theme.meta.defaultTheme;

    // 1) Default theme -> goes into :root via builder tokens
    const baseTokens = theme.tokensByTheme[defaultTheme] ?? {};
    const overrideTokens = opts?.overrides?.[defaultTheme] ?? {};
    b.setTokens({ ...baseTokens, ...overrideTokens });

    // 2) Every non-default theme -> settings rule
    for (const t of theme.themeNames) {
      if (t === defaultTheme) continue;

      const selector = theme.meta.selectors[t] ?? `:root[data-theme="${t}"]`;
      const baseCssVars = theme.cssVarsByTheme[t] ?? {};
      const overrideCssVars = opts?.cssVarOverrides?.[t] ?? {};

      // Also allow non-- overrides for non-default themes (convert to --var)
      const overrideTokenMap = opts?.overrides?.[t] ?? {};
      const overrideTokenVars: Record<`--${string}`, string | number> =
        {} as any;
      for (const [k, v] of Object.entries(overrideTokenMap)) {
        overrideTokenVars[`--${k}` as `--${string}`] = v as any;
      }

      const merged = {
        ...baseCssVars,
        ...overrideTokenVars,
        ...overrideCssVars,
      };
      if (!Object.keys(merged).length) continue;

      // If selector is an at-rule wrapper, emit a raw CSS block.
      // Example selector: "@media (prefers-color-scheme: dark)"
      if (selector.trim().startsWith("@media")) {
        const inner = `:root{${Object.entries(merged)
          .map(([k, v]) => `${k}:${v};`)
          .join("")}}`;
        b.settings(`${selector}{${inner}}`);
      } else {
        b.settings(selector, merged);
      }
    }

    // optional: browser hint
    b.settings(":root", "color-scheme: light dark;");
  };
