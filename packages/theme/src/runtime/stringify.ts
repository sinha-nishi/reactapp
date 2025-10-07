import type { CSSObject } from "../@types";

export function stringify(rules: CSSObject[]): string {
  const byMedia = new Map<string, CSSObject[]>();
  for (const r of rules) {
    const key = r.media ?? "";
    if (!byMedia.has(key)) byMedia.set(key, []);
    byMedia.get(key)!.push(r);
  }

  let out = "";
  for (const [media, list] of byMedia.entries()) {
    const body = list.map((r) => `${r.selector}{${toDecls(r.decls)}}`).join("");
    out += media ? `${media}{${body}}` : body;
  }
  return out;
}
function toDecls(obj: Record<string, string>) {
  return Object.entries(obj)
    .map(([k, v]) => `${k}:${v};`)
    .join("");
}
