import * as React from 'react';

// Core Application Context Types (extensible)
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

export type TransitionFn = (args: {
  from?: string | 'any';
  to?: string | 'any';
  event?: string;
  context: AppContext;
  params?: Record<string, unknown>;
}) => void | Promise<void>;

export interface UITransition {
  id?: string;
  from?: string | 'any';
  to?: string | 'any';
  event?: string; // e.g., 'route-change', 'view-enter', 'theme-change'
  when?: (ctx: AppContext) => boolean;
  priority?: number;
  once?: boolean;
  debounceMs?: number;
  run: TransitionFn;
}

export interface AppContext<Ext extends Record<string, unknown> = Record<string, unknown>> {
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
  config?: {
    theme?: ThemeConfig;
    images?: Record<string, string>;
    navBar?: NavBarConfig;
    appBar?: AppBarConfig;
    sideBar?: SideBarConfig;
    footer?: FooterConfig;
    header?: HeaderConfig;
  };
  // Keep views generic to avoid package cycles. Apps can supply their own typing.
  views?: any[];
  ui?: {
    transitions?: UITransition[];
    state?: Record<string, unknown>;
  };
  // Arbitrary extension bag for low-code additions
  ext?: Ext;
}

const defaultAppContext: AppContext = {
  meta: { title: '' },
  title: '',
  brand: { name: '', logo: '' },
  config: {
    theme: {},
    images: {},
    navBar: { display: true, links: [] },
    appBar: { display: true, title: '', actions: [] },
    sideBar: { display: false, collapsed: false, sections: [] },
    footer: { display: false, text: '' },
    header: { display: false, text: '', logo: '' },
  },
  views: [],
  ui: { transitions: [], state: {} },
  ext: {},
};

// Simple deep merge utility suitable for config/state trees
function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function deepMerge<T extends object>(...objects: Partial<T>[]): T {
  const result: Record<string, unknown> = {};
  for (const obj of objects) {
    if (!obj) continue;
    for (const [key, value] of Object.entries(obj)) {
      const prev = result[key];
      if (Array.isArray(value)) {
        result[key] = Array.isArray(prev) ? [...(prev as unknown[]), ...value] : [...value];
      } else if (isObject(value) && isObject(prev)) {
        result[key] = deepMerge(prev as object, value as object);
      } else if (isObject(value)) {
        result[key] = deepMerge({}, value as object);
      } else {
        result[key] = value as unknown;
      }
    }
  }
  return result as T;
}

const ApplicationContext = React.createContext<AppContext>(defaultAppContext);

export { ApplicationContext };

export function createDefaultAppContext(overrides?: Partial<AppContext>): AppContext {
  return deepMerge<AppContext>(defaultAppContext, overrides ?? {});
}
