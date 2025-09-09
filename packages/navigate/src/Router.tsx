import * as React from 'react';
import { NavigationContext } from "./NavigationContext";
import { matchRoute } from './matcher';
import { RoutingContext, RoutingProvider } from './RouterContext';

export interface RouterAttributes {
    routes: Record<string, React.ComponentType<any>>;
    x404: React.ComponentType<any>;
}

const useCurrentPath = () => {
    const context = React.useContext(NavigationContext);

    if (!context) {
        throw new Error("Router must be used within a NavigationContext");
    }

    return context.location;
}

export const Router = ({ routes, x404 }: RouterAttributes) => {
    // Router implementation goes here
    const location = useCurrentPath();

    const match = matchRoute(location.path, routes);

    const routeParams = {  
        path: location.path,
        params: match?.params || {},
        query: match?.query || {},
        hash: match?.hash || "",
    }

    const FallbackComponent = routes["home"] || x404;
    const Component = match?.Component ?? FallbackComponent;

    return <RoutingProvider value={routeParams}>
        <Component />
    </RoutingProvider>;
}
