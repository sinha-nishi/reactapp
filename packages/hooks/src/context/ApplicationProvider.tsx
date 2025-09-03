import * as React from 'react';
import { ApplicationContext, AppContext, deepMerge, createDefaultAppContext, validateAppContext } from './ApplicationContext';

export type ApplicationProviderProps = {
  value?: Partial<AppContext>;
  defaults?: Partial<AppContext>;
  strict?: boolean; // throw on validation failure
  children: React.ReactNode;
};

export function ApplicationProvider({ value, defaults, strict, children }: ApplicationProviderProps) {
  const merged = React.useMemo(
    () => deepMerge<AppContext>(createDefaultAppContext(defaults), value ?? {}),
    [defaults, value]
  );
  // Validate and either warn or throw based on strict flag
  const validation = React.useMemo(() => validateAppContext(merged), [merged]);
  if (!validation.ok) {
    const msg = `Application context validation failed:\n` + validation.issues.map(i => `- ${i.path}: ${i.message}`).join('\n');
    if (strict) throw new Error(msg);
    // eslint-disable-next-line no-console
    console.warn(msg);
  }
  return (
    <ApplicationContext.Provider value={merged}>
      {children}
    </ApplicationContext.Provider>
  );
}
