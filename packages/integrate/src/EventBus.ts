import { Middleware, Command, CommandType, Listener } from "./types";


class EventBus {
  private globalWares: Middleware[] = [];
  private targetWares = new Map<CommandType, Middleware[]>();
  private listeners = new Set<Listener>();
  

  use(mw: Middleware) {
    this.globalWares.push(mw);
  }

  useFor(type: CommandType, mw: Middleware) {
    const arr = this.targetWares.get(type) ?? [];
    arr.push(mw);
    this.targetWares.set(type, arr);
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async send(cmd: Command) {
    const chain = [
      ...this.globalWares,
      ...(this.targetWares.get(cmd.type) ?? []),
      // terminal: notify listeners
      async (_cmd: Command, _next: (c: Command) => Promise<void>) => {
        for (const l of this.listeners) l(cmd);
      },
    ];

    const run = (i: number, c: Command): Promise<void> =>
      Promise.resolve(
        chain[i](c, (nextCmd) => run(i + 1, nextCmd))
      );

    await run(0, cmd);
  }
}

export type { EventBus };

export const bus = new EventBus();
