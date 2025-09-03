import { MetaAttributes } from "./MetaAttributes";
import { Routes } from "./Routes";
import { Theme } from "./Theme";
import { View } from "./View";
import type { AppContext } from '@pkvsinha/react-hooks';

export interface ReactApplicationAttributes {
    meta?: MetaAttributes;
    routes?: Routes,
    theme: Theme,
    children?: React.ReactNode;
    view?: View;
    views: View[];
    home?: string;
    navbar?: any[];
    footer?: any[];
    banner?: any[];
    app?: Partial<AppContext>;
    appDefaults?: Partial<AppContext>;
}
