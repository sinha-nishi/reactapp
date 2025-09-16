import * as React from 'react';
import { RoutingContext } from "./RouterContext";

/**
 * A custom hook to access route parameters (params, query, hash).
 * Throws an error if used outside of a RouterContext.Provider.
 */
export function useRouteParams() {
  const context = React.useContext(RoutingContext);
  if (!context) {
    throw new Error('useRouteParams must be used within a RoutingContext or Router component.');
  }
  return context;
};