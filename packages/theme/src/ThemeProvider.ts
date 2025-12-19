import type { LoadedTheme, ThemeName } from "./@types";

export class ThemeProvider {
  private theme: LoadedTheme;
  private current: ThemeName;

  constructor(theme: LoadedTheme, initial?: ThemeName) {
    this.theme = theme;
    this.current = initial ?? theme.meta.defaultTheme;
  }

  getThemeName() {
    return this.current;
  }

  setThemeName(name: ThemeName) {
    if (!this.theme.themeNames.includes(name)) {
      throw new Error(`Unknown theme "${name}". Known: ${this.theme.themeNames.join(", ")}`);
    }
    this.current = name;
  }

  /** Apply theme to DOM via data-theme (works with our default selectors) */
  applyToDocument(doc: Document = document, attr: string = "data-theme") {
    doc.documentElement.setAttribute(attr, this.current);
  }

  /** Read token from pack (raw) */
  get(path: string) {
    return this.theme.get(this.current, path);
  }

  /** Read resolved token (references -> var(--...)) */
  getResolved(path: string) {
    return this.theme.getResolved(this.current, path);
  }

  /** CSS variable name for a token path */
  varName(path: string) {
    return this.theme.varName(path);
  }

  /** CSS var reference "var(--...)" */
  varRef(path: string) {
    return this.theme.varRef(path);
  }

  /** Read the *computed* CSS value from DOM (runtime actual value) */
  computed(path: string, doc: Document = document) {
    const name = this.varName(path);
    const styles = getComputedStyle(doc.documentElement);
    return styles.getPropertyValue(name).trim();
  }
}
