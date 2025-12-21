import type { CSSObject, MatchResult, Theme, RuleContext, RuleEngine } from "../../../@types";

type Options = { enableArbitraryValues: boolean; prefix: string };

const re = {
  // prefixes/flags: !important, negative, variants
  important: /^!/,
  negative: /^-/,
  variantToken: /^[a-z-]+:/, // hover:, md:, group-hover:, data-open:, etc.
  arbitrary: /^\[(.+)\]$/, // [12.5rem] or [var(--x)]
};

function styleFromScale(
  m: any,
  prop: string | string[],
  scale: Record<string, string>,
  ctx: RuleContext,
  meta: any,
): CSSObject {
  let val = scale[m.key];

  // handle negative modifiers (e.g., -mt-4)
  if (meta.negative && typeof val === "string" && /^-?\d/.test(val)) {
    val = val.startsWith("-") ? val.slice(1) : `-${val}`;
  }

  // fallback to arbitrary values if key not found (defensive)
  if (val === undefined && m.key) {
    val = m.key;
  }

  // apply !important and selector wrapping via finalize()
  return finalize(
    Array.isArray(prop)
      ? Object.fromEntries(prop.map((p) => [p, val]))
      : { [prop]: val },
    ctx,
    meta,
  );
}

export function tailwindRules(theme: Theme, opts: Options): RuleEngine {
  const rules: Array<UtilityRule> = [];

  // helpers
  const propScale = (
    prefix: string,
    prop: string | string[],
    scale: Record<string, string> | undefined,
  ) => {
    rules.push({
      name: `${prefix}-<key>`,
      match: (cls) => withKey(cls, prefix, scale),
      apply: (m, meta, ctx) => styleFromScale(m, prop, scale!, ctx, meta),
    });
  };

  const propArbitrary = (prefix: string, prop: string | string[]) => {
    rules.push({
      name: `${prefix}-[value]`,
      match: (cls) => withArbitrary(cls, prefix),
      apply: (m, meta, ctx) => style(prop, m.body, ctx, meta),
    });
  };

  const propRaw = (
    prefix: string,
    prop: string | string[],
    valueMap: Record<string, string>,
  ) => {
    rules.push({
      name: `${prefix} raw`,
      match: (cls) => withKey(cls, prefix, valueMap),
      apply: (m, meta, ctx) => style(prop, valueMap[m.key], ctx, meta),
    });
  };

  // spacing
  propScale("p", ["padding"], theme.spacing);
  propScale("px", ["padding-left", "padding-right"], theme.spacing);
  propScale("py", ["padding-top", "padding-bottom"], theme.spacing);
  propScale("pt", "padding-top", theme.spacing);
  propScale("pr", "padding-right", theme.spacing);
  propScale("pb", "padding-bottom", theme.spacing);
  propScale("pl", "padding-left", theme.spacing);
  propScale("m", ["margin"], theme.spacing);
  propScale("mx", ["margin-left", "margin-right"], theme.spacing);
  propScale("my", ["margin-top", "margin-bottom"], theme.spacing);
  propScale("mt", "margin-top", theme.spacing);
  propScale("mr", "margin-right", theme.spacing);
  propScale("mb", "margin-bottom", theme.spacing);
  propScale("ml", "margin-left", theme.spacing);

  // sizing
  propScale("w", "width", { ...theme.spacing, ...theme.sizes });
  propScale("h", "height", { ...theme.spacing, ...theme.sizes });
  propScale("min-w", "min-width", { ...theme.spacing, ...theme.sizes });
  propScale("min-h", "min-height", { ...theme.spacing, ...theme.sizes });
  propScale("max-w", "max-width", { ...theme.spacing, ...theme.sizes });
  propScale("max-h", "max-height", { ...theme.spacing, ...theme.sizes });
  propArbitrary("w", "width");
  propArbitrary("h", "height");

  // display & layout
  propRaw("block", "display", { "": "block" });
  propRaw("inline-block", "display", { "": "inline-block" });
  propRaw("inline", "display", { "": "inline" });
  propRaw("flex", "display", { "": "flex" });
  propRaw("inline-flex", "display", { "": "inline-flex" });
  propRaw("grid", "display", { "": "grid" });
  propRaw("hidden", "display", { "": "none" });

  // flex/grid
  propRaw("flex-row", "flex-direction", { "": "row" });
  propRaw("flex-col", "flex-direction", { "": "column" });
  propRaw("items-start", "align-items", { "": "flex-start" });
  propRaw("items-center", "align-items", { "": "center" });
  propRaw("items-end", "align-items", { "": "flex-end" });
  propRaw("justify-start", "justify-content", { "": "flex-start" });
  propRaw("justify-center", "justify-content", { "": "center" });
  propRaw("justify-between", "justify-content", { "": "space-between" });
  propRaw("justify-end", "justify-content", { "": "flex-end" });

  // gap
  propScale("gap", "gap", theme.spacing);
  propScale("gap-x", "column-gap", theme.spacing);
  propScale("gap-y", "row-gap", theme.spacing);

  // container
  rules.push({
    name: "container",
    match: (cls) => (cls === "container" ? { raw: cls } : false),
    apply: (m, meta, ctx) => {
      const base = finalize({ width: "100%" }, ctx, meta);
      const out = [base];
      for (const [, min] of Object.entries(ctx.screens)) {
        out.push({
          selector: base.selector,
          decls: { "max-width": min as string },
          media: `@media (min-width: ${min as string})`,
        });
      }
      return out;
    },
  });

  // grid template helpers (common)
  rules.push({
    name: "grid-cols-<n>",
    match: (cls) => withInt(cls, "grid-cols-"),
    apply: (m, meta, ctx) =>
      style(
        "grid-template-columns",
        `repeat(${m.num}, minmax(0, 1fr))`,
        ctx,
        meta,
      ),
  });
  rules.push({
    name: "col-span-<n>",
    match: (cls) => withInt(cls, "col-span-"),
    apply: (m, meta, ctx) =>
      style("grid-column", `span ${m.num} / span ${m.num}`, ctx, meta),
  });

  // typography
  rules.push({
    name: "text-<size|color>",
    match: (cls) => {
      if (cls.startsWith("text-")) {
        const body = cls.slice(5);
        if (theme.fontSize[body])
          return { kind: "fontSize", key: body, raw: cls };
        return { kind: "color", key: body, raw: cls, alpha: undefined };
      }
      return false;
    },
    apply: (m: any, meta, ctx) => {
      if (m.kind === "fontSize") {
        const val = theme.fontSize[m.key];
        const [fs, more] = Array.isArray(val) ? val : [val, {}];
        return styleMany({ "font-size": fs, ...(more || {}) }, ctx, meta);
      }
      // color
      const color = ctx.resolveColor(m.key);
      return style("color", color, ctx, meta);
    },
  });

  propRaw("font-thin", "font-weight", { "": theme.fontWeight.thin });
  propRaw("font-extralight", "font-weight", {
    "": theme.fontWeight.extralight,
  });
  propRaw("font-light", "font-weight", { "": theme.fontWeight.light });
  propRaw("font-normal", "font-weight", { "": theme.fontWeight.normal });
  propRaw("font-medium", "font-weight", { "": theme.fontWeight.medium });
  propRaw("font-semibold", "font-weight", { "": theme.fontWeight.semibold });
  propRaw("font-bold", "font-weight", { "": theme.fontWeight.bold });
  propRaw("font-extrabold", "font-weight", { "": theme.fontWeight.extrabold });
  propRaw("font-black", "font-weight", { "": theme.fontWeight.black });

  propScale("leading", "line-height", theme.lineHeight);
  propScale("tracking", "letter-spacing", theme.letterSpacing);
  propRaw("text-left", "text-align", { "": "left" });
  propRaw("text-center", "text-align", { "": "center" });
  propRaw("text-right", "text-align", { "": "right" });
  propRaw("text-justify", "text-align", { "": "justify" });

  // colors (bg, border)
  rules.push(colorRule("bg", "background-color", theme));
  rules.push(colorRule("border", "border-color", theme));

  // border width & radius
  propScale("border", "border-width", theme.borderWidth);
  propScale("border-t", "border-top-width", theme.borderWidth);
  propScale("border-r", "border-right-width", theme.borderWidth);
  propScale("border-b", "border-bottom-width", theme.borderWidth);
  propScale("border-l", "border-left-width", theme.borderWidth);
  propScale("rounded", "border-radius", theme.radius);
  propScale(
    "rounded-t",
    ["border-top-left-radius", "border-top-right-radius"],
    theme.radius,
  );
  propScale(
    "rounded-b",
    ["border-bottom-left-radius", "border-bottom-right-radius"],
    theme.radius,
  );
  propScale(
    "rounded-l",
    ["border-top-left-radius", "border-bottom-left-radius"],
    theme.radius,
  );
  propScale(
    "rounded-r",
    ["border-top-right-radius", "border-bottom-right-radius"],
    theme.radius,
  );

  // effects
  rules.push({
    name: "opacity-<n>",
    match: (cls) => withKey(cls, "opacity-", theme.opacity),
    apply: (m, meta, ctx) => style("opacity", theme.opacity[m.key], ctx, meta),
  });
  rules.push({
    name: "shadow-<k>",
    match: (cls) => withKey(cls, "shadow-", theme.shadow),
    apply: (m, meta, ctx) =>
      style("box-shadow", theme.shadow[m.key], ctx, meta),
  });
  rules.push({
    name: "shadow",
    match: (cls) => (cls === "shadow" ? { raw: cls } : false),
    apply: (m, meta, ctx) =>
      style("box-shadow", theme.shadow.DEFAULT, ctx, meta),
  });

  // ring
  const ringShadow = (
    w: string,
    color: string,
    offsetW: string,
    offsetColor: string,
  ) =>
    `${offsetW} 0 0 0 ${offsetColor}, 0 0 0 calc(${w} + ${offsetW}) ${color}`;

  rules.push({
    name: "ring",
    match: (cls) => (cls === "ring" ? { raw: cls } : false),
    apply: (m, meta, ctx) => {
      const w = theme.ringWidth?.DEFAULT ?? "3px";
      const c = ctx.resolveColor("blue-500");
      const ow = theme.ringOffsetWidth?.["0"] ?? "0px";
      const oc = "transparent";
      return style("box-shadow", ringShadow(w, c, ow, oc), ctx, meta);
    },
  });

  // Filter composition (base + blur-md)
  const FILTER_COMPOSE =
    "var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)";

  rules.push({
    name: "filter",
    match: (cls) =>
      cls === "filter"
        ? { raw: cls }
        : cls === "filter-none"
          ? { raw: cls, none: true }
          : false,
    apply: (m, meta, ctx) =>
      finalize(
        m.none
          ? { filter: "none" }
          : {
              "--tw-blur": " ",
              "--tw-brightness": " ",
              "--tw-contrast": " ",
              "--tw-grayscale": " ",
              "--tw-hue-rotate": " ",
              "--tw-invert": " ",
              "--tw-saturate": " ",
              "--tw-sepia": " ",
              "--tw-drop-shadow": " ",
              "--tw-filter": FILTER_COMPOSE,
              filter: "var(--tw-filter)",
            },
        ctx,
        meta,
      ),
  });

  function applyFilterVar(
    meta: any,
    ctx: RuleContext,
    vars: Record<string, string>,
  ) {
    return finalize(
      { ...vars, "--tw-filter": FILTER_COMPOSE, filter: "var(--tw-filter)" },
      ctx,
      meta,
    );
  }

  const blurMap = {
    "0": "blur(0)",
    sm: "blur(4px)",
    "": "blur(8px)",
    md: "blur(12px)",
    lg: "blur(16px)",
  };
  rules.push({
    name: "blur-<k>",
    match: (cls) =>
      cls.startsWith("blur")
        ? { raw: cls, key: cls === "blur" ? "" : cls.slice(5) }
        : false,
    apply: (m: { raw: string; key: keyof typeof blurMap }, meta, ctx) =>
      applyFilterVar(meta, ctx, { "--tw-blur": blurMap[m.key] ?? "blur(8px)" }),
  });

  // position & inset
  propRaw("static", "position", { "": "static" });
  propRaw("fixed", "position", { "": "fixed" });
  propRaw("absolute", "position", { "": "absolute" });
  propRaw("relative", "position", { "": "relative" });
  propRaw("sticky", "position", { "": "sticky" });

  const insetScale = { ...theme.spacing, auto: "auto", 1_2: "50%" };
  ["inset", "top", "right", "bottom", "left"].forEach((side) => {
    propScale(
      side as any,
      side === "inset" ? ["inset"] : side,
      insetScale as any,
    );
    propArbitrary(side as any, side === "inset" ? ["inset"] : side);
  });

  // z-index
  rules.push({
    name: "z-<k>",
    match: (cls) => withKey(cls, "z-", theme.zIndex),
    apply: (m, meta, ctx) => style("z-index", theme.zIndex[m.key], ctx, meta),
  });

  // transforms (basic)
  rules.push(simpleTransform("translate-x", "translateX", theme.spacing));
  rules.push(simpleTransform("translate-y", "translateY", theme.spacing));
  rules.push(
    simpleTransform("scale", "scale", {
      0: "0",
      50: "0.5",
      75: "0.75",
      90: "0.9",
      95: "0.95",
      100: "1",
      105: "1.05",
      110: "1.1",
    }),
  );
  rules.push(
    simpleTransform("rotate", "rotate", {
      0: "0deg",
      45: "45deg",
      90: "90deg",
      180: "180deg",
    }),
  );

  // overflow, object-fit, cursor, select, whitespace
  propRaw("overflow-hidden", "overflow", { "": "hidden" });
  propRaw("overflow-auto", "overflow", { "": "auto" });
  propRaw("object-cover", "object-fit", { "": "cover" });
  propRaw("object-contain", "object-fit", { "": "contain" });
  propRaw("cursor-pointer", "cursor", { "": "pointer" });
  propRaw("select-none", "user-select", { "": "none" });
  propRaw("whitespace-nowrap", "white-space", { "": "nowrap" });
  propRaw("break-words", "overflow-wrap", { "": "break-word" });

  // arbitrary property support: [mask-type:luminance]
  rules.push({
    name: "[prop:value]",
    match: (cls) => {
      if (!opts.enableArbitraryValues) return false;
      if (!cls.startsWith("[") || !cls.endsWith("]")) return false;
      const content = cls.slice(1, -1);
      const colon = content.indexOf(":");
      if (colon < 1) return false;
      const prop = content.slice(0, colon).trim();
      const val = content.slice(colon + 1).trim();
      return { raw: cls, arbitraryProp: prop, body: val };
    },
    apply: (m: any, meta, ctx) => style(m.arbitraryProp, m.body, ctx, meta),
  });

  return {
    match(className: string): MatchResult | false {
      const cls = stripPrefix(className, opts.prefix);
      // gather variant tokens (md:hover:...) => ["md","hover"]
      const tokens: string[] = [];
      let base = cls;
      while (re.variantToken.test(base)) {
        const t = base.slice(0, base.indexOf(":"));
        tokens.push(t);
        base = base.slice(base.indexOf(":") + 1);
      }
      const important = re.important.test(base);
      if (important) base = base.slice(1);
      const negative = re.negative.test(base);
      if (negative) base = base.slice(1);

      for (const rule of rules) {
        const m = rule.match(base);
        if (m) {
          (m as any).rule = rule;
          return { ...m, tokens, important, negative, raw: className };
        }
      }
      return false;
    },

    render(m: any, meta, ctx: RuleContext): CSSObject[] {
      // each rule apply() yields CSSObject(s) with {selector, decls, media?}
      const out = m.rule.apply(m, meta, ctx);
      return Array.isArray(out) ? out : [out];
    },

    enumerate: (ctx, o) => [],
  };
}

