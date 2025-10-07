
export class SimpleConfig {
  brand: string;
  theme: string;
  view: string | React.ReactNode;
  contextPath: string;

  constructor(brand: string, theme: string, view: string, contextPath: string) {
    this.brand = brand;
    this.theme = theme;
    this.view = view;
    this.contextPath = contextPath;
  }
}