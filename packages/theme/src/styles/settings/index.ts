import { CssBuilder, BuilderPlugin } from "../../core/builder";
import type { SettingsPluginOptions } from "../../@types";

type CssVarMap = Record<`--${string}`, string | number>;

function normalizeSelector(t: string, s?: string) {
  return s ?? `:root[data-theme="${t}"]`;
}

function isAtMedia(selector: string) {
  return selector.trim().startsWith("@media");
}

function toCssVarMapFromTokens(
  tokens: Record<string, string | number>,
): CssVarMap {
  const out: CssVarMap = {} as any;
  for (const [k, v] of Object.entries(tokens))
    out[`--${k}` as `--${string}`] = v as any;
  return out;
}

function diffVars(next: CssVarMap, base: CssVarMap): CssVarMap {
  const out: CssVarMap = {} as any;
  for (const [k, v] of Object.entries(next)) {
    if (!(k in base) || base[k as `--${string}`] !== v)
      out[k as `--${string}`] = v as any;
  }
  return out;
}

/**
 * Abstract theme detection:
 * - A theme is "abstract" if it is a parent of some other theme (in extends graph)
 * - AND it does not have an explicit selector in meta.selectors
 * - AND it is not the default theme
 */
function computeAbstractThemes(theme: any) {
  const pack = theme.raw; // LoadedTheme.raw = TokenPack
  const metaSelectors: Record<string, string> = pack?.meta?.selectors ?? {};
  const declaredSelectorThemes = new Set(Object.keys(metaSelectors));

  // collect parent themes from both meta.extends and per-theme extends
  const parentSet = new Set<string>();

  const metaExtends: Record<string, string[]> = pack?.meta?.extends ?? {};
  for (const [_child, parents] of Object.entries(metaExtends)) {
    for (const p of parents ?? []) parentSet.add(p);
  }

  const themesObj: Record<string, any> = (pack as any)?.themes ?? {};
  for (const t of Object.keys(themesObj)) {
    const parents = themesObj[t]?.extends ?? [];
    for (const p of parents) parentSet.add(p);
  }

  const abstract = new Set<string>();
  for (const t of theme.themeNames as string[]) {
    if (t === theme.meta.defaultTheme) continue;
    if (parentSet.has(t) && !declaredSelectorThemes.has(t)) abstract.add(t);
  }
  return abstract;
}

export const settingsPlugin =
  (opts?: SettingsPluginOptions): BuilderPlugin =>
  (b: CssBuilder) => {
    const { theme } = b.ctx;
    const defaultTheme = theme.meta.defaultTheme;

    // Default theme tokens go to :root via builder tokens
    const baseTokens = theme.tokensByTheme[defaultTheme] ?? {};
    const overrideTokens = opts?.overrides?.[defaultTheme] ?? {};
    b.setTokens({ ...baseTokens, ...overrideTokens });

    // We will diff other themes against the default theme vars
    const defaultVars: CssVarMap = (theme.cssVarsByTheme[defaultTheme] ??
      {}) as any;

    // Detect abstract themes like "base" so they never get emitted
    const abstractThemes = computeAbstractThemes(theme);

    for (const t of theme.themeNames as string[]) {
      if (t === defaultTheme) continue;
      if (abstractThemes.has(t)) continue; // ✅ fixes :root[data-theme="base"]

      const selector = normalizeSelector(t, theme.meta.selectors?.[t]);

      const themeVars: CssVarMap = (theme.cssVarsByTheme[t] ?? {}) as any;

      // only emit what changes vs default theme (inheritance causes huge overlap)
      const changed = diffVars(themeVars, defaultVars);

      // allow overrides for this theme
      const overrideTokenMap = opts?.overrides?.[t] ?? {};
      const overrideTokenVars = toCssVarMapFromTokens(overrideTokenMap);

      const overrideCssVars: CssVarMap = (opts?.cssVarOverrides?.[t] ??
        {}) as any;

      // overrides should always be included (even if same as default)
      const merged: CssVarMap = {
        ...changed,
        ...overrideTokenVars,
        ...overrideCssVars,
      };

      if (!Object.keys(merged).length) continue;

      if (isAtMedia(selector)) {
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
