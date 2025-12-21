export * from "./styleOptions";
export * from "./CSSProperties";

export type Theme = {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  sizes: Record<string, string>;
  typography: Record<string, string>;
  fontWeight: Record<string, string>;
  lineHeight: Record<string, string>;
  letterSpacing: Record<string, string>;
  fontSize: Record<string, string | [string, { lineHeight?: string }]>;
  borderWidth: Record<string, string>;
  radius: Record<string, string>;
  opacity: Record<string, string>;
  shadow: Record<string, string>;
  ringWidth: Record<string, string>;
  ringColor: Record<string, string>;
  ringOffsetWidth: Record<string, string>;
  ringOffsetColor: Record<string, string>;
  zIndex: Record<string, string>;
};

export type ScreenOptions = Record<string, string>;

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

export interface BuilderContext {
  theme: Record<string, any>;
  screens: Record<string, string>;
  important: boolean | string;
  resolveColor(nameOrHex: string, alpha?: string): string;
}

export interface ClassEnginePlugin {
  name: string;
  variants: VariantBuilder;
  match: (className: string) => MatchResult | false;
  render: (match: MatchResult, meta: any) => CSSObject[];
  enumerate: (ctx: BuilderContext, opts?: { families?: string[] }) => string[];
}
