import React from "react";
import { Button } from '@pkvsinha/react-components';
import { useApplicationContext } from "../hooks/useApplicationContext";

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
        {topNav && <Button />} 
        {appBar && <Button />}
        <span>This is a default View Component</span>
        {/* {children} */}
        {/* {context.appbar && <AppBar />}
     */}
    </>
}