export type Theme = Record<string, any>;

export type CSSObject = {
  selector: string; // ".md\\:hover\\:bg-red-500"
  decls: Record<string, string>; // { "background-color": "..." }
  media?: string; // "@media (min-width: 768px)"
};

export interface MatchResult {
  raw: string; // original class, e.g. "md:hover:bg-red-500"
  tokens?: string[]; // variants like ["md","hover"]
  important?: boolean; // '!' flag
  negative?: boolean; // '-' flag
  [k: string]: any; // rule-specific captures
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
