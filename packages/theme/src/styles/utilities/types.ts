import { CSSObject, MatchResult } from "../../@types";

export interface UtilityContext {
  theme: Record<string, any>;
  screens: Record<string, string>;
  important: boolean | string;
  resolveColor(nameOrHex: string, alpha?: string): string;
}

export type UtilityRule = {
  kind: "exact" | "prefix" | "pattern";
  key?: string; // exact key or prefix
  match: (body: string) => any | false;
  apply: (m: any, meta: any, ctx: UtilityContext) => CSSObject | CSSObject[];
};



export interface UtilityEngine {
  match: (className: string) => MatchResult | false;
  render: (match: MatchResult, meta: any, ctx: UtilityContext) => CSSObject[];
}