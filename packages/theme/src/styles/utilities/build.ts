import { CSSObject, MatchResult } from "../../@types";
import type { UtilityEngine, UtilityContext } from "./types";

type Theme = Record<string, any>;
type Options = { enableArbitraryValues: boolean; prefix: string };

export function buildUtilities(theme: Theme, opts: Options): UtilityEngine {
  return {
    match(className: string): MatchResult | false {
      return false;
    },

    render(m: any, meta, ctx: UtilityContext): CSSObject[] {
      // each rule apply() yields CSSObject(s) with {selector, decls, media?}
      const out = m.rule.apply(m, meta, ctx);
      return Array.isArray(out) ? out : [out];
    },
  };
}
