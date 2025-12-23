import {
  LoadedTheme,
  ThemeName,
  TokenPack,
  TokenTree,
  TokenValue,
  CssVarMap,
  LayerName,
  Theme,
} from "@/@types";
import { defaultTokens } from "./defaultTokens";

export type LoadThemeOptions = {
  defaults?: TokenTree; // applied to ALL themes before inheritance
  varNamingDefaults?: {
    stripPrefixes?: string[];
    rewrite?: Array<{ from: string; to: string }>;
  };
};

type VarNaming = {
  stripPrefixes: string[];
  rewrite: Array<{ from: string; to: string }>;
};

type ThemeDef = {
  extends?: string[];
  tokens?: TokenTree;
};

type TokenPackLike = Omit<TokenPack, "themes"> & {
  themes: Record<string, ThemeDef>;
};

// Runtime helper types

function isAtMedia(selector: string) {
  return selector.trim().startsWith("@media");
}

function diffVars(next: CssVarMap, base: CssVarMap): CssVarMap {
  const out: CssVarMap = {} as any;
  for (const [k, v] of Object.entries(next)) {
    if (!(k in base) || base[k as `--${string}`] !== v)
      out[k as `--${string}`] = v as any;
  }
  return out;
}

export function loadTheme(
  packIn: TokenPack,
  options?: LoadThemeOptions,
): LoadedTheme {
  const pack = packIn as unknown as TokenPackLike;

  const themeNames = Object.keys(pack.themes ?? {});
  if (!themeNames.length)
    throw new Error("TokenPack.themes must contain at least one theme.");

  const metaIn: any = pack.meta ?? {};

  // defaultTheme: meta > "light" > first theme
  const defaultTheme: ThemeName =
    metaIn.defaultTheme ??
    (themeNames.includes("light") ? "light" : themeNames[0]);

  // var naming defaults
  const varNamingFallback: VarNaming = {
    stripPrefixes: ["tokens", "primitive", "semantic", "custom"],
    rewrite: [],
  };

  const varNaming: VarNaming = {
    stripPrefixes:
      metaIn.varNaming?.stripPrefixes ??
      options?.varNamingDefaults?.stripPrefixes ??
      varNamingFallback.stripPrefixes,
    rewrite:
      metaIn.varNaming?.rewrite ??
      options?.varNamingDefaults?.rewrite ??
      varNamingFallback.rewrite,
  };

  // selectors defaults
  const selectors: Record<string, string> = { ...(metaIn.selectors ?? {}) };
  if (!selectors.light) selectors.light = ":root";
  for (const t of themeNames) {
    if (!selectors[t])
      selectors[t] = t === "light" ? ":root" : `:root[data-theme="${t}"]`;
  }

  const allThemes = new Set(themeNames);

  /**
   * Inheritance sources (both supported):
   * 1) meta.extends: { dark: ["base"], light: ["base"] }
   * 2) per-theme: themes.dark.extends = ["base"]
   */
  const metaExtends: Record<string, string[]> = metaIn.extends ?? {};
  const getParents = (theme: string): string[] => {
    const fromMeta = metaExtends[theme] ?? [];
    const fromTheme = (pack.themes?.[theme]?.extends ?? []) as string[];
    const out: string[] = [];
    for (const p of [...fromMeta, ...fromTheme])
      if (!out.includes(p)) out.push(p);
    return out;
  };

  /**
   * Defaults precedence (lowest -> highest):
   *   defaultTokens (library) -> meta.defaults -> options.defaults (runtime)
   */
  const defaultsTree: TokenTree = deepMerge(
    (defaultTokens as any) ?? {},
    (metaIn.defaults ?? {}) as any,
    (options?.defaults ?? {}) as any,
  );

  // Flattened path maps per theme (after defaults + inheritance)
  const flatPathByTheme: Record<string, Record<string, TokenValue>> = {};

  // Also compute "resolved vars per theme"
  const tokensByTheme: Record<string, Record<string, TokenValue>> = {};
  const cssVarsByTheme: Record<string, Record<`--${string}`, TokenValue>> = {};
  const mergedTreeByTheme: Record<string, TokenTree> = {};

  for (const theme of themeNames) {
    const order = resolveThemeOrder(theme, allThemes, getParents);

    const mergedTokens: TokenTree = deepMerge(
      defaultsTree,
      ...order.map((t) => (pack.themes?.[t]?.tokens ?? {}) as TokenTree),
    );
    mergedTreeByTheme[theme] = mergedTokens;

    const flatPath = flattenToPathMap(mergedTokens);
    flatPathByTheme[theme] = flatPath;

    // resolve {a.b.c} -> var(--a-b-c)
    const resolvedPath: Record<string, TokenValue> = {};
    for (const [pathKey, raw] of Object.entries(flatPath)) {
      if (typeof raw === "string") {
        resolvedPath[pathKey] = resolveRefs(
          raw,
          (p) => `var(${pathToCssVar(p, varNaming)})`,
          flatPath,
        );
      } else {
        resolvedPath[pathKey] = raw;
      }
    }

    const tokenMap: Record<string, TokenValue> = {};
    const cssMap: Record<`--${string}`, TokenValue> = {} as any;
    for (const [pathKey, val] of Object.entries(resolvedPath)) {
      const cssVar = pathToCssVar(pathKey, varNaming);
      const tokenKey = cssVar.slice(2);
      tokenMap[tokenKey] = val;
      cssMap[cssVar] = val;
    }

    tokensByTheme[theme] = tokenMap;
    cssVarsByTheme[theme] = cssMap;
  }

  // -------- internal getters ----------
  function get(theme: ThemeName, path: string): TokenValue | undefined {
    const order = resolveThemeOrder(theme, allThemes, getParents);
    const mergedTokens = deepMerge(
      defaultsTree,
      ...order.map((t) => (pack.themes?.[t]?.tokens ?? {}) as TokenTree),
    ) as TokenTree;

    return getPathValue(mergedTokens as any, path) as any;
  }

  function getResolved(theme: ThemeName, path: string): TokenValue | undefined {
    const flat = flatPathByTheme[theme];
    if (!flat) return undefined;
    const v = flat[path];
    if (v === undefined) return undefined;
    if (typeof v === "string") {
      return resolveRefs(
        v,
        (p) => `var(${pathToCssVar(p, varNaming)})`,
        flat,
      ) as any;
    }
    return v;
  }

  function varName(path: string): `--${string}` {
    return pathToCssVar(path, varNaming);
  }

  function varRef(path: string) {
    return `var(${varName(path)})`;
  }

  // raw grouping helpers (by internal paths)
  function group(theme: ThemeName, path: string) {
    const src = mergedTreeByTheme[theme] ?? {};
    return getPathValue(src as any, path) as any;
  }

  function flatGroup(theme: ThemeName, path: string) {
    const g = group(theme, path);
    if (!g || typeof g !== "object") return {};
    return flattenToPathMap(g as any, "");
  }

  function mergeGroups(themeName: ThemeName, ...paths: string[]) {
    const out: any = {};
    for (const p of paths) {
      const g = group(themeName, p);
      if (g && typeof g === "object") Object.assign(out, g);
    }
    return Object.keys(out).length ? out : undefined;
  }

  function view(themeName: ThemeName): Theme {
    // Use the same public-path resolver that plugin authors use
    const groupPublic = (publicScale: string) => {
      const candidate = resolvePublicPath(publicScale); // e.g. "semantic.spacing||primitive.spacing||primitive.space"
      const internal = pickExistingPath(themeName, candidate);
      return group(themeName, internal);
    };

    return {
      colors: groupPublic("colors"),
      spacing: mergeGroups(themeName, "primitive.spacing", "semantic.spacing"),
      sizes: groupPublic("sizes"),

      fontFamily: groupPublic("fontFamily"), // maps to primitive.font via resolvePublicPath
      fontWeight: groupPublic("fontWeight"),
      lineHeight: groupPublic("lineHeight"),
      letterSpacing: groupPublic("letterSpacing"),
      fontSize: groupPublic("fontSize"),

      borderWidth: groupPublic("borderWidth"),
      radius: groupPublic("radius"),
      opacity: groupPublic("opacity"),
      shadow: groupPublic("shadow"),

      ringWidth: groupPublic("ringWidth"),
      ringColor: groupPublic("ringColor"),
      ringOffsetWidth: groupPublic("ringOffsetWidth"),
      ringOffsetColor: groupPublic("ringOffsetColor"),

      zIndex: groupPublic("zIndex"),
    };
  }

  /**
   * Public DX resolver:
   *  - "colors.primary" => prefers semantic.color.primary else primitive.color.primary
   *  - "colors.red.9"   => primitive.color.red.9
   *  - "spacing.4"      => primitive.space.4
   *  - etc.
   *
   * Returns an internal path (dot-path) which you can feed to varName()/varRef()
   */

  // -------- public DX resolver ----------
  function resolvePublicPath(publicPath: string) {
    const p = publicPath.replace(/^\./, "").trim();
    if (!p) return p;

    const [ns, ...restParts] = p.split(".");
    const rest = restParts.join(".");
    if (!ns) return p;

    // helper: join candidates, pickExistingPath() will choose the first that exists
    const or = (...c: string[]) => c.filter(Boolean).join("||");

    switch (ns) {
      case "colors":
      case "color": {
        // Option A: canonical internal keys are semantic.color + primitive.color (Radix)
        // Back-compat aliases used by older plugins:
        // - colors.background -> colors.bg
        // - colors.textMuted  -> colors.muted
        // - colors.link       -> colors.primary
        const alias: Record<string, string> = {
          background: "bg",
          textMuted: "muted",
          link: "primary",
        };
        const key = rest ? (alias[rest] ?? rest) : "";

        return key
          ? or(`semantic.color.${key}`, `primitive.color.${key}`)
          : or("semantic.color", "primitive.color");
      }

      case "spacing":
      case "space":
        // Prefer semantic spacing scales (xs/sm/md) and fall back to primitive numeric scales
        return rest
          ? or(
              `semantic.spacing.${rest}`,
              `primitive.spacing.${rest}`,
              `primitive.space.${rest}`,
            )
          : or("semantic.spacing", "primitive.spacing", "primitive.space");

      case "radius":
      case "radii":
        return rest
          ? or(
              `semantic.radii.${rest}`,
              `primitive.radius.${rest}`,
              `primitive.radii.${rest}`,
            )
          : or("semantic.radii", "primitive.radius", "primitive.radii");

      case "fontFamily": {
        return rest
          ? or(
              `semantic.fontFamily.${rest}`,
              `semantic.fonts.${rest}`,
              `primitive.fontFamily.${rest}`,
              `primitive.fonts.${rest}`,
              `primitive.font.${rest}`,
            )
          : or(
              "semantic.fontFamily",
              "primitive.fontFamily",
              "primitive.fonts",
              "primitive.font",
            );
      }
      case "fonts":
      case "font":
        // Common alias: fonts.body should map to sans by default
        if (rest === "body") {
          return or(
            "semantic.fonts.body",
            "primitive.font.body",
            "primitive.font.sans",
            "semantic.font.body",
          );
        }
        return rest
          ? or(
              `semantic.fonts.${rest}`,
              `semantic.font.${rest}`,
              `primitive.font.${rest}`,
              `primitive.fonts.${rest}`,
            )
          : or("semantic.fonts", "primitive.font");

      case "fontSizes":
      case "fontSize":
        return rest
          ? or(
              `semantic.fontSizes.${rest}`,
              `semantic.fontSize.${rest}`,
              `primitive.fontSize.${rest}`,
              `primitive.fontSizes.${rest}`,
            )
          : or("semantic.fontSizes", "primitive.fontSize");

      case "fontWeights":
      case "fontWeight":
        return rest
          ? or(
              `semantic.fontWeights.${rest}`,
              `semantic.fontWeight.${rest}`,
              `primitive.fontWeight.${rest}`,
              `primitive.fontWeights.${rest}`,
            )
          : or("semantic.fontWeights", "primitive.fontWeight");

      case "lineHeights":
      case "lineHeight":
        return rest
          ? or(
              `semantic.lineHeights.${rest}`,
              `semantic.lineHeight.${rest}`,
              `primitive.lineHeight.${rest}`,
              `primitive.lineHeights.${rest}`,
            )
          : or("semantic.lineHeights", "primitive.lineHeight");

      case "borders":
      case "border":
        // supports borders.width.sm, borders.color.subtle, etc.
        return rest
          ? or(
              `semantic.borders.${rest}`,
              `semantic.border.${rest}`,
              `primitive.border.${rest}`,
              `primitive.borders.${rest}`,
              `primitive.borderWidth.${rest}`, // extra fallback if your defaults use borderWidth
            )
          : or("semantic.borders", "primitive.border");

      case "shadows":
      case "shadow":
        return rest
          ? or(`primitive.shadow.${rest}`, `semantic.shadow.${rest}`)
          : or("primitive.shadow", "semantic.shadow");

      case "sizes":
      case "size": {
        return rest
          ? or(
              `semantic.sizes.${rest}`,
              `semantic.size.${rest}`,
              `primitive.size.${rest}`,
              `primitive.sizes.${rest}`,
            )
          : or("semantic.sizes", "primitive.size", "primitive.sizes");
      }

      case "motion":
      case "easing":
        return rest
          ? or(`primitive.motion.${rest}`, `semantic.motion.${rest}`)
          : or("primitive.motion", "semantic.motion");

      case "zIndex":
      case "zIndices": {
        return rest
          ? or(
              `semantic.zIndex.${rest}`,
              `semantic.zIndices.${rest}`,
              `primitive.zIndex.${rest}`,
              `primitive.zIndices.${rest}`,
            )
          : or("semantic.zIndex", "primitive.zIndex");
      }

      case "opacity":
      case "opacities": {
        return rest
          ? or(
              `semantic.opacity.${rest}`,
              `semantic.opacities.${rest}`,
              `primitive.opacity.${rest}`,
              `primitive.opacities.${rest}`,
            )
          : or("semantic.opacity", "primitive.opacity");
      }
      case "letterSpacing":
      case "letterSpacings": {
        return rest
          ? or(
              `semantic.letterSpacing.${rest}`,
              `semantic.letterSpacings.${rest}`,
              `primitive.letterSpacing.${rest}`,
              `primitive.letterSpacings.${rest}`,
            )
          : or("semantic.letterSpacing", "primitive.letterSpacing");
      }
      case "borderWidth":
      case "borderWidths": {
        return rest
          ? or(
              `semantic.borderWidth.${rest}`,
              `semantic.borderWidths.${rest}`,
              `primitive.borderWidth.${rest}`,
              `primitive.borderWidths.${rest}`,
            )
          : or("semantic.borderWidth", "primitive.borderWidth");
      }
      case "ringWidth":
      case "ringWidths": {
        return rest
          ? or(
              `semantic.ringWidth.${rest}`,
              `semantic.ringWidths.${rest}`,
              `primitive.ringWidth.${rest}`,
              `primitive.ringWidths.${rest}`,
            )
          : or("semantic.ringWidth", "primitive.ringWidth");
      }

      case "ringColor":
      case "ringColors": {
        return rest
          ? or(
              `semantic.ringColor.${rest}`,
              `semantic.ringColors.${rest}`,
              `primitive.ringColor.${rest}`,
              `primitive.ringColors.${rest}`,
            )
          : or("semantic.ringColor", "primitive.ringColor");
      }

      case "ringOffsetWidth":
      case "ringOffsetWidths": {
        return rest
          ? or(
              `semantic.ringOffsetWidth.${rest}`,
              `semantic.ringOffsetWidths.${rest}`,
              `primitive.ringOffsetWidth.${rest}`,
              `primitive.ringOffsetWidths.${rest}`,
            )
          : or("semantic.ringOffsetWidth", "primitive.ringOffsetWidth");
      }

      case "ringOffsetColor":
      case "ringOffsetColors": {
        return rest
          ? or(
              `semantic.ringOffsetColor.${rest}`,
              `semantic.ringOffsetColors.${rest}`,
              `primitive.ringOffsetColor.${rest}`,
              `primitive.ringOffsetColors.${rest}`,
            )
          : or("semantic.ringOffsetColor", "primitive.ringOffsetColor");
      }

      default:
        // allow internal paths too
        return p;
    }
  }

  function pickExistingPath(theme: string, candidate: string) {
    const candidates = candidate
      .split("||")
      .map((s) => s.trim())
      .filter(Boolean);

    const flat = flatPathByTheme[theme] ?? {};

    // 1) exact leaf match
    for (const c of candidates) {
      if (c in flat) return c;
    }

    // 2) prefix match: if any leaf starts with "candidate."
    // needed because flatPathByTheme stores ONLY leaf paths
    for (const c of candidates) {
      const prefix = c.endsWith(".") ? c : `${c}.`;
      for (const k of Object.keys(flat)) {
        if (k.startsWith(prefix)) return c;
      }
    }

    return candidates[0] ?? candidate;
  }

  function varNamePublic(
    publicPath: string,
    theme: ThemeName = defaultTheme,
  ): `--${string}` {
    const candidate = resolvePublicPath(publicPath);
    const internal = pickExistingPath(theme, candidate);
    return pathToCssVar(internal, varNaming);
  }

  function varRefPublic(publicPath: string, theme: ThemeName = defaultTheme) {
    return `var(${varNamePublic(publicPath, theme)})`;
  }

  /**
   * token(publicPath):
   * Returns a small descriptor that plugin authors/components can use
   * without caring about primitive/semantic/extends/diffs.
   *
   * Example:
   *   theme.token("colors.primary")
   *   -> { publicPath:"colors.primary", path:"semantic.color.primary", var:"--color-primary", ref:"var(--color-primary)" }
   */
  function tokenFn(publicPath: string, themeName: ThemeName = defaultTheme) {
    const candidate = resolvePublicPath(publicPath);
    const internal = pickExistingPath(themeName, candidate);

    const v = pathToCssVar(internal, varNaming);
    return {
      publicPath,
      path: internal,
      var: v as `--${string}`,
      ref: `var(${v})`,
    };
  }

  /**
   * value(publicPath):
   * Returns the resolved token value for a theme.
   * - If the token is a primitive (like a hex), returns the literal.
   * - If the token references another token, returns "var(--...)" (already rewritten).
   *
   * Example:
   *   semantic.color.bg = "{primitive.color.slate.1}"
   *   theme.value("colors.bg") -> "var(--color-slate-1)"
   */
  function valueFn(
    publicPath: string,
    themeName: ThemeName = defaultTheme,
  ): TokenValue | undefined {
    const t = tokenFn(publicPath, themeName);
    return getResolved(themeName, t.path);
  }

  // -------- runtime helpers baked into theme ----------
  // abstract themes: parents in inheritance graph, unless explicitly selectable (selector provided)
  const abstractThemes = (() => {
    const declared = new Set(
      Object.keys((packIn as any)?.meta?.selectors ?? {}),
    );
    const parentSet = new Set<string>();

    const metaE: Record<string, string[]> =
      (packIn as any)?.meta?.extends ?? {};
    for (const parents of Object.values(metaE))
      for (const p of parents ?? []) parentSet.add(p);

    const themesObj: Record<string, any> = (pack as any)?.themes ?? {};
    for (const t of Object.keys(themesObj)) {
      for (const p of themesObj[t]?.extends ?? []) parentSet.add(p);
    }

    const abs = new Set<string>();
    for (const t of themeNames) {
      if (t === defaultTheme) continue;
      if (parentSet.has(t) && !declared.has(t)) abs.add(t);
    }
    return abs;
  })();

  function isAbstractTheme(t: string) {
    return abstractThemes.has(t);
  }

  function runtimeThemes(): ThemeName[] {
    // themes usable at runtime (exclude abstract like "base")
    return themeNames.filter((t) => !isAbstractTheme(t)) as any;
  }

  function selector(t: ThemeName) {
    return (
      selectors[t] ?? (t === "light" ? ":root" : `:root[data-theme="${t}"]`)
    );
  }

  function cssVars(t: ThemeName): CssVarMap {
    return (cssVarsByTheme[t] ?? {}) as any;
  }

  function cssVarsDiff(
    t: ThemeName,
    against: ThemeName = defaultTheme,
  ): CssVarMap {
    return diffVars(cssVars(t), cssVars(against));
  }

  function emitVars(
    b: any,
    t: ThemeName,
    vars: CssVarMap,
    layer: LayerName = "settings",
  ) {
    if (!vars || !Object.keys(vars).length) return;

    const sel = selector(t);
    if (isAtMedia(sel)) {
      const inner = `:root{${Object.entries(vars)
        .map(([k, v]) => `${k}:${v};`)
        .join("")}}`;
      b[layer](`${sel}{${inner}}`);
    } else {
      b[layer](sel, vars);
    }
  }

  function viewNames(): ThemeName[] {
    // runtime-usable views (exclude abstract like "base")
    return runtimeThemes();
  }

  function normalizeScaleKey(input: string): string {
    const s = input.trim();

    const aliases: Record<string, string> = {
      // singular is canonical
      space: "spacing",
      spacings: "spacing",

      fontSizes: "fontSize",
      fontWeights: "fontWeight",
      lineHeights: "lineHeight",
      letterSpacings: "letterSpacing",

      radii: "radius",
      shadows: "shadow",
      opacities: "opacity",
      zIndices: "zIndex",

      borderWidths: "borderWidth",
      ringWidths: "ringWidth",
      ringColors: "ringColor",
      ringOffsetWidths: "ringOffsetWidth",
      ringOffsetColors: "ringOffsetColor",

      // optional convenience
      font: "fontFamily",
      fonts: "fontFamily",
      size: "sizes",
    };

    return aliases[s] ?? s;
  }

  const UNION_SCALES = new Set(["spacing", "zIndex", "sizes"]);
  const NUMERIC_SCALES = new Set(["spacing", "zIndex", "sizes"]);

  /**
   * keys(scale):
   * Union of keys across all runtime themes for a given scale name.
   *
   * - For flat maps (spacing/fontSize/radius...), returns "4", "md", "lg"...
   * - For nested maps (colors), returns dot-keys like "red.9", "slate.1" etc.
   *
   * If you want ONLY top-level keys for nested objects, set opts.flatten=false.
   */
  function keys(
    scale: keyof Theme | string,
    opts?: { flatten?: boolean; includeAbstract?: boolean; sort?: boolean },
  ): string[] {
    const flatten = opts?.flatten ?? true;
    const sort = opts?.sort ?? true;

    const publicScale = normalizeScaleKey(String(scale));
    if (!publicScale) return [];

    if (UNION_SCALES.has(publicScale)) {
      const out = new Set<string>();
      const themes = opts?.includeAbstract ? themeNames : runtimeThemes();
      for (const t of themes) {
        const merged = mergeGroups(
          t as any,
          "primitive.spacing",
          "semantic.spacing",
        );
        if (!merged) continue;
        const flat = flattenToPathMap(merged, "");
        for (const k of Object.keys(flat)) out.add(k);
      }
      return finalizeKeys(out, publicScale, opts?.sort ?? true);
    }

    const themes = opts?.includeAbstract ? themeNames : runtimeThemes();
    const out = new Set<string>();

    for (const t of themes) {
      const candidate = resolvePublicPath(publicScale);
      const internal = pickExistingPath(t, candidate);

      const obj = group(t, internal);
      if (!obj || typeof obj !== "object") continue;

      if (!flatten) {
        for (const k of Object.keys(obj)) out.add(k);
        continue;
      }

      // flatten nested structures (colors -> "amber.1")
      const flat = flattenToPathMap(obj as any, "");
      for (const k of Object.keys(flat)) out.add(k);
    }

    const arr = Array.from(out);
    if (sort)
      arr.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    return arr;
  }

  function finalizeKeys(
    set: Set<string>,
    scale: string,
    sort = true,
  ): string[] {
    const arr = Array.from(set).filter(Boolean);
    if (!sort) return arr;

    const s = (scale ?? "").trim();

    // Special sort for spacing: numeric first in numeric order, then semantic keys alpha
    if (NUMERIC_SCALES.has(scale)) return sortSpacingKeys(arr);

    // Default deterministic sort (handles numeric-ish strings reasonably)
    return arr.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }

  function sortSpacingKeys(keys: string[]): string[] {
    const isNum = (s: string) => /^-?\d+(\.\d+)?$/.test(s);

    const nums = keys
      .filter(isNum)
      .sort((a, b) => parseFloat(a) - parseFloat(b));

    const nonNums = keys
      .filter((k) => !isNum(k))
      .sort((a, b) => a.localeCompare(b));

    return [...nums, ...nonNums];
  }

  /**
   * resolveRef(value):
   * Converts "{a.b.c}" references inside a string into var(--a-b-c).
   * Works for composite strings too: "0 0 0 {primitive.opacity.50}".
   */
  function resolveRefFn(
    value: string,
    themeName: ThemeName = defaultTheme,
  ): string {
    const flat = flatPathByTheme[themeName] ?? {};
    if (typeof value !== "string") return String(value);

    return resolveRefs(
      value,
      (p) => `var(${pathToCssVar(p, varNaming)})`,
      flat,
    );
  }

  /**
   * resolveColor(key):
   * Returns a resolved CSS value for semantic color keys:
   *   theme.resolveColor("accent") => "var(--color-blue-9)" (or similar)
   * Never returns "{...}".
   */
  // function resolveColorFn(
  //   key: string,
  //   themeName: ThemeName = defaultTheme,
  // ): string {
  //   const v = valueFn(`colors.${key}`, themeName);
  //   if (v == null) return String(key);
  //   return typeof v === "string" ? resolveRefFn(v, themeName) : String(v);
  // }
  function resolveColorFn(
    key: string,
    themeName: ThemeName = defaultTheme,
  ): string {
    const raw = String(key ?? "").trim();

    // 1) palette form: "orange-600", "orange.600", "slate-900/50", "cyan.900/30"
    // family: letters, shade: digits, alpha: /digits (0..100)
    const m = raw.match(/^([a-zA-Z]+)[.-]([0-9]+)(?:\/([0-9]+))?$/);
    if (m) {
      const fam = m[1];
      const shade = m[2];
      const alpha = m[3]
        ? Math.max(0, Math.min(100, parseInt(m[3], 10)))
        : null;

      // Always resolve via primitive path
      const primitivePath = `primitive.color.${fam}.${shade}`;
      const base = getResolved(themeName, primitivePath);

      // If missing, fall back to input (but never emit "orange-600" as CSS value)
      const baseCss = base == null ? null : String(base);

      if (!baseCss) return "currentColor";

      // Apply alpha if requested
      if (alpha != null) {
        // Works with both hex and var(...)
        // Example: color-mix(in srgb, var(--color-slate-900) 50%, transparent)
        return `color-mix(in srgb, ${baseCss} ${alpha}%, transparent)`;
      }

      return baseCss;
    }

    // 2) semantic form: "infoSoft", "accent", etc (existing behavior)
    const v = valueFn(`colors.${raw}`, themeName);
    if (v == null) return String(raw);
    return typeof v === "string" ? resolveRefFn(v, themeName) : String(v);
  }

  // Return object + attach helpers
  const loaded: any = {
    meta: {
      name: metaIn.name ?? "theme",
      version: metaIn.version ?? "0.0.0",
      defaultTheme,
      selectors: selectors as any,
      varNaming,
    },
    themeNames,
    raw: packIn,
    tokensByTheme: tokensByTheme as any,
    cssVarsByTheme: cssVarsByTheme as any,

    // core accessors
    get,
    getResolved,
    varName,
    varRef,
    group,
    flatGroup,

    // public DX
    resolvePublicPath,
    varNamePublic,
    varRefPublic,
    view,
    token: tokenFn,
    value: valueFn,
    resolveRef: resolveRefFn,
    resolveColor: resolveColorFn,
    viewNames,
    keys,

    // runtime helpers
    isAbstractTheme,
    runtimeThemes,
    selector,
    cssVars,
    cssVarsDiff,
    emitVars,
  } satisfies LoadedTheme;

  return loaded;
}