// ---------- Utility building blocks ----------
interface UtilityRule {
  name: string;
  match: (cls: string) => any | false;
  apply: (m: any, meta: any, ctx: RuleContext) => CSSObject | CSSObject[];
}

function stripPrefix(cls: string, prefix: string) {
  return prefix && cls.startsWith(prefix) ? cls.slice(prefix.length) : cls;
}

function withKey(cls: string, prefix: string, scale?: Record<string, any>) {
  if (!cls.startsWith(prefix)) return false;
  const key = cls.slice(prefix.length);
  if (key in (scale ?? {})) return { key, body: key, rule: null }; // rule injected later
  // support colors like red-500/50 => leave key as-is; caller handles resolve
  if (prefix === "bg-" || prefix === "text-" || prefix === "border-") {
    return { key, body: key, rule: null };
  }
  return false;
}

function withArbitrary(cls: string, prefix: string) {
  if (!cls.startsWith(prefix)) return false;
  const body = cls.slice(prefix.length);
  const m = body.match(re.arbitrary);
  if (!m) return false;
  return { body: m[1], rule: null };
}

function withInt(cls: string, prefix: string) {
  if (!cls.startsWith(prefix)) return false;
  const body = cls.slice(prefix.length);
  const num = parseInt(body, 10);
  if (Number.isNaN(num)) return false;
  return { num, rule: null };
}

