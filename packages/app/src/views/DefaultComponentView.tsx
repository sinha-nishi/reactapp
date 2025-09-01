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
    // const navigation = useNavigation();
    // const view = useView();
    // const appbar = useAppBar();
    const { value, topNav, appBar } = useApplicationContext();

    React.useEffect(() => {
        document.title = view.meta?.title || "";
    }, [])

    /**
     * <Navigation />
     * <View />
     * <AppBar />
     * <Footer />
     */
    return <>
        {view.navBar?.display === false ? null : <NavBar links={[{ href: "/", label: "Home", icon: "🏠" }]} />}
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