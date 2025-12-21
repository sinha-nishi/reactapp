import { CSSObject, MatchResult, BuilderContext } from "../../@types";

export type Rule = {
  kind: "exact" | "prefix" | "pattern";
  family?: string; // e.g. "spacing", "color", "typography", etc.
  key?: string; // exact key or prefix
  match: (body: string) => any | false;
  apply: (m: any, meta: any, ctx: BuilderContext) => CSSObject | CSSObject[];
  enumerate?: (ctx: BuilderContext) => string[];
};

export interface RuleEngine {
  match: (className: string) => MatchResult | false;
  render: (match: MatchResult, meta: any, ctx: BuilderContext) => CSSObject[];
  enumerate: (ctx: BuilderContext, opts?: { families?: string[] }) => string[];
}
