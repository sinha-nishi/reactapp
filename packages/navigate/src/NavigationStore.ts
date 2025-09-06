type Location = {
  path: string;
  query: Record<string, string>;
  hash: string | null;
};

type Listener = (loc: Location) => void;

class NavigationStore {
  private listeners = new Set<Listener>();
  private _location: Location;

  constructor(initial: string = "/") {
    this._location = this.parse(initial);
  }

  private parse(url: string): Location {
    const parsed = new URL(url, "http://dummy");
    return {
      path: parsed.pathname,
      query: Object.fromEntries(parsed.searchParams.entries()),
      hash: parsed.hash ? parsed.hash.slice(1) : null,
    };
  }

  get location() {
    return this._location;
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this._location); // fire immediately
    return () => this.listeners.delete(listener);
  }

  navigate(to: string) {
    this._location = this.parse(to);
    for (const l of this.listeners) l(this._location);
  }
}

export const navigationStore = new NavigationStore("/");

export function attachBrowserAdapter() {
  // Sync from browser → store
  window.addEventListener("popstate", () => {
    navigationStore.navigate(window.location.pathname + window.location.search + window.location.hash);
  });

  // Sync from store → browser
  const unsub = navigationStore.subscribe(loc => {
    const url = loc.path +
      (Object.keys(loc.query).length ? "?" + new URLSearchParams(loc.query).toString() : "") +
      (loc.hash ? "#" + loc.hash : "");
    window.history.pushState({}, "", url);
  });

  return () => {
    window.removeEventListener("popstate", () => {});
    unsub();
  };
}

export function attachMemoryAdapter(start: string = "/") {
  navigationStore.navigate(start);
  return () => {}; // no-op cleanup
}