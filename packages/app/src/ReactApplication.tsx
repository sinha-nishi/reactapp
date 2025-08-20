import React, { JSX, useState } from "react";
import { ApplicationContext } from '@pkvsinha/react-hooks';
import DefaultComponentView from "./views/DefaultComponentView";
import { ReactApplicationAttributes } from "./types/Application";

export function ReactApplication({ views }: ReactApplicationAttributes): JSX.Element {

    const [activeView, setActiveView] = useState("home");

    const viewComponents = views.filter(view => view.id === activeView).map(view => (
        <div key={view.id}>
            {view.view ? <DefaultComponentView meta={view.meta}>
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