
// import { navigationStore } from "../navigation/navigationStore";
import { Command, CommandType } from "../types";
import { bus } from "../EventBus";

export type EffectCtx = {
  send: (cmd: Command) => Promise<void>;
  delay: (ms: number) => Promise<void>;
  aborted: () => boolean;
//   getLocation: () => typeof navigationStore.location;
  signal: AbortSignal;
};

type Task = {
  controller: AbortController;
  promise: Promise<void>;
};

type Handler = (cmd: Command, ctx: EffectCtx) => Promise<void> | void;

class Effects {
  private subs: Array<() => void> = [];
  private every = new Map<CommandType, Handler[]>();
  private latest = new Map<CommandType, Map<string, Handler[]>>();
  private debouncers = new Map<string, ReturnType<typeof setTimeout>>();
  private throttles = new Map<string, number>();
  private runningLatest = new Map<string, Task>(); // key => task

  start() {
    // Single subscription point; effects see commands AFTER middleware ran
    const unsub = bus.subscribe((cmd) => this.dispatch(cmd));
    this.subs.push(unsub);
  }

  stop() {
    this.subs.forEach((u) => u());
    this.subs = [];
    // cancel latest tasks
    for (const [, task] of this.runningLatest) task.controller.abort();
    this.runningLatest.clear();
    // clear timers
    for (const [, t] of this.debouncers) clearTimeout(t);
    this.debouncers.clear();
  }

  // takeEvery
  onEvery(type: CommandType, handler: Handler) {
    const arr = this.every.get(type) ?? [];
    arr.push(handler);
    this.every.set(type, arr);
  }

  // takeLatest (optionally keyed by something in the command)
  onLatest(type: CommandType, handler: Handler, keyFn?: (cmd: Command) => string) {
    const bucket = this.latest.get(type) ?? new Map<string, Handler[]>();
    const key = keyFn ? keyFn({ type } as Command) ?? "_" : "_";
    const arr = bucket.get(key) ?? [];
    arr.push((cmd, ctx) => {
      // when keyFn is provided, recompute per-cmd
      (handler as Handler)(cmd, ctx);
    });
    bucket.set(key, arr);
    this.latest.set(type, bucket);
  }

  // debounce per key
  onDebounce(
    type: CommandType,
    handler: Handler,
    wait: number,
    keyFn: (cmd: Command) => string = () => "_"
  ) {
    this.onEvery(type, (cmd, ctx) => {
      const key = `${type}:${keyFn(cmd)}`;
      const prev = this.debouncers.get(key);
      if (prev) clearTimeout(prev);
      const t = setTimeout(() => handler(cmd, ctx), wait);
      this.debouncers.set(key, t);
    });
  }

  // throttle per key
  onThrottle(
    type: CommandType,
    handler: Handler,
    wait: number,
    keyFn: (cmd: Command) => string = () => "_"
  ) {
    this.onEvery(type, (cmd, ctx) => {
      const key = `${type}:${keyFn(cmd)}`;
      const now = Date.now();
      const last = this.throttles.get(key) ?? 0;
      if (now - last >= wait) {
        this.throttles.set(key, now);
        handler(cmd, ctx);
      }
    });
  }

  // internal fan-out
  private dispatch(cmd: Command) {
    // takeEvery
    const ev = this.every.get(cmd.type);
    if (ev?.length) ev.forEach((h) => this.spawn(h, cmd));

    // takeLatest
    const bucket = this.latest.get(cmd.type);
    if (bucket && bucket.size) {
      const key = [...bucket.keys()].length === 1 ? "_" : this.computeKey(bucket, cmd);
      const handlers = bucket.get(key);
      if (handlers?.length) {
        this.cancelLatest(cmd.type, key);
        const task = this.spawnMany(handlers, cmd);
        this.runningLatest.set(this.latestKey(cmd.type, key), task);
      }
    }
  }

  private computeKey(bucket: Map<string, Handler[]>, cmd: Command): string {
    // We stored "_" at registration time; allow dynamic keying by reading meta.key if present
    return (cmd.meta?.key as string) || "_";
  }

  private latestKey(type: CommandType, key: string) {
    return `${type}::${key}`;
  }

  private cancelLatest(type: CommandType, key: string) {
    const k = this.latestKey(type, key);
    const prev = this.runningLatest.get(k);
    if (prev) {
      prev.controller.abort();
      this.runningLatest.delete(k);
    }
  }

  private spawn(handler: Handler, cmd: Command): Task {
    const controller = new AbortController();
    const ctx: EffectCtx = {
      send: (c) => bus.send(c),
      delay: (ms) =>
        new Promise<void>((res, rej) => {
          const t = setTimeout(() => res(), ms);
          controller.signal.addEventListener("abort", () => {
            clearTimeout(t);
            rej(new DOMException("Aborted", "AbortError"));
          });
        }),
      aborted: () => controller.signal.aborted,
    //   getLocation: () => navigationStore.location,
      signal: controller.signal,
    };

    const promise = Promise.resolve(handler(cmd, ctx)).catch((e) => {
      if (controller.signal.aborted) return; // swallow aborts
      // eslint-disable-next-line no-console
      console.error("[effect error]", e);
    });

    return { controller, promise };
  }

  private spawnMany(handlers: Handler[], cmd: Command): Task {
    const controller = new AbortController();
    const ctx: EffectCtx = {
      send: (c) => bus.send(c),
      delay: (ms) =>
        new Promise<void>((res, rej) => {
          const t = setTimeout(() => res(), ms);
          controller.signal.addEventListener("abort", () => {
            clearTimeout(t);
            rej(new DOMException("Aborted", "AbortError"));
          });
        }),
      aborted: () => controller.signal.aborted,
    //   getLocation: () => navigationStore.location,
      signal: controller.signal,
    };

    const promise = Promise.all(
      handlers.map((h) => Promise.resolve(h(cmd, ctx)))
    ).catch((e) => {
      if (controller.signal.aborted) return;
      console.error("[effect error]", e);
    });

    return { controller, promise: promise.then(() => {}) };
  }
}

export const effects = new Effects();
