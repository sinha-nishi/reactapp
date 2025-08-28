import React, { createContext, useState } from "react";

// Add this to the top of packages/react-navigate/src/index.ts
(window as any).reactNavigateInstance = (window as any).reactNavigateInstance || Math.random();

interface NavigationContextState {
    path: string;
    navigate: (to: string) => void;
}

console.log('Provider Instance ID in create context:', (window as any).reactNavigateInstance);

export const NavigationContext = createContext<NavigationContextState | undefined>(undefined);
