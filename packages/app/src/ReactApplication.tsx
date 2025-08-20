import React, { JSX, useState } from "react";
import { Routes } from "./types/Routes";
import { Theme } from "./types/Theme";
import { ApplicationContext } from '@pkvsinha/react-hooks';
import DefaultComponentView from "./views/DefaultComponentView";
import { View } from "./types/View";

export interface ReactApplicationAttributes {
    topLevelNavigation?: React.ReactNode;
    routes: Routes,
    theme: Theme,
    children?: React.ReactNode;
    view?: View;
    views: View[];
    navbar: any[];
    footer: any[];
    banner: any[];
}

export function ReactApplication({ views }: ReactApplicationAttributes): JSX.Element {

    const [activeView, setActiveView] = useState("home");

    const viewComponents = views.filter(view => view.id === activeView).map(view => (
        <div key={view.id}>
            {view.view ? <DefaultComponentView>
                {view.view}
            </DefaultComponentView> : null}
            
        </div>
    ));

    return (
        <React.StrictMode>
            <ApplicationContext value={{ s: "hello"}}>
                {/* {children} */}
                {viewComponents}
            </ApplicationContext>
        </React.StrictMode>
    );
}