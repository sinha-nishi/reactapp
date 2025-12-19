import { CssBuilder, BuilderPlugin } from "../../core/builder";
import type { SettingsPluginOptions } from "../../@types";

type CssVarMap = Record<`--${string}`, string | number>;

function toCssVarOverrides(map?: Record<string, string | number>): CssVarMap {
  const out: CssVarMap = {} as any;
  if (!map) return out;
  for (const [k, v] of Object.entries(map)) out[`--${k}` as any] = v as any;
  return out;
}

export const settingsPlugin =
  (opts?: SettingsPluginOptions): BuilderPlugin =>
  (b: CssBuilder) => {
    const { theme } = b.ctx;
    const def = theme.meta.defaultTheme;

    // Default theme goes into :root via tokens
    b.setTokens({
      ...(theme.tokensByTheme[def] ?? {}),
      ...(opts?.overrides?.[def] ?? {}),
    });

    // Emit other runtime themes as diffs vs default (+ overrides)
    for (const t of theme.runtimeThemes()) {
      if (t === def) continue;

      const vars = {
        ...theme.cssVarsDiff(t, def),
        ...toCssVarOverrides(opts?.overrides?.[t]),
        ...(opts?.cssVarOverrides?.[t] ?? {}),
      };

      theme.emitVars(b, t, vars, "settings");
    }

    // optional hint
    b.settings(":root", "color-scheme: light dark;");
  };
