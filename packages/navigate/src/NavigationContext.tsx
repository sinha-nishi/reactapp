import * as React from 'react';

// Add this to the top of packages/react-navigate/src/index.ts
(window as any).reactNavigateInstance = (window as any).reactNavigateInstance || Math.random();

interface NavigationContextState {
    path: string;
    navigate: (to: string) => void;
}

export const NavigationContext = React.createContext<NavigationContextState | undefined>(undefined);
