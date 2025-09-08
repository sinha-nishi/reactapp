import * as React from 'react';

type Location = {
  path: string;
  query: Record<string, string>;
  hash: string | null;
};

interface NavigationContextState {
    location: Location;
    navigate: (to: string) => void;
}

export const NavigationContext = React.createContext<NavigationContextState | undefined>(undefined);