function style(
  prop: string | string[],
  value: string,
  ctx: RuleContext,
  meta: any,
): CSSObject {
  const decls = Array.isArray(prop)
    ? Object.fromEntries(prop.map((p) => [p, value]))
    : { [prop]: value };
  return finalize(decls, ctx, meta);
}
function styleMany(
  obj: Record<string, string>,
  ctx: RuleContext,
  meta: any,
): CSSObject {
  return finalize(obj, ctx, meta);
}
function finalize(
  decls: Record<string, string>,
  ctx: RuleContext,
  meta: any,
): CSSObject {
  // handle important override + negative value
  const negative = meta.negative;
  const important = meta.important || ctx.important === true;
  const importantSuffix = important ? " !important" : "";

  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(decls)) {
    let val = v;
    if (negative && /^-?\d/.test(val)) {
      val = val.startsWith("-") ? val.slice(1) : `-${val}`;
    }
    out[k] = `${val}${importantSuffix}`;
  }

  let selector = `.${escapeClass(meta.raw ?? "")}`;
  // if ctx.important is a selector (e.g., "#app"), nest it
  if (typeof ctx.important === "string")
    selector = `${ctx.important} ${selector}`;
  return { selector, decls: out };
}

function colorRule(
  base: "bg" | "border",
  cssProp: string,
  theme: any,
): UtilityRule {
  return {
    name: `${base}-<color>`,
    match: (cls) => withKey(cls, `${base}-`, theme.colors),
    apply: (m, meta, ctx) => {
      const color = ctx.resolveColor(m.key);
      return style(cssProp, color, ctx, meta);
    },
  };
}

function simpleTransform(
  prefix: string,
  fn: "translateX" | "translateY" | "scale" | "rotate",
  scale: Record<string, string>,
): UtilityRule {
  return {
    name: `${prefix}-<k>`,
    match: (cls) => withKey(cls, `${prefix}-`, scale),
    apply: (m, meta, ctx) => {
      const val = scale[m.key];
      const t =
        fn === "translateX"
          ? `translateX(${val})`
          : fn === "translateY"
            ? `translateY(${val})`
            : fn === "scale"
              ? `scale(${val})`
              : `rotate(${val})`;
      return style("transform", t, ctx, meta);
    },
  };
}

// escape classes like md:hover:bg-red-500 to a valid CSS selector
function escapeClass(cls: string) {
  return cls
    .replace(/([^a-zA-Z0-9_-])/g, "\\$1")
    .replace(/\\:|\\\//g, (m) => m);
}

// hook up rule reference on match results so engine can call apply()
function attachRule(r: UtilityRule, m: any) {
  if (m) m.rule = r;
  return m;
}
