import React from "react";
import { Button } from '@pkvsinha/react-components';

export default function DefaultComponentView() {
    // const navigation = useNavigation();
    // const view = useView();
    // const appbar = useAppBar();
    const { context, dispatch } = useAppContext();

    /**
     * <Navigation />
     * <View />
     * <AppBar />
     * <Footer />
     */
    return <>
        {context.navigation && <Button />} 
        {context.view && <Button />}
        {/* {context.appbar && <AppBar />}
     */}
    </>
}