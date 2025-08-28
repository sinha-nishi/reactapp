import { NavigationContext } from "./NavigationContext";
import React, { useContext } from "react";

export function useNavigation() {
    console.log(
        'Are the React instances the same?',
        window.myAppReact === React
    );
    console.log('Consumer Instance ID in useNavigation:', (window as any).reactNavigateInstance);
    const context = useContext(NavigationContext);
        
    if (context === undefined) {
        throw new Error("useNavigation must be used within a NavigationContext or Navigation Provider: " + context);
    }

    return { navigate: context.navigate }
}