import {
  LoadedTheme,
  ThemeName,
  TokenPack,
  TokenTree,
  TokenValue,
} from "@/@types";

export function loadTheme(pack: TokenPack): LoadedTheme {
  const themeNames = Object.keys(pack.themes ?? {});
  if (!themeNames.length)
    throw new Error("TokenPack.themes must contain at least one theme.");

  const metaIn = pack.meta ?? {};
  const defaultTheme =
    metaIn.defaultTheme ??
    (themeNames.includes("light") ? "light" : themeNames[0]);

  const varNaming = {
    stripPrefixes: metaIn.varNaming?.stripPrefixes ?? [
      "tokens",
      "primitive",
      "semantic",
      "custom",
    ],
    rewrite: metaIn.varNaming?.rewrite ?? [],
  };

  // selectors defaults
  const selectors: Record<string, string> = { ...(metaIn.selectors ?? {}) };
  if (!selectors.light) selectors.light = ":root";
  for (const t of themeNames) {
    if (!selectors[t])
      selectors[t] = t === "light" ? ":root" : `:root[data-theme="${t}"]`;
  }

  const tokensByTheme: Record<string, Record<string, TokenValue>> = {};
  const cssVarsByTheme: Record<string, Record<`--${string}`, TokenValue>> = {};

  // build per-theme flatten+resolve maps
  const flatPathByTheme: Record<string, Record<string, TokenValue>> = {};

  for (const theme of themeNames) {
    const tree = pack.themes[theme]?.tokens ?? {};
    const flatPath = flattenToPathMap(tree);
    flatPathByTheme[theme] = flatPath;
  }

  for (const theme of themeNames) {
    const flatPath = flatPathByTheme[theme];

    // resolve refs using same-theme map
    const resolvedPath: Record<string, TokenValue> = {};
    for (const [pathKey, raw] of Object.entries(flatPath)) {
      if (typeof raw === "string")
        resolvedPath[pathKey] = resolveRefs(
          raw,
          (p) => varRefFromPath(p, varNaming),
          flatPath,
        );
      else resolvedPath[pathKey] = raw;
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

  function get(theme: ThemeName, path: string): TokenValue | undefined {
    const t = pack.themes[theme];
    if (!t) return undefined;
    return getPathValue(t.tokens as any, path) as any;
  }

  function getResolved(theme: ThemeName, path: string): TokenValue | undefined {
    // resolve from flattened map if possible
    const flat = flatPathByTheme[theme];
    if (!flat) return undefined;
    const v = flat[path];
    if (v === undefined) return undefined;
    if (typeof v === "string")
      return resolveRefs(v, (p) => varRefFromPath(p, varNaming), flat);
    return v;
  }

  function varName(path: string): `--${string}` {
    return pathToCssVar(path, varNaming);
  }

  function varRef(path: string) {
    return `var(${varName(path)})`;
  }

  // usage: const colors = theme.group("light", "primitive.color");     // nested
  // usage: const spacing = theme.group("light", "primitive.space");
  function group(theme: ThemeName, path: string) {
    const src = pack.themes[theme];
    if (!src) return undefined;
    return getPathValue(src.tokens as any, path) as any;
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

  function resolvePublicPath(publicPath: string) {
    const p = publicPath.replace(/^\./, "").trim();
    if (!p) return p;

    // Split once: "colors.primary" => ["colors", "primary"]
    const [ns, ...restParts] = p.split(".");
    const rest = restParts.join(".");
    if (!ns) return p;

    // Namespaces that devs expect
    switch (ns) {
      case "colors":
      case "color": {
        // Prefer semantic.color.<rest> if it exists, else primitive.color.<rest>
        // Allow nested semantics like colors.surface.primary -> semantic.color.surface.primary
        // Allow palette like colors.red.9 -> primitive.color.red.9
        return rest
          ? `semantic.color.${rest}||primitive.color.${rest}`
          : `semantic.color||primitive.color`;
      }

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

      // fallback: if someone uses internal paths directly, allow it
      default:
        return p;
    }
  }

  function pickExistingPath(
    theme: string,
    candidate: string,
    flatPathByTheme: Record<string, Record<string, any>>,
  ) {
    const candidates = candidate.split("||").map((s) => s.trim());
    const flat = flatPathByTheme[theme] ?? {};
    for (const c of candidates) if (c in flat) return c;
    return candidates[0]; // fallback
  }

  function varNamePublic(publicPath: string): `--${string}` {
    const candidate = resolvePublicPath(publicPath);
    const internal = pickExistingPath(
      defaultTheme,
      candidate,
      flatPathByTheme,
    );
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
    raw: pack,
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

// function varRefFromPath(
//   path: string,
//   naming: LoadedTheme["meta"]["varNaming"],
// ) {
//   const defaultNaming = {
//     stripPrefixes: [] as string[],
//     rewrite: [] as Array<{ from: string; to: string }>,
//   };
//   return `var(${pathToCssVar(path, naming ?? defaultNaming)})`;
// }

type VarNaming = {
  stripPrefixes: string[];
  rewrite: Array<{ from: string; to: string }>;
};

function varRefFromPath(path: string, naming: VarNaming) {
  return `var(${pathToCssVar(path, naming)})`;
}

/**
 * Convert any nested path into a css var name deterministically.
 * Default strategy:
 * - strip common prefixes (tokens/primitive/semantic/custom)
 * - join remaining by "-"
 * - camelCase -> kebab-case
 * - apply rewrite regex rules
 *
 * Example:
 *  "primitive.color.slate.1" -> "--color-slate-1"   (if rewrite ^color\. -> color- etc)
 *  "semantic.color.primaryHover" -> "--color-primary-hover"
 *  "space.2" -> "--space-2"
 */
function pathToCssVar(
  pathKey: string,
  naming: {
    stripPrefixes: string[];
    rewrite: Array<{ from: string; to: string }>;
  },
): `--${string}` {
  let path = pathKey;

  // normalize prefix stripping
  for (const p of naming.stripPrefixes) {
    if (path === p) path = "";
    else if (path.startsWith(p + ".")) path = path.slice(p.length + 1);
  }

  // apply rewrite rules on dot-path (before join)
  for (const r of naming.rewrite) {
    const re = new RegExp(r.from);
    path = path.replace(re, r.to);
  }

  // split remaining by "." then kebab each chunk
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
