import React from "react";
import { Button } from '@pkvsinha/react-components';
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
        {true && <Button label="Nav Top" />} 
        {true && <Button label="App Bar" />}
        <span>A default View Component</span>
        {/* {children} */}
        {/* {context.appbar && <AppBar />}
     */}
    </>
}