import React, { useReducer } from "react";
import { Routes } from "./types/Routes";
import { Theme } from "./types/Theme";

export interface ReactApplicationAttributes {
    topLevelNavigation?: React.ReactNode;
    routes: Routes,
    theme: Theme,
    children?: React.ReactNode;
}

function reducer(state, action) {
    // Reducer logic can be added here if needed
    return {};
}

export default function ReactApplication({ children }: ReactApplicationAttributes): JSX.Element {
    const [state, dispatch] = useReducer(() => ({}), {});
    return <div>
        {children}
    </div>
}