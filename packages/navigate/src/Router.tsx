import { NavigationContext } from "@pkvsinha/react-hooks";
import React, { useContext } from "react";

export interface RouterAttributes {
    routes: Record<string, React.ComponentType<any>>;
    x404: React.ComponentType<any>;
}

const useCurrentPath = () => {
    const context = useContext(NavigationContext);

    if (!context) {
        throw new Error("Router must be used within a NavigationContext");
    }

    return context.path;
}

export const Router = ({ routes, x404 }: RouterAttributes) => {
    // Router implementation goes here
    const currentPath = useCurrentPath();

    console.log("currentPath", currentPath, "matching routes: ", routes[currentPath], " from : ", routes);

    const ComponentToRender = routes[currentPath] || routes["home"] || x404;

    return <ComponentToRender />;
}
