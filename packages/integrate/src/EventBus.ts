import { Middleware } from "./Middleware";

type Command = { type: string; target?: string; payload?: any };
type Listener = (cmd: Command) => void;

class EventBus {
  private listeners = new Set<Listener>();
  private middlewares: Middleware[] = [];

  use(mw: Middleware) {
    this.middlewares.push(mw);
  }

  send(cmd: Command) {
    const run = (index: number, command: Command) => {
      if (index < this.middlewares.length) {
        this.middlewares[index](command, (nextCmd) =>
          run(index + 1, nextCmd)
        );
      } else {
        for (const l of this.listeners) l(command);
      }
    };
    run(0, cmd);
  }

  subscribe(listener: (cmd: Command) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const bus = new EventBus();
