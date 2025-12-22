import { CSSObject, LoadedTheme, RuleContext } from "../../@types";
import { RuleRegistry } from "@/core/runtime/RuleRegistry";

export function stripPrefix(cls: string, prefix: string) {
  return prefix && cls.startsWith(prefix) ? cls.slice(prefix.length) : cls;
}

export function withKey(
  cls: string,
  prefix: string,
  scale?: Record<string, any>,
) {
  if (!cls.startsWith(prefix)) return false;
  const key = cls.slice(prefix.length);
  if (key in (scale ?? {})) return { key, body: key, raw: cls };
  return false;
}

export function withColorKey(cls: string, prefix: string) {
  if (!cls.startsWith(prefix)) return false;
  const key = cls.slice(prefix.length);
  return { key, raw: cls };
}

export function style(
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

export function styleMany(
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
  const important = meta.important || ctx.important === true;
  const importantSuffix = important ? " !important" : "";

  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(decls)) out[k] = `${v}${importantSuffix}`;

  let selector = `.${escapeClass(meta.raw ?? "")}`;
  if (typeof ctx.important === "string")
    selector = `${ctx.important} ${selector}`;
  return { selector, decls: out };
}

function escapeClass(cls: string) {
  return cls.replace(/([^a-zA-Z0-9_-])/g, "\\$1");
}

export function util(reg: RuleRegistry, theme: LoadedTheme) {
  const scaleMap = (scaleName: string): Record<string, string> => {
    const keys = theme.keys(scaleName);
    const out: Record<string, string> = {};
    for (const k of keys) out[k] = String(theme.value(`${scaleName}.${k}`));
    return out;
  };

  const S = scaleMap("spacing");

  const propScale = (prefix: string, prop: string | string[]) =>
    reg.addPrefixRule(prefix, {
      family: "spacing",
      match: (cls) => withKey(cls, prefix, S),
      apply: (m, meta, ctx) => styleFromScale(m, prop, S, ctx, meta),
      enumerate: () => Object.keys(S).map((k) => `${prefix}${k}`),
    });

  function addExactDecl(
    reg: RuleRegistry,
    name: string,
    prop: string,
    value: string,
  ) {
    reg.addExactRule(name, {
      match: (cls) => (cls === name ? { raw: cls } : false),
      apply: (m, meta, ctx) => style(prop, value, ctx, meta),
      enumerate: () => [name],
    });
  }

  function styleFromScale(
    m: any,
    prop: string | string[],
    scale: Record<string, string>,
    ctx: RuleContext,
    meta: any,
  ): CSSObject {
    const val = scale[m.key] ?? m.key;
    return finalize(
      Array.isArray(prop)
        ? Object.fromEntries((prop as string[]).map((p) => [p, val]))
        : { [prop as string]: val },
      ctx,
      meta,
    );
  }

  return { propScale, addExactDecl, scaleMap };
}
