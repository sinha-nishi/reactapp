import * as React from 'react';
import { ApplicationProvider, deepMerge } from '@pkvsinha/react-hooks';
import { Navigate, NavigationProvider, Router } from "@pkvsinha/react-navigate";
import { DefaultComponentView } from "./views/DefaultComponentView";
import { ReactApplicationAttributes } from "./types/Application";
import { PageNotFound } from "./views/PageNotFound";

export function ReactApplication({ views, home, app, appDefaults }: ReactApplicationAttributes): React.JSX.Element {

    const viewComponents = React.useMemo( () => {
        const components = views.map(view => {
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

        if (home) {
            components["/"] = components["/"+home]
        }
        return components;
    }, [views, home]);

    const providerDefaults = React.useMemo(() => {
        // Provide minimal defaults and include views; let caller override via app/appDefaults
        const base = { views } as Partial<import('@pkvsinha/react-hooks').AppContext>;
        return deepMerge<Partial<import('@pkvsinha/react-hooks').AppContext>>(base, appDefaults ?? {});
    }, [views, appDefaults]);

    return (
        <React.StrictMode>
            <ApplicationProvider defaults={providerDefaults} value={app}>
                <NavigationProvider>
                    <Router routes={viewComponents} x404={PageNotFound} />
                </NavigationProvider>
            </ApplicationProvider>
        </React.StrictMode>
    );
}