/* ---------------- helpers ---------------- */

function isPlainObject(v: any) {
  return v && typeof v === "object" && !Array.isArray(v);
}

function deepMerge<T extends Record<string, any>>(...objs: T[]): T {
  const out: any = {};
  for (const obj of objs) {
    if (!isPlainObject(obj)) continue;
    for (const [k, v] of Object.entries(obj)) {
      if (isPlainObject(v) && isPlainObject(out[k]))
        out[k] = deepMerge(out[k], v);
      else out[k] = v;
    }
  }
  return out;
}

/**
 * Resolve theme order (parents first, theme last), cycle-protected.
 */
function resolveThemeOrder(
  theme: string,
  allThemes: Set<string>,
  getParents: (t: string) => string[],
) {
  const visited = new Set<string>();
  const stack = new Set<string>();
  const order: string[] = [];

  function dfs(t: string) {
    if (visited.has(t)) return;
    if (stack.has(t))
      throw new Error(`Theme inheritance cycle detected at "${t}".`);
    stack.add(t);

    const parents = getParents(t) ?? [];
    for (const p of parents) {
      if (!allThemes.has(p))
        throw new Error(`Theme "${t}" extends unknown theme "${p}".`);
      dfs(p);
    }

    stack.delete(t);
    visited.add(t);
    order.push(t);
  }

  dfs(theme);
  return order;
}

