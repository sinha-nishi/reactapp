import * as React from 'react';
import { ApplicationContext, AppContext } from "../context/ApplicationContext";

type Derived = {
  // compatibility helpers for current app code
  value?: string;
  topNav?: unknown;
  appBar?: unknown;
  navbar?: unknown;
};

export function useApplicationContext(): AppContext & Derived {
  const context = React.useContext(ApplicationContext);
  // create convenience/compatibility fields without mutating context
  const derived: Derived = {
    value: context.title || context.meta?.title || '',
    appBar: context.config?.appBar,
    navbar: context.config?.navBar,
    topNav: context.config?.navBar,
  };
  return Object.assign({}, context, derived);
}
