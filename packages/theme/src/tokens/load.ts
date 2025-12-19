import {
  LoadedTheme,
  ThemeName,
  TokenPack,
  TokenTree,
  TokenValue,
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

export function loadTheme(
  packIn: TokenPack,
  options?: LoadThemeOptions,
): LoadedTheme {
  const pack = packIn as unknown as TokenPackLike;

  const themeNames = Object.keys(pack.themes ?? {});
  if (!themeNames.length) {
    throw new Error("TokenPack.themes must contain at least one theme.");
  }

  const metaIn: any = pack.meta ?? {};

  // defaultTheme: meta > "light" > first theme
  const defaultTheme: ThemeName =
    metaIn.defaultTheme ??
    (themeNames.includes("light") ? "light" : themeNames[0]);

  // var naming defaults (fallback -> meta -> options)
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
    if (!selectors[t]) {
      selectors[t] = t === "light" ? ":root" : `:root[data-theme="${t}"]`;
    }
  }

  const allThemes = new Set(themeNames);

  /**
   * Inheritance can be specified in either place:
   * 1) meta.extends: { dark: ["base"], light: ["base"] }
   * 2) per-theme: themes.dark.extends = ["base"]
   * Both are supported; we merge them.
   */
  const metaExtends: Record<string, string[]> = metaIn.extends ?? {};

  const getParents = (theme: string): string[] => {
    const fromMeta = metaExtends[theme] ?? [];
    const fromTheme = (pack.themes?.[theme]?.extends ?? []) as string[];
    // merge unique, stable order: meta first then theme-level
    const out: string[] = [];
    for (const p of [...fromMeta, ...fromTheme]) {
      if (!out.includes(p)) out.push(p);
    }
    return out;
  };

  /**
   * Defaults precedence (lowest -> highest):
   *   defaultTokens (library) -> meta.defaults -> options.defaults (load args)
   */
  const defaultsTree: TokenTree = deepMerge(
    defaultTokens as any,
    (metaIn.defaults ?? {}) as any,
    (options?.defaults ?? {}) as any,
  );

  // Flattened path maps per theme (after inheritance+defaults)
  const flatPathByTheme: Record<string, Record<string, TokenValue>> = {};

  for (const theme of themeNames) {
    const order = resolveThemeOrder(theme, allThemes, getParents);

    const mergedTokens: TokenTree = deepMerge(
      defaultsTree,
      ...order.map((t) => (pack.themes?.[t]?.tokens ?? {}) as TokenTree),
    );

    flatPathByTheme[theme] = flattenToPathMap(mergedTokens);
  }

  // Final outputs
  const tokensByTheme: Record<string, Record<string, TokenValue>> = {};
  const cssVarsByTheme: Record<string, Record<`--${string}`, TokenValue>> = {};

  for (const theme of themeNames) {
    const flatPath = flatPathByTheme[theme];

    // resolve {a.b.c} -> var(--a-b-c) (with naming rules)
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
      const tokenKey = cssVar.slice(2); // "--x-y" -> "x-y"
      tokenMap[tokenKey] = val;
      cssMap[cssVar] = val;
    }

    tokensByTheme[theme] = tokenMap;
    cssVarsByTheme[theme] = cssMap;
  }

  // Internal getters (raw + resolved)
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
    const src = pack.themes?.[theme];
    if (!src) return undefined;
    return getPathValue((src.tokens ?? {}) as any, path) as any;
  }

  function flatGroup(theme: ThemeName, path: string) {
    const g = group(theme, path);
    if (!g || typeof g !== "object") return {};
    return flattenToPathMap(g as any, "");
  }

  function view(themeName: ThemeName) {
    return {
      colors: group(themeName, "primitive.color"),
      spacing: group(themeName, "primitive.space"),
      radius: group(themeName, "primitive.radius"),
      semantic: group(themeName, "semantic"),
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
  function resolvePublicPath(publicPath: string) {
    const p = publicPath.replace(/^\./, "").trim();
    if (!p) return p;

    const [ns, ...restParts] = p.split(".");
    const rest = restParts.join(".");
    if (!ns) return p;

    switch (ns) {
      case "colors":
      case "color":
        return rest
          ? `semantic.color.${rest}||primitive.color.${rest}`
          : `semantic.color||primitive.color`;

      case "spacing":
      case "space":
        return rest ? `primitive.space.${rest}` : `primitive.space`;

      case "radius":
      case "radii":
        return rest ? `primitive.radius.${rest}` : `primitive.radius`;

      case "fonts":
      case "font":
        return rest ? `primitive.font.${rest}` : `primitive.font`;

      case "shadows":
      case "shadow":
        return rest ? `primitive.shadow.${rest}` : `primitive.shadow`;

      case "motion":
      case "easing":
        return rest ? `primitive.motion.${rest}` : `primitive.motion`;

      case "z":
      case "zIndex":
        return rest ? `primitive.z.${rest}` : `primitive.z`;

      default:
        // allow internal paths directly
        return p;
    }
  }

  function pickExistingPath(
    theme: string,
    candidate: string,
    flatMap: Record<string, Record<string, any>>,
  ) {
    const candidates = candidate.split("||").map((s) => s.trim());
    const flat = flatMap[theme] ?? {};
    for (const c of candidates) if (c in flat) return c;
    return candidates[0]; // fallback
  }

  function varNamePublic(publicPath: string): `--${string}` {
    const candidate = resolvePublicPath(publicPath);
    const internal = pickExistingPath(defaultTheme, candidate, flatPathByTheme);
    return pathToCssVar(internal, varNaming);
  }

  function varRefPublic(publicPath: string) {
    return `var(${varNamePublic(publicPath)})`;
  }

  return {
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
    get,
    getResolved,
    varName,
    varRef,
    group,
    flatGroup,
    resolvePublicPath,
    varNamePublic,
    varRefPublic,
    view,
  };
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
 * Resolves theme inheritance order:
 * returns array with parents first, then the theme itself.
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
      if (!allThemes.has(p)) {
        throw new Error(`Theme "${t}" extends unknown theme "${p}".`);
      }
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
    if (!(refPath in flatPath)) return m; // leave unresolved
    return refToVar(refPath);
  });
}

function pathToCssVar(pathKey: string, naming: VarNaming): `--${string}` {
  let path = pathKey;

  // strip prefixes
  for (const p of naming.stripPrefixes) {
    if (path === p) path = "";
    else if (path.startsWith(p + ".")) path = path.slice(p.length + 1);
  }

  // rewrite on dot-path
  for (const r of naming.rewrite) {
    const re = new RegExp(r.from);
    path = path.replace(re, r.to);
  }

  const chunks = path.split(".").filter(Boolean).map(kebab);
  const name = chunks.join("-");

  return `--${name}` as any;
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
