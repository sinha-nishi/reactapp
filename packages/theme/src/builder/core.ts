export type Tokens = Record<string, string>;
export type LayerName =
  | "settings"
  | "tools"
  | "generic"
  | "elements"
  | "layout"
  | "components"
  | "utilities";

export type BuilderPlugin = (b: CssBuilder) => void;

type Rule = { selector?: string; css: string; layer: LayerName };
interface Options {
  prefix?: string;
  layerOrder?: LayerName[];
}

export class CssBuilder {
  private tokens: Tokens = {};
  private rules: Rule[] = [];
  private usedKeys = new Set<string>();
  private styleEl?: HTMLStyleElement;
  private opts: Required<Options>;

  constructor(options?: Options) {
    this.opts = {
      prefix: options?.prefix ?? "pkv",
      layerOrder: options?.layerOrder ?? [
        "settings",
        "tools",
        "generic",
        "elements",
        "layout",
        "components",
        "utilities",
      ],
    };
  }

  setTokens(t: Tokens) {
    this.tokens = { ...this.tokens, ...t };
    return this;
  }

  layer(layer: LayerName, css: string, key?: string) {
    if (key) {
      if (this.usedKeys.has(key)) return this;
      this.usedKeys.add(key);
    }
    this.rules.push({ layer, css });
    return this;
  }

  rule(layer: LayerName, selector: string, body: string, key?: string) {
    const css = `${selector}{${body}}`;
    return this.layer(layer, css, key);
  }

  use(plugin: BuilderPlugin) {
    plugin(this);
    return this;
  }

  compose(...builders: CssBuilder[]) {
    for (const b of builders) {
      this.setTokens(b.getTokens());
      for (const r of (b as any).rules as Rule[]) this.layer(r.layer, r.css);
    }
    return this;
  }

  getTokens() {
    return { ...this.tokens };
  }

  toString({ minify = true }: { minify?: boolean } = {}) {
    const lf = minify ? "" : "\n";
    const rootVars = Object.entries(this.tokens)
      .map(([k, v]) => `--${this.opts.prefix}-${k}:${v};`)
      .join(minify ? "" : "\n ");
    const root = `:root{${minify ? rootVars : `\n ${rootVars}\n`}}`;

    const byLayer: Record<string, string[]> = {};
    for (const name of this.opts.layerOrder) byLayer[name] = [];
    for (const r of this.rules) byLayer[r.layer].push(r.css);

    const layerDecl = `@layer ${this.opts.prefix}.${this.opts.layerOrder.join(`,${this.opts.prefix}.`)};`;
    const chunks = [layerDecl, root];
    for (const name of this.opts.layerOrder) {
      if (!byLayer[name].length) continue;
      chunks.push(
        `@layer ${this.opts.prefix}.${name}{${byLayer[name].join(lf)}}`,
      );
    }
    return chunks.join(lf);
  }

  inject(doc: Document = document, attrs?: Record<string, string>) {
    const css = this.toString();
    if (this.styleEl) {
      this.styleEl.textContent = css;
      return this.styleEl;
    }
    const el = doc.createElement("style");
    el.setAttribute("data-css-builder", this.opts.prefix);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    el.textContent = css;
    doc.head.prepend(el);
    this.styleEl = el;
    return el;
  }
}
