// effects/matchers.ts
export type Params = Record<string, string>;

export function matchPath(pattern: string, pathname: string): Params | null {
  const pp = pattern.split("/").filter(Boolean);
  const xp = pathname.split("/").filter(Boolean);

  const hasWildcard = pp[pp.length - 1] === "*";
  if (hasWildcard ? xp.length < pp.length - 1 : pp.length !== xp.length) return null;

  const params: Params = {};
  for (let i = 0; i < pp.length; i++) {
    const p = pp[i];
    const v = xp[i];
    if (p === "*") {
      params["*"] = xp.slice(i).join("/");
      return params;
    } else if (p.startsWith(":")) {
      params[p.slice(1)] = v;
    } else if (p !== v) {
      return null;
    }
  }
  return params;
}
