// App configuration types live in the app package to avoid hooks coupling

export type AppNavLink = {
  title: string;
  path: string;
  icon?: string;
  external?: boolean;
};

export type AppBarConfig = {
  display?: boolean;
  title?: string;
  actions?: React.ReactNode[];
};

export type NavBarConfig = {
  display?: boolean;
  links?: AppNavLink[];
};

export type SideBarConfig = {
  display?: boolean;
  collapsed?: boolean;
  sections?: Array<{ title?: string; items?: Array<AppNavLink> }>;
};

export type FooterConfig = {
  display?: boolean;
  text?: string;
};

export type HeaderConfig = {
  display?: boolean;
  text?: string;
  logo?: string;
};

export type ThemeConfig = Record<string, unknown>;

export interface AppSetup<Ext extends Record<string, unknown> = Record<string, unknown>> {
  meta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  title?: string;
  brand?: {
    name?: string;
    logo?: string;
  };
  home?: string;
  config?: {
    theme?: ThemeConfig;
    images?: Record<string, string>;
    navBar?: NavBarConfig;
    appBar?: AppBarConfig;
    sideBar?: SideBarConfig;
    footer?: FooterConfig;
    header?: HeaderConfig;
  };
  // Avoid direct dependency on View type to prevent cycles; consumers can refine
  views?: any[];
  // Arbitrary extension bag for low-code additions
  ext?: Ext;
}