function flattenToPathMap(
  tree: TokenTree,
  prefix = "",
): Record<string, TokenValue> {
  const out: Record<string, TokenValue> = {};
  for (const [k, v] of Object.entries(tree)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(out, flattenToPathMap(v as TokenTree, key));
    } else {
      out[key] = v as TokenValue;
    }
  }
  return out;
}

function resolveRefs(
  value: string,
  refToVar: (path: string) => string,
  flatPath: Record<string, TokenValue>,
): string {
  const re = /\{([a-zA-Z0-9_.-]+)\}/g;
  return value.replace(re, (m, refPath) => {
    if (!(refPath in flatPath)) return m;
    return refToVar(refPath);
  });
}

function pathToCssVar(pathKey: string, naming: VarNaming): `--${string}` {
  let path = pathKey;

  for (const p of naming.stripPrefixes) {
    if (path === p) path = "";
    else if (path.startsWith(p + ".")) path = path.slice(p.length + 1);
  }

  for (const r of naming.rewrite) {
    const re = new RegExp(r.from);
    path = path.replace(re, r.to);
  }

  const chunks = path.split(".").filter(Boolean).map(kebab);
  return `--${chunks.join("-")}` as any;
}

function kebab(s: string) {
  return String(s)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

function getPathValue(obj: any, path: string): any {
  const parts = path.split(".");
  let cur = obj;
  for (const p of parts) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = cur[p];
  }
  return cur;
}
