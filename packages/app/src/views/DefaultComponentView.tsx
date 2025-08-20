import React from "react";
import { Button, NavBar, AppBar } from '@pkvsinha/react-components';
import { Container, Section } from '@pkvsinha/react-base';
import { useApplicationContext } from '@pkvsinha/react-hooks';

export default function DefaultComponentView({ children }: { children: React.ReactNode }) {
    // const navigation = useNavigation();
    // const view = useView();
    // const appbar = useAppBar();
    const { value, topNav, appBar } = useApplicationContext();

    /**
     * <Navigation />
     * <View />
     * <AppBar />
     * <Footer />
     */
    return <>
        {true && <NavBar />}
        {true && <AppBar text="App Bar" />}
        <div className="flex flex-col h-screen justify-center">
            <Container>
                <Section
                    style={{ height: "calc(100vh - 200px)", marginBottom: "100px" }}
                >
                    {children}
                </Section>
            </Container>
      </div>
        {/* {children} */}
        {/* {context.appbar && <AppBar />}
     */}
    </>
}