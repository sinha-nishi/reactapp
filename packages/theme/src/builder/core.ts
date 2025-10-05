import { CSSProperties } from "@/@types/CSSProperties";

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

export type CSSBlock = `${string}{${string}}${string}`;

declare const brandSelector: unique symbol;
declare const brandCssBlock: unique symbol;

export type Selector = string & { [brandSelector]?: true };
export type BrandedCssBlock = string & { [brandCssBlock]?: true };

export type BlockOrSelector = Selector | CSSBlock | BrandedCssBlock;
export type RuleValue = string | CSSProperties;

export function isCSSBlock(s: string): s is CSSBlock | BrandedCssBlock {
  return s.includes("{") && s.includes("}");
}

export function asSelector(s: string): Selector {
  if (isCSSBlock(s)) {
    throw new Error("Expected a selector, received a CSS block.");
  }
  return s as Selector;
}

export function asCSSBlock(s: string): BrandedCssBlock {
  if (!isCSSBlock(s)) {
    throw new Error("Expected a CSS block string like 'h1 { ... }'.");
  }
  return s as BrandedCssBlock;
}

function styleObjToString(style: CSSProperties): string {
  return Object.entries(style)
    .map(([k, v]) => {
      const prop = k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
      return `${prop}:${v};`;
    })
    .join("");
}

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

  private _isBodyBlock(body: string): boolean {
    return body.startsWith("{") && body.endsWith("}");
  }

  rule(layer: LayerName, selector: string, body: string, key?: string) {
    const css = this._isBodyBlock(body) ? `${selector}{${body}}` : body;
    return this.layer(layer, css, key);
  }

  private _handleInput(
    layer: LayerName,
    input: BlockOrSelector,
    valueOrKey?: RuleValue,
    key?: string,
  ) {
    if (!valueOrKey && !key) {
      // 1 input ("h1{}"),
      const cssBlockString = asCSSBlock(input);
      return this.layer(layer, cssBlockString);
    } else if (!key) {
      // input is css block string or key or css props object
      if (typeof valueOrKey === "string") {
        // css block or key
        if (isCSSBlock(input)) {
          // 2 inputs ("h1{}", "some-key-name")
          const cssBlockString = asCSSBlock(input);
          const layerKey = valueOrKey;
          return this.layer(layer, cssBlockString, layerKey);
        } else {
          // input is a selector, value is a css block string
          // 2 inputs ("h1", "fontSize: 2rem;display:flex"), ("h1", "{fontSize: 2rem;display:flex}")
          const selector = asSelector(input);
          const selectorStylingString = valueOrKey;
          return this.rule(layer, selector, selectorStylingString);
        }
      }
      // 2 inputs ("h1", {fontSize: 2rem})
      const selector = asSelector(input);
      const selectorStylingString = styleObjToString(valueOrKey!);
      return this.rule(layer, selector, selectorStylingString);
    } else {
      // 3 inputs ("h1", "fontSize: 2rem", "key"), ("h1", "{fontSize: 2rem}", "key")
      if (typeof valueOrKey === "string") {
        const selector = asSelector(input);
        const selectorStylingString = valueOrKey;
        return this.rule(layer, selector, selectorStylingString, key);
      }
      // 3 inputs ("h1", {fontSize: 2rem}, "key")
      const selector = asSelector(input);
      const selectorBlock = styleObjToString(valueOrKey!);
      return this.rule(layer, selector, selectorBlock, key);
    }
  }

  settings(input: BlockOrSelector, valueOrKey?: RuleValue, key?: string) {
    return this._handleInput("settings", input, valueOrKey, key);
  }

  tools(input: BlockOrSelector, valueOrKey?: RuleValue, key?: string) {
    // tools("h1", {fontSize: 2rem}: object, key) = 3
    // tools("h1", "fontSize: 2rem": string, key?) = 3

    // tools("h1", {fontSize: 2rem}: object) = 2
    // tools("h1", "fontSize: 2rem": string) = 2
    // tools("h1{}", key: string) = 2

    // tools("h1{}") = 1

    return this._handleInput("tools", input, valueOrKey, key);
  }

  generic(input: BlockOrSelector, valueOrKey?: RuleValue, key?: string) {
    return this._handleInput("generic", input, valueOrKey, key);
  }

  elements(input: BlockOrSelector, valueOrKey?: RuleValue, key?: string) {
    return this._handleInput("elements", input, valueOrKey, key);
  }

  objects(input: BlockOrSelector, valueOrKey?: RuleValue, key?: string) {
    return this._handleInput("layout", input, valueOrKey, key);
  }

  components(input: BlockOrSelector, valueOrKey?: RuleValue, key?: string) {
    return this._handleInput("components", input, valueOrKey, key);
  }

  utilities(input: BlockOrSelector, valueOrKey?: RuleValue, key?: string) {
    return this._handleInput("utilities", input, valueOrKey, key);
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

  toString({
    minify = true,
    legacy = false,
  }: { minify?: boolean; legacy?: boolean } = {}) {
    const lf = minify ? "" : "\n";
    const rootVars = Object.entries(this.tokens)
      .map(([k, v]) => `--${this.opts.prefix}-${k}:${v};`)
      .join(minify ? "" : "\n ");
    const root = `:root{${minify ? rootVars : `\n ${rootVars}\n`}}`;

    const byLayer: Record<string, string[]> = {};
    for (const name of this.opts.layerOrder) byLayer[name] = [];
    for (const r of this.rules) byLayer[r.layer].push(r.css);

    if (legacy) {
      // Flatten in ITCSS order, no @layer
      const chunks = [root];
      for (const name of this.opts.layerOrder) {
        if (!byLayer[name].length) continue;
        const header = minify ? "" : `/* ${name} */\n`;
        chunks.push(header + byLayer[name].join(lf));
      }
      return chunks.join(lf);
    }

    // Modern build with cascade layers
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
