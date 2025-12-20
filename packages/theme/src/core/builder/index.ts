import { BuilderContext, ScreenOptions, Theme } from "../../@types";
import { CSSProperties } from "../../@types/CSSProperties";
import { Tokens } from "../../@types/styleOptions";
import { packs } from "../../tokens";
import { hexToRgb } from "../../utils/colors";
export type LayerName =
  | "settings"
  | "tools"
  | "generic"
  | "elements"
  | "layout"
  | "components"
  | "utilities";

export type SideEffectPlugin<B extends CssBuilder> = (b: B) => void;
export type TransformPlugin<
  In extends CssBuilder,
  Out extends CssBuilder = In,
> = (b: In) => Out;

// Optional: unify both for convenience at call sites
export type BuilderPlugin<
  In extends CssBuilder = CssBuilder,
  Out extends CssBuilder = In,
> = ((b: In) => void) | ((b: In) => Out);

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
  classPrefix?: string;
  classPrefixLayers?: LayerName[];
  theme?: Theme;
  screens?: ScreenOptions;
  important?: boolean;
  layerOrder?: LayerName[];
}

export class CssBuilder {
  readonly ctx: BuilderContext;
  private tokens: Tokens = {};
  private rules: Rule[] = [];
  private usedKeys = new Set<string>();
  private styleEl?: HTMLStyleElement;
  private opts: Required<Options>;
  private _beforeSerialize: Array<() => void> = [];

  constructor(options?: Options) {
    // const theme = { ...defaultScales, ...(options?.theme ?? {}) };
    const theme = packs.radix;
    const screens = options?.screens ?? {
      xs: "360px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    };
    this.ctx = {
      theme,
      screens,
      important: options?.important ?? false,
      resolveColor(nameOrHex: string, alpha?: string) {
        // accepts palette key "red-500" or hex/rgb; supports "/<alpha>" notation
        const [base, a] = (
          alpha ? [nameOrHex, alpha] : nameOrHex.split("/")
        ) as [string, string?];
        const hex =
          (theme.view("light").colors as Record<string, string>)[base] ?? base;
        if (!a) return hex;
        // convert hex to rgba with alpha percentage (00..100 or 0..1)
        const alphaVal = a.includes("%")
          ? parseFloat(a) / 100
          : parseFloat(a) > 1
            ? parseFloat(a) / 100
            : parseFloat(a);
        const { r, g, b } = hexToRgb(hex);
        return `rgba(${r}, ${g}, ${b}, ${Number.isFinite(alphaVal) ? alphaVal : 1})`;
      },
    };

    this.opts = {
      theme,
      screens,
      important: options?.important ?? false,
      prefix: options?.prefix ?? "",
      classPrefix: options?.classPrefix ?? "",
      classPrefixLayers:
        options?.classPrefixLayers ??
        (["layout", "components", "utilities"] as LayerName[]),
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

  onBeforeSerialize(fn: () => void) {
    this._beforeSerialize.push(fn);
    return this;
  }

  setTokens(t?: Tokens) {
    if (!t) return this;
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
    const css = this._isBodyBlock(body) ? body : `${selector}{${body}}`;
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

  apply<P extends (b: this) => any>(
    plugin: P,
  ): ReturnType<P> extends void ? this : ReturnType<P> {
    const out = plugin(this);
    return (out ?? this) as any;
  }

  // new tap: side-effect only (or ignore any return)
  use(plugin: (b: this) => any): this {
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

  private prefixClasses(css: string) {
    const pref = this.opts.classPrefix;
    if (!pref) return css;

    // only apply to selected layers
    // (we check layer outside before calling)
    const escaped = pref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Prefix .class but do not double-prefix if already prefixed.
    // Works for .stack, .grid--2, .media__body etc.
    return css.replace(
      new RegExp(`(^|[\\s>+~,(])\\.(?!${escaped})([A-Za-z_][\\w-]*)`, "g"),
      `$1.${pref}$2`,
    );
  }

  toString({
    minify = true,
    legacy = false,
  }: { minify?: boolean; legacy?: boolean } = {}) {
    // NEW: let plugins finalize work (e.g. inject compat CSS) just-in-time
    for (const fn of this._beforeSerialize)
      try {
        fn();
      } catch {}

    const lf = minify ? "" : "\n";
    const rootVars = Object.entries(this.tokens)
      .map(
        ([k, v]) =>
          `--${this.opts.prefix ? `${this.opts.prefix}-` : ""}${k}:${v};`,
      )
      .join(minify ? "" : "\n ");
    const root = `:root{${minify ? rootVars : `\n ${rootVars}\n`}}`;
    this.settings(root);

    const byLayer: Record<string, string[]> = {};
    for (const name of this.opts.layerOrder) byLayer[name] = [];
    for (const r of this.rules) {
      const shouldPrefix =
        !!this.opts.classPrefix &&
        (this.opts.classPrefixLayers?.includes(r.layer) ?? false);

      byLayer[r.layer].push(shouldPrefix ? this.prefixClasses(r.css) : r.css);
    }

    if (legacy) {
      // Flatten in ITCSS order, no @layer
      const chunks = [
        /*root*/
      ];
      for (const name of this.opts.layerOrder) {
        if (!byLayer[name].length) continue;
        const header = minify ? "" : `/* ${name} */\n`;
        chunks.push(header + byLayer[name].join(lf));
      }
      return chunks.join(lf);
    }

    // Modern build with cascade layers
    const layerDecl = `@layer ${this.opts.prefix ? `${this.opts.prefix}.` : ""}${this.opts.layerOrder.join(`,${this.opts.prefix ? `${this.opts.prefix}.` : ""}`)};`;
    const chunks = [layerDecl /*root*/];
    for (const name of this.opts.layerOrder) {
      if (!byLayer[name].length) continue;
      chunks.push(
        `@layer ${this.opts.prefix ? `${this.opts.prefix}.` : ""}${name}{${byLayer[name].join(lf)}}`,
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
    el.setAttribute("data-css-builder", this.opts.prefix || "theme-builder");
    if (attrs) Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    el.textContent = css;
    doc.head.prepend(el);
    this.styleEl = el;
    return el;
  }
}
