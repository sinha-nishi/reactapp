import * as React from 'react';
import { ApplicationContext, AppContext, deepMerge, createDefaultAppContext } from './ApplicationContext';

export type ApplicationProviderProps = {
  value?: Partial<AppContext>;
  defaults?: Partial<AppContext>;
  children: React.ReactNode;
};

export function ApplicationProvider({ value, defaults, children }: ApplicationProviderProps) {
  const merged = React.useMemo(
    () => deepMerge<AppContext>(createDefaultAppContext(defaults), value ?? {}),
    [defaults, value]
  );
  return (
    <ApplicationContext.Provider value={merged}>
      {children}
    </ApplicationContext.Provider>
  );
}

