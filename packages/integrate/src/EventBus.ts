type Command = { type: string; target?: string; payload?: any };
type Listener = (cmd: Command) => void;

class EventBus {
  private listeners = new Set<Listener>();

  send(cmd: Command) {
    for (const l of this.listeners) l(cmd);
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const bus = new EventBus();
