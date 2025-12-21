import { CSSObject, MatchResult } from "../../@types";

export type Rule = {
  kind: "exact" | "prefix" | "pattern";
  family?: string; // e.g. "spacing", "color", "typography", etc.
  key?: string; // exact key or prefix
  match: (body: string) => any | false;
  apply: (m: any, meta: any, ctx: RuleContext) => CSSObject | CSSObject[];
  enumerate?: (ctx: RuleContext) => string[];
};

export type RuleContext = {
  screens: Record<string, string>;
  important: boolean | string | undefined;
  resolveColor: (key: string) => string;
};

export interface RuleEngine {
  match: (className: string) => MatchResult | false;
  render: (match: MatchResult, meta: any, ctx: RuleContext) => CSSObject[];
  enumerate: (ctx: RuleContext, opts?: { families?: string[] }) => string[];
}
