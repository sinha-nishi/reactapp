import * as React from 'react';
import { Button, NavBar, AppBar } from '@pkvsinha/react-components';
import { Container, Section } from '@pkvsinha/react-base';
import { useApplicationContext } from '@pkvsinha/react-hooks';
import { View } from "@/types/View";

interface DefaultComponentViewAttributes {
    view: View;
    children: React.ReactNode;
}

export function DefaultComponentView({ children, view }: DefaultComponentViewAttributes) {
    const app = useApplicationContext();

    React.useEffect(() => {
        document.title = view.meta?.title || "";
    }, [view.meta?.title]);

    const navRenderComponent = React.useMemo(() => {
        return app.navBar?.render ? app.navBar?.render() : null;
    }, [app]);

    const navLinks = React.useMemo(() => {
        const links = app?.navBar?.links ?? app?.navBar?.links ?? [];
        return (links as any[]).map((ln: any) => ({
            href: typeof ln?.path === 'string' ? (ln.path.startsWith('/') || ln.external ? ln.path : `/${ln.path}`) : '/',
            label: ln?.title ?? ln?.path ?? '',
            icon: ln?.icon ?? '',
        }));
    }, [app]);

    return <>
        {
            view.navBar?.display === false ? null :
                navRenderComponent ? navRenderComponent : 
                    <NavBar links={navLinks} logo={(app as any)?.brandLogo} logoAlt={(app as any)?.brandName} />
        }
        {view.appBar?.display === false ? null : <AppBar text={view.appBar?.title || ""} />}
        <div className="flex flex-col h-screen justify-center">
            <Container>
                <Section
                    style={{ height: "calc(100vh - 200px)", marginBottom: "100px" }}
                >
                    {children}
                </Section>
            </Container>
      </div>
    </>
}
