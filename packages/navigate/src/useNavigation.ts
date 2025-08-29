import * as React from 'react';
import { NavigationContext } from "./NavigationContext";


export function useNavigation() {
    const context = React.useContext(NavigationContext);
        
    if (context === undefined) {
        throw new Error("useNavigation must be used within a NavigationContext or Navigation Provider: " + context);
    }

    return { navigate: context.navigate }
}