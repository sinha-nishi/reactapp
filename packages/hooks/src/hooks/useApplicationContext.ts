import * as React from 'react';
import { ApplicationContext, ApplicationDispatchContext, AppContext } from "../context/ApplicationContext";

type Derived = {
  // compatibility helpers for current app code
  value?: string;
  topNav?: unknown;
  appBar?: unknown;
  navBar?: unknown;
  // runtime actions
  setTitle?: (title: string) => void;
  setNavLinks?: (links: any[]) => void;
  toggleAppBar?: (display?: boolean) => void;
  toggleNavBar?: (display?: boolean) => void;
  setBrand?: (args: { name?: string; logo?: string }) => void;
  setTheme?: (theme: Record<string, unknown>) => void;
  update?: (patch: Partial<AppContext>) => void;
};

export function useApplicationContext(): AppContext & Derived {
  const context = React.useContext(ApplicationContext);
  const dispatch = React.useContext(ApplicationDispatchContext);
  // create convenience/compatibility fields without mutating context
  const derived: Derived = {
    value: (context as any)?.title || '',
    appBar: { title: (context as any)?.appBarTitle, display: (context as any)?.appBarDisplay },
    navBar: { 
      links: context?.navBar?.links, 
      display: context?.navBar?.display, 
      render: () => {
        return context?.navBar?.render ? context.navBar.render() : null;
      }
    },
    topNav: (context as any)?.navLinks,
    setTitle: (title: string) => dispatch?.({ type: 'SET_TITLE', title }),
    setNavLinks: (links: any[]) => dispatch?.({ type: 'SET_NAV_LINKS', links }),
    toggleAppBar: (display?: boolean) => dispatch?.({ type: 'TOGGLE_APP_BAR', display }),
    toggleNavBar: (display?: boolean) => dispatch?.({ type: 'TOGGLE_NAV_BAR', display }),
    setBrand: ({ name, logo }) => dispatch?.({ type: 'SET_BRAND', name, logo }),
    setTheme: (theme) => dispatch?.({ type: 'SET_THEME', theme }),
    update: (patch) => dispatch?.({ type: 'MERGE', payload: patch }),
  };
  return Object.assign({}, context, derived);
}
