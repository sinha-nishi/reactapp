import React from "react";
import { Button, NavBar } from '@pkvsinha/react-components';
import { Container, Section } from '@pkvsinha/react-base';
import { useApplicationContext } from '@pkvsinha/react-hooks';

export default function DefaultComponentView() {
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
        {true && <Button label="App Bar" />}
        <div className="flex flex-col h-screen justify-center">
            <Container>
                <Section
                    style={{ height: "calc(100vh - 200px)", marginBottom: "100px" }}
                >
                    <span>A View Component</span>
                </Section>
            </Container>
      </div>
        {/* {children} */}
        {/* {context.appbar && <AppBar />}
     */}
    </>
}