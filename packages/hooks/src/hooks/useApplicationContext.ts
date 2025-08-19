import React, { useContext, useReducer } from "react";
import { ApplicationContext } from "../context/ApplicationContext";

function reducer(state: any, action: any) {
    // Reducer logic can be added here if needed
    switch(action.type) {
        case 'UPDATE_THEME':
            return { ...state, theme: action.payload };
        case 'UPDATE_ROUTES':
            return { ...state, routes: action.payload };
        default:
            return state;
    }
}

export function useApplicationContext() {
    
    const [state, dispatch] = useReducer(reducer, {
        topLevelNavigation: null,
        routes: [],
        theme: 'light',
    });

    const context = useContext(ApplicationContext);
    
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }

    function showAppBar() {
        dispatch({ type: 'SHOW_APP_BAR' });
    }

    return { value: "hello", appBar: state.appBar, navbar: state.navbar, topNav: state.topLevelNavigation };
}
