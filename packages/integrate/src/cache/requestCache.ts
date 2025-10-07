// cache/requestCache.ts
type CacheEntry<T> = {
  value?: T;
  expiresAt: number;
  inflight?: {
    controller: AbortController;
    promise: Promise<T>;
  };
};

export class RequestCache {
  private map = new Map<string, CacheEntry<any>>();
  
  constructor(private defaultTtlMs = 30_000) {}

  hasFresh(key: string): boolean {
    const e = this.map.get(key);
    return !!e && e.value !== undefined && e.expiresAt > Date.now();
  }

  get<T>(key: string): T | undefined {
    return this.map.get(key)?.value as T | undefined;
  }

  set<T>(key: string, value: T, ttlMs = this.defaultTtlMs): void {
    this.map.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  getInflight<T>(key: string): Promise<T> | undefined {
    return this.map.get(key)?.inflight?.promise as Promise<T> | undefined;
  }

  abortInflight(key: string): void {
    const e = this.map.get(key);
    if (e?.inflight) {
      e.inflight.controller.abort();
      delete e.inflight;
    }
  }

  fetch<T>(
    key: string,
    doFetch: (signal: AbortSignal) => Promise<T>,
    ttlMs = this.defaultTtlMs
  ): Promise<T> {
    // fresh cache hit
    if (this.hasFresh(key)) return Promise.resolve(this.get<T>(key)!);

    // dedupe inflight
    const inflight = this.getInflight<T>(key);
    if (inflight) return inflight;

    // start new
    const controller = new AbortController();
    const p = (async () => {
      const val = await doFetch(controller.signal);
      this.set<T>(key, val, ttlMs);
      // clear inflight after resolve
      const e = this.map.get(key);
      if (e) delete e.inflight;
      return val;
    })();

    this.map.set(key, {
      value: this.get<T>(key),
      expiresAt: this.map.get(key)?.expiresAt ?? 0,
      inflight: { controller, promise: p },
    });

    return p;
  }
}

export const requestCache = new RequestCache(20_000);
