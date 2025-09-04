import * as React from 'react';
import { NavigationContext } from "./NavigationContext";
import { matchRoute } from './matcher';

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

    const match = matchRoute(currentPath, routes);

    if (match && match.Component) {
        const { Component, params, query, hash } = match;
        return <Component params={params} query={query} hash={hash} />;
    }

    const Component = routes["home"] || x404;

    return <Component />;
}
