import * as React from 'react';
import { ApplicationContext } from '@pkvsinha/react-hooks';
import { Navigate, NavigationProvider, Router } from "@pkvsinha/react-navigate";
import DefaultComponentView from "./views/DefaultComponentView";
import { ReactApplicationAttributes } from "./types/Application";
import PageNotFound from "./views/PageNotFound";

export function ReactApplication({ views, home }: ReactApplicationAttributes): React.JSX.Element {

    const viewComponents = React.useMemo( () => {
        const components = views.map(view => {
            function ViewComponent () {
                return (<div key={view.id}>
                    {view.view ? <DefaultComponentView view={view}>
                        <Navigate to="/apps" label="let's to Apps" />
                        {view.view}
                    </DefaultComponentView> : null}
                </div>);
            }

            return {
                ["/"+view.id]: ViewComponent
            }
        }).reduce((acc, curr) => ({ ...acc, ...curr }), {});

        if (home) {
            components["/"] = components["/"+home]
        }
        console.log("viewComponents", components);

        return components;
    }, [views, home]);

    return (
        <React.StrictMode>
            <ApplicationContext value={{ s: "hello"}}>
                {/* {children} */}
                {/* <NavigationContext value={{path:"home"}}>
                    {viewComponents}
                </NavigationContext> */}
                <NavigationProvider>
                    <Router routes={viewComponents} x404={PageNotFound} />
                    <Navigate to="/apps" label="Go to Apps" />
                </NavigationProvider>
            </ApplicationContext>
        </React.StrictMode>
    );
}