import { NavigationContext } from "./NavigationContext";
import React, { useEffect, useState } from "react";

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

    console.log('Provider Instance ID in NavigationProvider:', (window as any).reactNavigateInstance);
    useEffect(() => {
        const handlePopState = () => {
            console.log("Navigated to:", window.location.pathname);
            setCurrentPath(window.location.pathname);
        }

        window.addEventListener("popstate", handlePopState);

        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    function navigate(to: string) {
        window.history.pushState({}, "", to);
        setCurrentPath(to);
    }

    return (
        <NavigationContext value={{ path: currentPath, navigate }}>
            {children}
        </NavigationContext>
    );
}