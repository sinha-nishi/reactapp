import { RuleRegistry } from "../../core/runtime/RuleRegistry";
import { CSSObject, MatchResult, Theme } from "../../@types";
import type { RuleContext, RuleEngine } from "./types";
import { register as registerSpacing } from "./spacing";
import { register as registerTypography } from "./typography";
import { register as registerColors } from "./colors";
import { stripPrefix, style } from "./helper";

type Options = { enableArbitraryValues: boolean; prefix: string };

const re = {
  important: /^!/,
  negative: /^-/,
  variantToken: /^[a-z-]+:/,
  arbitrary: /^\[(.+)\]$/,
};

export function buildUtilities(theme: Theme, opts: Options): RuleEngine {
  const reg = new RuleRegistry();

  // ---- family registrations
  registerSpacing(reg, theme);
  registerTypography(reg, theme);
  registerColors(reg, theme);
  // ---- end family registrations

  // Arbitrary property [prop:value]
  if (opts.enableArbitraryValues) {
    reg.addPatternRule({
      match: (cls) => {
        if (!cls.startsWith("[") || !cls.endsWith("]")) return false;
        const content = cls.slice(1, -1);
        const i = content.indexOf(":");
        if (i < 1) return false;
        return {
          arbitraryProp: content.slice(0, i).trim(),
          body: content.slice(i + 1).trim(),
          raw: cls,
        };
      },
      apply: (m, meta, ctx) => style(m.arbitraryProp, m.body, ctx, meta),
    });
  }

  reg.finalize();

  // small match cache to avoid recomputation on repeated classes
  const cache = new Map<string, MatchResult | false>();

  return {
    match(className: string): MatchResult | false {
      const hit = cache.get(className);
      if (hit !== undefined) return hit;

      const cls = stripPrefix(className, opts.prefix);
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

      // 1) exact
      const r1 = reg.exact.get(base);
      if (r1) {
        const m = r1.match(base);
        if (m) {
          (m as any).rule = r1;
          const res = { ...m, tokens, important, negative, raw: className };
          cache.set(className, res);
          return res;
        }
      }
      // 2) prefix (longest first)
      for (const { key, rule } of reg.prefixes) {
        if (!base.startsWith(key)) continue;
        const m = rule.match(base);
        if (m) {
          (m as any).rule = rule;
          const res = { ...m, tokens, important, negative, raw: className };
          cache.set(className, res);
          return res;
        }
      }
      // 3) pattern
      for (const rule of reg.patterns) {
        const m = rule.match(base);
        if (m) {
          (m as any).rule = rule;
          const res = { ...m, tokens, important, negative, raw: className };
          cache.set(className, res);
          return res;
        }
      }
      cache.set(className, false);
      return false;
    },

    render(m: any, meta, ctx: RuleContext): CSSObject[] {
      if (!m || !m.rule || typeof m.rule.apply !== "function") return [];
      const out = m.rule.apply(m, meta, ctx);
      return Array.isArray(out) ? out : [out];
    },

    enumerate: (ctx, o) => reg.enumerateAll(ctx, { families: o?.families }),
  };
}
