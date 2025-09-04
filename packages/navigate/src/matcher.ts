type Params = Record<string, string>;
type Query = Record<string, string>;

export interface RouteMatch {
  Component: React.ComponentType<any>;
  params: Params;
  query: Query;
  hash: string | null;
}

export function matchRoute(
  url: string,
  routes: Record<string, React.ComponentType<any>>
): RouteMatch | null {
  const parsed = new URL(url, "https://prashantsinha.com"); // dummy base for relative paths
  const pathname = parsed.pathname;
  const query = Object.fromEntries(parsed.searchParams.entries());
  const hash = parsed.hash ? parsed.hash.slice(1) : null;

  for (const [pattern, Component] of Object.entries(routes)) {
    const params = matchPattern(pattern, pathname);
    if (params) {
      return { Component, params, query, hash };
    }
  }

  return null;
}

function matchPattern(pattern: string, pathname: string): Params | null {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);

  // Wildcard handling
  if (patternParts[patternParts.length - 1] === "*") {
    if (pathParts.length < patternParts.length - 1) return null;
  } else if (patternParts.length !== pathParts.length) {
    return null;
  }

  const params: Params = {};

  for (let i = 0; i < patternParts.length; i++) {
    const p = patternParts[i];
    const v = pathParts[i];

    if (p === "*") {
      params["*"] = pathParts.slice(i).join("/");
      return params;
    } else if (p.startsWith(":")) {
      params[p.slice(1)] = v;
    } else if (p !== v) {
      return null;
    }
  }

  return params;
}
