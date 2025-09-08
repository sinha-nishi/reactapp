import * as React from 'react';
import { NavigationContext } from "./NavigationContext";
import { navigationStore } from './NavigationStore';

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
    // const [currentPath, setCurrentPath] = React.useState<string>(window.location.pathname);

    // React.useEffect(() => {
    //     const handlePopState = () => {
    //         setCurrentPath(window.location.pathname);
    //     }

    //     window.addEventListener("popstate", handlePopState);

    //     return () => window.removeEventListener("popstate", handlePopState);
    // }, []);

    // function navigate(to: string) {
    //     window.history.pushState({}, "", to);
    //     setCurrentPath(to);
    // }

    const [location, setLocation] = React.useState(navigationStore.location);

    React.useEffect(() => {
        navigationStore.subscribe(setLocation);
    }, [])

    return (
        <NavigationContext value={{ location, navigate: navigationStore.navigate.bind(navigationStore) }}>
            {children}
        </NavigationContext>
    );
}