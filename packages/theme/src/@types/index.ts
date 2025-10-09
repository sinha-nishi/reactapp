export type CSSObject = {
  selector: string; // ".md\\:hover\\:bg-red-500"
  decls: Record<string, string>; // { "background-color": "..." }
  media?: string; // "@media (min-width: 768px)"
};

export interface CompatContext {
  theme: Record<string, any>;
  screens: Record<string, string>;
  important: boolean | string;
  resolveColor(nameOrHex: string, alpha?: string): string;
}

export type UtilityRule = {
  kind: "exact" | "prefix" | "pattern";
  key?: string; // exact key or prefix
  match: (body: string) => any | false;
  apply: (m: any, meta: any, ctx: CompatContext) => CSSObject | CSSObject[];
};

export interface MatchResult {
  raw: string; // original class, e.g. "md:hover:bg-red-500"
  tokens?: string[]; // variants like ["md","hover"]
  important?: boolean; // '!' flag
  negative?: boolean; // '-' flag
  [k: string]: any; // rule-specific captures
}

export interface UtilityEngine {
  match: (className: string) => MatchResult | false;
  render: (match: MatchResult, meta: any, ctx: CompatContext) => CSSObject[];
}

export type VariantBuilder = (
  tokens: string[],
  decls: CSSObject[],
) => CSSObject[];

export interface CompatPlugin {
  name: string;
  variants: VariantBuilder;
  match: (className: string) => MatchResult | false;
  render: (match: MatchResult, meta: any) => CSSObject[];
}
