import type { CssBuilder } from "../core";
import type { Extracted } from "./postcss";

export function applyParsedToBuilder(b: CssBuilder, parsed: Extracted) {
  if (parsed.tokens) b.setTokens(parsed.tokens);
  for (const r of parsed.rules) b.layer(r.layer as any, r.css, r.key);
  return b;
}
