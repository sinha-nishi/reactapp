import { TailwindCompatOptions } from "../plugins/compat/tailwind";

export type TokenValue = string | number;
export type Tokens = Record<string, TokenValue>;
export type ThemeName = string;
export type CssVarMap = Record<`--${string}`, string | number>;
export type LayerName =
  | "settings"
  | "tools"
  | "generic"
  | "elements"
  | "layout"
  | "components"
  | "utilities";

export type TokenNode = TokenValue | TokenTree;

export interface TokenTree {
  [key: string]: TokenNode;
}

export type SettingsPluginOptions = {
  theme: LoadedTheme;

  /**
   * Optional overrides by theme (keys WITHOUT "--")
   * Example: { light: { "radius-md": "12px" } }
   */
  overrides?: Partial<Record<ThemeName, Record<string, string | number>>>;

  /**
   * Optional overrides by theme as CSS vars (keys WITH "--")
   * Useful when you want direct var-level override.
   */
  cssVarOverrides?: Partial<
    Record<ThemeName, Record<`--${string}`, string | number>>
  >;
};

export type TokenPack = {
  meta?: {
    name?: string;
    version?: string;
    defaultTheme?: ThemeName;

    /**
     * Theme selectors. If missing for a theme, default is:
     *   :root[data-theme="THEME"]
     * If "light" missing, defaults to :root
     *
     * You may also provide "@media (...)" selectors; settingsPlugin will emit a block.
     */
    selectors?: Record<ThemeName, string>;

    /**
     * Controls how nested paths turn into CSS var names.
     */
    varNaming?: {
      stripPrefixes?: string[]; // e.g. ["tokens","primitive","semantic","custom"]
      rewrite?: Array<{ from: string; to: string }>; // regex replacements on the flattened path
    };

    // inheritance
    extends?: Record<ThemeName, ThemeName[]>; // e.g. { light:["base"], dark:["base","light"] }

    // global defaults (applies to all themes)
    defaults?: TokenTree; // tokens merged into all themes first
  };

  themes: Record<
    ThemeName,
    {
      /**
       * Arbitrary nested tokens.
       * You can put primitive/semantic/custom inside here if you like.
       */
      tokens: TokenTree;
    }
  >;
};

export type ThemeVariables = {
  colors: Record<string, TokenValue>;
  spacing: Record<string, TokenValue>;
};

export type LoadedTheme = {
  meta: {
    name: string;
    version: string;
    defaultTheme: ThemeName;
    selectors: Record<ThemeName, string>;
    varNaming: Required<NonNullable<TokenPack["meta"]>["varNaming"]>;
  };
  themeNames: ThemeName[];

  raw: TokenPack;

  /** For builder.setTokens() (no leading --) */
  tokensByTheme: Record<ThemeName, Record<string, TokenValue>>;

  /** For builder.settings() (leading --) */
  cssVarsByTheme: Record<ThemeName, Record<`--${string}`, TokenValue>>;

  /** runtime DSL */
  get: (theme: ThemeName, path: string) => TokenValue | undefined;
  getResolved: (theme: ThemeName, path: string) => TokenValue | undefined;
  varName: (path: string) => `--${string}`;
  varRef: (path: string) => string;
  group: (theme: ThemeName, path: string) => TokenTree | undefined;
  flatGroup: (theme: ThemeName, path: string) => Record<string, TokenValue>;
  resolvePublicPath: (publicPath: string) => string; // -> internal path
  varNamePublic: (publicPath: string) => `--${string}`;
  varRefPublic: (publicPath: string) => string;
  view: (themeName: ThemeName) => ThemeVariables;

  isAbstractTheme: (t: string) => boolean;
  runtimeThemes: () => ThemeName[];
  selector: (theme: ThemeName) => string;
  cssVars: (theme: ThemeName) => Record<`--${string}`, TokenValue>;
  cssVarsDiff: (
    theme: ThemeName,
    baseTheme?: ThemeName,
  ) => Record<`--${string}`, TokenValue>;
  emitVars: (b: any, t: ThemeName, vars: CssVarMap, layer: LayerName) => void;
  token: (
    publicPath: string,
    themeName?: ThemeName,
  ) => {
    publicPath: string;
    path: string;
    var: `--${string}`;
    ref: string;
  };
  value: (publicPath: string, themeName?: ThemeName) => TokenValue | undefined;
};

export type UtilitiesOptions = {
  // allow custom user overrides from pkv.config.ts
  theme?: LoadedTheme;
  screens?: Record<string, string>; // e.g. { xs:"360px", sm:"640px", md:"768px", ... }
  important?: boolean | string; // true => global !important, or selector prefix like "#app"
  enableArbitraryValues?: boolean; // default true
  prefix?: string; // optional utility prefix, e.g. "tw-"
};

export type LayerOptions = {
  settings?: boolean | SettingsPluginOptions;
  tools?: boolean | Partial<Record<string, string>>;
  generic?: boolean | Partial<Record<string, string>>;
  elements?: boolean | Partial<Record<string, string>>;
  objects?: boolean | Partial<Record<string, string>>;
  components?: boolean | Partial<Record<string, string>>;
  utilities?: boolean | UtilitiesOptions;
};

export type BuilderOptions = {
  prefix?: string;
  layers?: LayerOptions;
  theme?: string;
  tokens?: Tokens;
  utilities?: { spacingScale?: number[] };
  compat?: {
    tailwind?: TailwindCompatOptions;
  };
};
