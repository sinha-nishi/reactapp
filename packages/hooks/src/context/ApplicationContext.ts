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
  home: undefined,
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

// Lightweight runtime validation (no external deps)
export type ValidationIssue = { path: string; message: string };
export type ValidationResult = { ok: boolean; issues: ValidationIssue[] };

function push(issues: ValidationIssue[], path: string, message: string) {
  issues.push({ path, message });
}

export function validateAppContext(value: unknown, basePath = 'app'): ValidationResult {
  const issues: ValidationIssue[] = [];
  const v = value as Partial<AppContext> | undefined;
  if (v == null || typeof v !== 'object') {
    push(issues, basePath, 'must be an object');
    return { ok: issues.length === 0, issues };
  }

  if (v.meta && typeof v.meta !== 'object') push(issues, basePath + '.meta', 'must be an object');
  if (v.meta && v.meta.title != null && typeof v.meta.title !== 'string') push(issues, basePath + '.meta.title', 'must be a string');
  if (v.meta && v.meta.description != null && typeof v.meta.description !== 'string') push(issues, basePath + '.meta.description', 'must be a string');

  if (v.title != null && typeof v.title !== 'string') push(issues, basePath + '.title', 'must be a string');
  if ((v as any).home != null && typeof (v as any).home !== 'string') push(issues, basePath + '.home', 'must be a string');

  if (v.brand) {
    if (typeof v.brand !== 'object') push(issues, basePath + '.brand', 'must be an object');
    else {
      if ((v.brand as any).name != null && typeof (v.brand as any).name !== 'string') push(issues, basePath + '.brand.name', 'must be a string');
      if ((v.brand as any).logo != null && typeof (v.brand as any).logo !== 'string') push(issues, basePath + '.brand.logo', 'must be a string');
    }
  }

  if (v.config) {
    if (typeof v.config !== 'object') push(issues, basePath + '.config', 'must be an object');
    else {
      const c: any = v.config;
      if (c.images && typeof c.images !== 'object') push(issues, basePath + '.config.images', 'must be an object');

      const nb = c.navBar;
      if (nb) {
        if (typeof nb !== 'object') push(issues, basePath + '.config.navBar', 'must be an object');
        else if (nb.links != null) {
          if (!Array.isArray(nb.links)) push(issues, basePath + '.config.navBar.links', 'must be an array');
          else nb.links.forEach((ln: any, i: number) => {
            const p = `${basePath}.config.navBar.links[${i}]`;
            if (typeof ln !== 'object') push(issues, p, 'must be an object');
            else {
              if (typeof ln.title !== 'string') push(issues, p + '.title', 'is required string');
              if (typeof ln.path !== 'string') push(issues, p + '.path', 'is required string');
              if (ln.icon != null && typeof ln.icon !== 'string') push(issues, p + '.icon', 'must be a string');
              if (ln.external != null && typeof ln.external !== 'boolean') push(issues, p + '.external', 'must be a boolean');
            }
          });
        }
      }

      const ab = c.appBar;
      if (ab) {
        if (typeof ab !== 'object') push(issues, basePath + '.config.appBar', 'must be an object');
        else {
          if (ab.title != null && typeof ab.title !== 'string') push(issues, basePath + '.config.appBar.title', 'must be a string');
          if (ab.actions != null && !Array.isArray(ab.actions)) push(issues, basePath + '.config.appBar.actions', 'must be an array');
        }
      }
    }
  }

  if (v.ui) {
    if (typeof v.ui !== 'object') push(issues, basePath + '.ui', 'must be an object');
    else {
      const u: any = v.ui;
      if (u.transitions != null) {
        if (!Array.isArray(u.transitions)) push(issues, basePath + '.ui.transitions', 'must be an array');
        else u.transitions.forEach((t: any, i: number) => {
          const p = `${basePath}.ui.transitions[${i}]`;
          if (typeof t !== 'object') push(issues, p, 'must be an object');
          else if (typeof t.run !== 'function') push(issues, p + '.run', 'is required function');
        });
      }
      if (u.state != null && typeof u.state !== 'object') push(issues, basePath + '.ui.state', 'must be an object');
    }
  }

  return { ok: issues.length === 0, issues };
}

export function createDefaultAppContext(overrides?: Partial<AppContext>): AppContext {
  return deepMerge<AppContext>(defaultAppContext, overrides ?? {});
}
