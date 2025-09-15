type ComponentURL = string; // e.g. "urn:components:sheet:tnc-sheet"
type RegisteredComponent = React.ComponentType<any>;

class ComponentRegistry {
  private registry = new Map<ComponentURL, RegisteredComponent>();

  register(urn: ComponentURL, comp: RegisteredComponent) {
    this.registry.set(urn, comp);
  }

  get(urn: ComponentURL) {
    return this.registry.get(urn);
  }

  list() {
    return Array.from(this.registry.keys());
  }
}

export const componentRegistry = new ComponentRegistry();
