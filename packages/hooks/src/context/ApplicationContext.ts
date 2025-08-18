import { createContext } from "react";

const AppContextState = {
    s: "hakk"
}

export const ApplicationContext = createContext(AppContextState);
