import { bus } from "./EventBus";
import { componentRegistry } from "./Registry";

export function useCommand() {
  return {
    send: bus.send.bind(bus),
    subscribe: bus.subscribe.bind(bus),
  };
}

export function useComponent(urn: string) {
  return componentRegistry.get(urn);
}
