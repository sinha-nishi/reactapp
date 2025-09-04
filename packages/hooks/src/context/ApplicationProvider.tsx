import * as React from 'react';
import { ApplicationContext, ApplicationDispatchContext, AppContext, AppAction, deepMerge } from './ApplicationContext';

export type ApplicationProviderProps = {
  value?: Partial<AppContext>;
  defaults?: Partial<AppContext>;
  children: React.ReactNode;
};

export function ApplicationProvider({ value, defaults, children }: ApplicationProviderProps) {
  const initial = React.useMemo(
    () => deepMerge<AppContext>({}, defaults ?? {}, value ?? {}),
    [defaults, value]
  );

  function reducer(state: AppContext, action: AppAction): AppContext {
    switch (action.type) {
      case 'SET_TITLE':
        return { ...state, title: action.title };
      case 'SET_NAV_LINKS':
        return { ...state, navBar: { ...state.navBar, links: action.links } };
      case 'TOGGLE_APP_BAR':
        return { ...state, appBar: { ...state.appBar, display: action.display ?? !state.appBar.display } };
      case 'TOGGLE_NAV_BAR':
        return { ...state, navBar: { ...state.navBar, display: action.display ?? !state.navBar.display } };
      case 'SET_BRAND':
        return { ...state, brandName: action.name ?? state.brandName, brandLogo: action.logo ?? state.brandLogo };
      case 'SET_THEME':
        return { ...state, theme: { ...(state.theme ?? {}), ...(action.theme ?? {}) } };
      case 'MERGE':
        return deepMerge<AppContext>({}, state, action.payload ?? {});
      default:
        return state;
    }
  }

  const [state, dispatch] = React.useReducer(reducer, initial);

  return (
    <ApplicationDispatchContext.Provider value={dispatch}>
      <ApplicationContext.Provider value={state}>
        {children}
      </ApplicationContext.Provider>
    </ApplicationDispatchContext.Provider>
  );
}
