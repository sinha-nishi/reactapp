import React, { JSX, useState } from "react";
import { ApplicationContext, NavigationContext } from '@pkvsinha/react-hooks';
import { NavigationProvider, Router } from "@pkvsinha/react-navigate";
import DefaultComponentView from "./views/DefaultComponentView";
import { ReactApplicationAttributes } from "./types/Application";
import PageNotFound from "./views/PageNotFound";

export function ReactApplication({ views, home }: ReactApplicationAttributes): JSX.Element {

    // const viewComponents = views.filter(view => view.id === activeView).map(view => (
    //     <div key={view.id}>
    //         {view.view ? <DefaultComponentView view={view}>
    //             {view.view}
    //         </DefaultComponentView> : null}
            
    //     </div>
    // ));

    const viewComponents = views.map(view => {
        function ViewComponent () {
            return (<div key={view.id}>
                {view.view ? <DefaultComponentView view={view}>
                    {view.view}
                </DefaultComponentView> : null}
            </div>);
        }

        return {
            ["/"+view.id]: ViewComponent
        }
    }).reduce((acc, curr) => ({ ...acc, ...curr }), {});

    console.log("viewComponents", viewComponents);

    return (
        <React.StrictMode>
            <ApplicationContext value={{ s: "hello"}}>
                {/* {children} */}
                {/* <NavigationContext value={{path:"home"}}>
                    {viewComponents}
                </NavigationContext> */}
                <NavigationProvider>
                    <Router routes={viewComponents} x404={PageNotFound} />
                </NavigationProvider>
            </ApplicationContext>
        </React.StrictMode>
    );
}