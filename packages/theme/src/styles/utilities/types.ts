import { CSSObject, MatchResult, UtilityContext } from "../../@types";

export type UtilityRule = {
  kind: "exact" | "prefix" | "pattern";
  family?: string; // e.g. "spacing", "color", "typography", etc.
  key?: string; // exact key or prefix
  match: (body: string) => any | false;
  apply: (m: any, meta: any, ctx: UtilityContext) => CSSObject | CSSObject[];
  enumerate?: (ctx: UtilityContext) => string[];
};



export interface UtilityEngine {
  match: (className: string) => MatchResult | false;
  render: (match: MatchResult, meta: any, ctx: UtilityContext) => CSSObject[];
  enumerate: (ctx: UtilityContext, opts?: { families?: string[] }) => string[];
}