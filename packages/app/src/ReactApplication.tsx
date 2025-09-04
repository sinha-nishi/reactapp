import * as React from 'react';
import { ApplicationProvider, deepMerge, validateAppContext } from '@pkvsinha/react-hooks';
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

    // Build a flat runtime snapshot from defaults and app config
    const flatDefaults = React.useMemo(() => {
        const d = applicationDefaults as any;
        return {
            title: d?.title || d?.meta?.title || '',
            home: d?.home,
            views: d?.views ?? [],
            brandName: d?.brand?.name ?? '',
            brandLogo: d?.brand?.logo ?? '',
            navLinks: d?.config?.navBar?.links ?? [],
            appBarTitle: d?.config?.appBar?.title ?? '',
            navBarDisplay: d?.config?.navBar?.display ?? true,
            appBarDisplay: d?.config?.appBar?.display ?? true,
            theme: d?.config?.theme ?? {},
        } as Partial<import('@pkvsinha/react-hooks').AppContext>;
    }, []);

    const flatFromApp = React.useMemo(() => {
        const a = app as any;
        return a ? {
            title: a?.title || a?.meta?.title,
            home: a?.home,
            views: a?.views,
            brandName: a?.brand?.name,
            brandLogo: a?.brand?.logo,
            navLinks: a?.config?.navBar?.links,
            appBarTitle: a?.config?.appBar?.title,
            navBarDisplay: a?.config?.navBar?.display,
            appBarDisplay: a?.config?.appBar?.display,
            theme: a?.config?.theme,
        } : {};
    }, [app]);

    const providerDefaults = React.useMemo(() => {
        return deepMerge<Partial<import('@pkvsinha/react-hooks').AppContext>>(flatDefaults, { views: resolvedViews, home });
    }, [flatDefaults, resolvedViews, home]);

    // Validate initial runtime (defaults merged with app overrides)
    React.useEffect(() => {
        const initialRuntime = deepMerge<import('@pkvsinha/react-hooks').AppContext>({} as any, providerDefaults as any, flatFromApp as any);
        const result = validateAppContext(initialRuntime);
        if (!result.ok) {
            const msg = `Application runtime validation failed:\n` + result.issues.map(i => `- ${i.path}: ${i.message}`).join('\n');
            if (strictValidation) {
                throw new Error(msg);
            } else {
                // eslint-disable-next-line no-console
                console.warn(msg);
            }
        }
        // run once on changes to inputs that affect initial state
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providerDefaults, flatFromApp, strictValidation]);

    return (
        <React.StrictMode>
            <ApplicationProvider defaults={providerDefaults} value={flatFromApp}>
                <NavigationProvider>
                    <Router routes={viewComponents} x404={PageNotFound} />
                </NavigationProvider>
            </ApplicationProvider>
        </React.StrictMode>
    );
}
