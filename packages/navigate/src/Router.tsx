import * as React from 'react';
import { Navigate } from "./Navigate";
import { NavigationContext } from "./NavigationContext";

export interface RouterAttributes {
    routes: Record<string, React.ComponentType<any>>;
    x404: React.ComponentType<any>;
}

const useCurrentPath = () => {
    const context = React.useContext(NavigationContext);

    if (!context) {
        throw new Error("Router must be used within a NavigationContext");
    }

    return context.path;
}

export const Router = ({ routes, x404 }: RouterAttributes) => {
    // Router implementation goes here
    const currentPath = useCurrentPath();

    const ComponentToRender = routes[currentPath] || routes["home"] || x404;

    return <ComponentToRender />;
}
