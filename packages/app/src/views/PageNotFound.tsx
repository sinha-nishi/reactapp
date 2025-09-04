import * as React from 'react';
import { Button, NavBar, AppBar } from '@pkvsinha/react-components';
import { Container, Section } from '@pkvsinha/react-base';
import { useApplicationContext } from '@pkvsinha/react-hooks';
import { View } from "@/types/View";

interface DefaultComponentViewAttributes {
    view: View;
    children: React.ReactNode;
}

export function PageNotFound({ children, view }: DefaultComponentViewAttributes) {
    // const navigation = useNavigation();
    // const view = useView();
    // const appbar = useAppBar();
    // const { value, topNav, appBar } = useApplicationContext();

    // useEffect(() => {
    //     document.title = view.meta?.title || "";
    // }, [])

    /**
     * <Navigation />
     * <View />
     * <AppBar />
     * <Footer />
     */
    return <>
        <div className="flex flex-col h-screen justify-center">
            <Container>
                <Section
                    style={{ height: "calc(100vh - 200px)", marginBottom: "100px" }}
                >
                    Page not found
                </Section>
            </Container>
      </div>
    </>
}