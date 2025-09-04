import * as React from 'react';

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

// App-defined setup is intentionally opaque here to avoid cross-package coupling
export interface AppContext {
  // Flat runtime snapshot; built from app setup at boot
  title?: string;
  home?: string;
  views?: any[];
  brandName?: string;
  brandLogo?: string;
  navBar: {
    links?: Array<Record<string, unknown>>;
    display?: boolean;
    render?: () => React.ReactNode;
  };
  appBar: {
    title?: string;
    display?: boolean;
  };
  theme?: Record<string, unknown>;

  // Runtime UI state managed by the framework/app
  ui?: {
    transitions?: UITransition[];
    state?: Record<string, unknown>;
  };
  // Optional runtime diagnostics/state
  runtime?: Record<string, unknown>;
}

// Note: defaults now live in the app package.

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

export const ApplicationContext = React.createContext<AppContext>({} as AppContext);

// Actions for runtime updates
export type AppAction =
  | { type: 'SET_TITLE'; title: string }
  | { type: 'SET_NAV_LINKS'; links: any[] }
  | { type: 'TOGGLE_APP_BAR'; display?: boolean }
  | { type: 'TOGGLE_NAV_BAR'; display?: boolean }
  | { type: 'SET_BRAND'; name?: string; logo?: string }
  | { type: 'SET_THEME'; theme: Record<string, unknown> }
  | { type: 'MERGE'; payload: Partial<AppContext> };

export const ApplicationDispatchContext = React.createContext<React.Dispatch<AppAction> | null>(null);

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

  // No setup/config validation here; apps provide their own typing/validation.

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

// Note: No internal defaultAppContext; apps should supply defaults via ApplicationProvider.defaults
