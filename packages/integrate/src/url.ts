import { LocationState } from "./types";

export function parseUrl(input: string): LocationState {
  const u = new URL(input, "http://dummy");
  return {
    path: u.pathname,
    query: Object.fromEntries(u.searchParams.entries()),
    hash: u.hash ? u.hash.slice(1) : null,
  };
}

export function formatUrl(loc: LocationState): string {
  const qs = new URLSearchParams(loc.query).toString();
  return loc.path + (qs ? `?${qs}` : "") + (loc.hash ? `#${loc.hash}` : "");
}
