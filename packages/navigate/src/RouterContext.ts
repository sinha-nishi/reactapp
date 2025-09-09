import * as React from 'react';

export interface RoutingState {
    path: string;
    params?: Record<string, string>;
    query?: Record<string, string>;
    hash?: string | null;
}

// Create a context with a default null value
export const RoutingContext = React.createContext<RoutingState | null>(null);

// Export the provider to be used in your Router
export const RoutingProvider = RoutingContext.Provider;