import React, { JSX } from "react";
import { Routes } from "./types/Routes";
import { Theme } from "./types/Theme";
import { ApplicationContext } from '@pkvsinha/react-hooks';
import DefaultComponentView from "./views/DefaultComponentView";

export interface ReactApplicationAttributes {
    topLevelNavigation?: React.ReactNode;
    routes: Routes,
    theme: Theme,
    children?: React.ReactNode;
    views: any[];
}

export function ReactApplication({ children }: ReactApplicationAttributes): JSX.Element {

    return (
        <React.StrictMode>
            <ApplicationContext value={{ s: "hello"}}>
                {/* {children} */}
                <DefaultComponentView />
            </ApplicationContext>
        </React.StrictMode>
    );
}