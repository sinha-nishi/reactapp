import type { LoadedTheme, ThemeName } from "./@types";
import { createThemeView } from "./tokens/createThemeView";

type Listener = (theme: ThemeName) => void;

export class ThemeProvider {
  private theme: LoadedTheme;
  private current: ThemeName;
  private listeners = new Set<Listener>();

  constructor(theme: LoadedTheme, initial?: ThemeName) {
    this.theme = theme;
    this.current = initial ?? theme.meta.defaultTheme;
  }

  getThemeName() {
    return this.current;
  }

  setThemeName(name: ThemeName) {
    if (!this.theme.themeNames.includes(name)) {
      throw new Error(
        `Unknown theme "${name}". Known: ${this.theme.themeNames.join(", ")}`,
      );
    }
    if (this.current === name) return;
    this.current = name;
    for (const l of this.listeners) l(this.current);
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  applyToDocument(doc: Document = document, attr: string = "data-theme") {
    doc.documentElement.setAttribute(attr, this.current);
  }

  get(path: string) {
    return this.theme.get(this.current, path);
  }

  getResolved(path: string) {
    return this.theme.getResolved(this.current, path);
  }

  varName(path: string) {
    return this.theme.varName(path);
  }

  varRef(path: string) {
    return this.theme.varRef(path);
  }

  computed(path: string, doc: Document = document) {
    const name = this.varName(path);
    return getComputedStyle(doc.documentElement).getPropertyValue(name).trim();
  }

  /** expose the loaded theme if needed */
  getLoadedTheme() {
    return this.theme;
  }

  /**
   * usage: 
   * 
   * ```
   * const view = themeProvider.getThemeView();
   * view.vars.colors.primary      // Proxy -> stringify gives var(--color-primary)
   * view.val.colors.primary       // computed actual value
   * view.varsFn("colors.primary") // direct
   * ```
   * @param doc 
   * @returns 
   */
  getThemeView(doc: Document = document) {
    const loaded = this.getLoadedTheme();
    return createThemeView({
      loaded,
      getThemeName: () => this.getThemeName(),
      computed: (publicPath) => this.computedPublic(publicPath, doc),
    });
  }

  computedPublic(publicPath: string, doc: Document = document) {
    const name = this.theme.varNamePublic(publicPath);
    return getComputedStyle(doc.documentElement).getPropertyValue(name).trim();
  }
}
