import React from "react";
import { Routes } from "./types/Routes";
import { Theme } from "./types/Theme";

export interface ReactApplicationAttributes {
    topLevelNavigation?: React.ReactNode;
    routes: Routes,
    theme: Theme,
    children?: React.ReactNode;
}

export default function ReactApplication({ children }: ReactApplicationAttributes): JSX.Element {
    return <div>
        {children}
    </div>
}