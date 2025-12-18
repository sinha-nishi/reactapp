type Theme = Record<string, any>;

/**
 * Returns semantic color keys you want to allow as AOT.
 * Example return: ["primary", "secondary", "surface", "surface-primary", "danger", ...]
 *
 * You can adapt this to your token structure (recommended).
 */
export function getSemanticColorKeys(theme: Theme): string[] {
  // Option A: you store semantic colors explicitly
  const semantic = theme?.semanticColors;
  if (semantic && typeof semantic === "object") return Object.keys(semantic);

  // Option B: you store tokens under theme.tokens.colors
  const t = theme?.tokens?.colors;
  if (t && typeof t === "object") return Object.keys(t);

  // fallback: allow NONE by default (safe)
  return [];
}

/**
 * Map a semantic key to a Tailwind-like color key your resolveColor understands.
 * e.g. "primary" -> "primary"
 * If your resolveColor handles semantic keys directly, this can be identity.
 */
export function semanticToColorKey(k: string) {
  return k;
}
