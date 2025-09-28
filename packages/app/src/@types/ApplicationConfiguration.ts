// App configuration types live in the app package to avoid hooks coupling

import { View } from "./View";

export type RenderOptions = {
  rootId?: string;
  strictValidation?: boolean;
}

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
  render?: () => React.ReactNode;
};

export type NavBarConfig = {
  display?: boolean;
  links?: AppNavLink[];
  render?: () => React.ReactNode;
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
export type DesignConfig = Record<string, unknown>;
export type LayoutConfig = Record<string, unknown>;

// --- Low-code extensibility additions ---

// Data sources (REST, GraphQL, static, mock, etc.)
export type DataSourceConfig = {
  type: "rest" | "graphql" | "static" | "mock" | string;
  config: Record<string, unknown>;
};

// Actions & event handlers
export type ActionConfig = {
  type: "api" | "function" | "navigation" | "custom" | string;
  handler?: (...args: any[]) => any;
  config?: Record<string, unknown>;
};

// Permissions & roles
export type PermissionsConfig = {
  roles: string[];
  rules: Record<string, string[]>; // view/component: allowed roles
};

// Custom components registry
export type ComponentsRegistry = {
  [name: string]: React.ComponentType<any>;
};

// Custom components registry
export type WidgetsRegistry = {
  [name: string]: React.ComponentType<any>;
};

// Custom components registry
export type LayoutsRegistry = {
  [name: string]: React.ComponentType<any>;
};

// Routing configuration
export type RouteConfig = {
  path: string;
  view: string;
  [key: string]: unknown;
};

// Localization (i18n)
export type I18nConfig = {
  defaultLocale: string;
  locales: string[];
  messages: Record<string, Record<string, string>>;
};

// Plugins/extensions
export type PluginConfig<T = unknown> = {
  [pluginName: string]: T;
};

// Validation schemas for forms/data
export type ValidationSchemasConfig = {
  [formName: string]: Record<string, unknown>;
};

export interface ApplicationConfiguration<Ext extends Record<string, unknown> = Record<string, unknown>> {
  meta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  contextPath?: string;
  title?: string;
  brand?: {
    name?: string;
    logo?: string;
  };
  views: View[];
  routes?: RouteConfig[];
  home?: string;
  theme?: string;
  /**
   * Use config to modify the behavior of the app by
   * configuring various building blocks of the application
   * by allowing them to use user-defined values instead of in-built ones.
   */
  config?: {
    /**
     * Modify the values for the in-built or custom theme
     * like dark, light, contrast etc.
     * This includes colors, fonts, spacing, and other design tokens.
     */
    themes?: Record<string, ThemeConfig>;
    // to customise a given design like, flat, material, minimalist etc..
    designs?: Record<string, DesignConfig>;
    layouts?: Record<string, LayoutConfig>;
    components?: Record<string, unknown>;
    widgets?: Record<string, unknown>;
    images?: Record<string, string>;
    shell?: {
      navBar?: NavBarConfig;
      appBar?: AppBarConfig;
      sideBar?: SideBarConfig;
      footer?: FooterConfig;
      header?: HeaderConfig;
    };
  };

  // --- Low-code extensibility fields ---
  dataSources?: Record<string, DataSourceConfig>;
  actions?: Record<string, ActionConfig>;
  permissions?: PermissionsConfig;
  /** Custom components registry */
  registry?: {
    components?: ComponentsRegistry;
    widgets?: WidgetsRegistry;
    layouts?: LayoutsRegistry;
  };
  i18n?: I18nConfig;
  plugins?: PluginConfig;
  /**
  * Arbitrary global state for cross-component communication.
  */
  globalState?: Record<string, unknown>;
  validationSchemas?: ValidationSchemasConfig;

  /**
  * Arbitrary extension bag for further low-code additions.
  * Use this for custom app-specific config.
  */
  ext?: Ext;
}

