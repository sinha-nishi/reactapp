import { CSSObject } from "../@types";

export function mergeRules(rules: CSSObject[]): CSSObject[] {
  // simple merge by selector + media
  const map = new Map<string, Record<string, string>>();
  const keyOf = (r: CSSObject) => `${r.media ?? ""}|${r.selector}`;
  for (const r of rules) {
    const k = keyOf(r);
    if (!map.has(k)) map.set(k, {});
    Object.assign(map.get(k)!, r.decls);
  }
  const out: CSSObject[] = [];
  for (const [k, decls] of map.entries()) {
    const [media, selector] = k.split("|");
    out.push({ media: media || undefined, selector, decls });
  }
  return out;
}
