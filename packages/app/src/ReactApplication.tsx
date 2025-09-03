import * as React from 'react';
import { ApplicationProvider, deepMerge, AppContext } from '@pkvsinha/react-hooks';
import { Navigate, NavigationProvider, Router } from "@pkvsinha/react-navigate";
import { DefaultComponentView } from "./views/DefaultComponentView";
import { ReactApplicationAttributes } from "./types/Application";
import { PageNotFound } from "./views/PageNotFound";
import type { View } from './types/View';
import { applicationDefaults } from './defaults/applicationDefaults';

export function ReactApplication({ app, strictValidation }: ReactApplicationAttributes): React.JSX.Element {

    const resolvedViews = React.useMemo(() => {
        const appViews = (app?.views as unknown as View[] | undefined) ?? [];
        return appViews ?? [];
    }, [app?.views]);

    const home = app?.home;

    const viewComponents = React.useMemo( () => {
        const components = resolvedViews.map(view => {
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
    }, [resolvedViews, home]);

    const providerDefaults = React.useMemo(() => {
        // Merge app package defaults with computed minimal overrides
        return deepMerge<Partial<AppContext>>(
            applicationDefaults,
            { views: resolvedViews, home }
        );
    }, [resolvedViews, home]);

    return (
        <React.StrictMode>
            <ApplicationProvider defaults={providerDefaults} value={app} strict={strictValidation}>
                <NavigationProvider>
                    <Router routes={viewComponents} x404={PageNotFound} />
                </NavigationProvider>
            </ApplicationProvider>
        </React.StrictMode>
    );
}
