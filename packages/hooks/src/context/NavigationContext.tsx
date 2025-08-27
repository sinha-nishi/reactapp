import React, { createContext, useState } from "react";

interface NavigationContextState {
    path: string;
    navigate: (to: string) => void;
}

export const NavigationContext = createContext<NavigationContextState | undefined>(undefined);
