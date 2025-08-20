import { MetaAttributes } from "./MetaAttributes";
import { Routes } from "./Routes";
import { Theme } from "./Theme";
import { View } from "./View";

export interface ReactApplicationAttributes {
    topLevelNavigation?: React.ReactNode;
    meta: MetaAttributes;
    routes: Routes,
    theme: Theme,
    children?: React.ReactNode;
    view?: View;
    views: View[];
    navbar: any[];
    footer: any[];
    banner: any[];
}