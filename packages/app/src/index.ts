import { bus } from '@pkvsinha/react-integrate';

export { render } from './browser';
export { ReactApplication } from './ReactApplication';
export * from './utils/ErrorBoundary';

export * from "@pkvsinha/react-base";
export * from "@pkvsinha/react-integrate";
export * from "@pkvsinha/react-components";
export * from "@pkvsinha/react-hooks";
export * from "@pkvsinha/react-icons";
export * from "@pkvsinha/react-layout";
export * from "@pkvsinha/react-navigate";
export * from "@pkvsinha/react-widgets";

export type * from "./@types";

export const enableAuth = () => {
    bus.use((cmd, next) => {
        if (cmd.type === "navigate" && cmd.target === "/admin") {
            console.log("redirecting to login");
            // if (!isLoggedIn()) {
            //     console.warn("Redirecting to /login instead of /admin");
            //     next({ type: "navigate", target: "/login" });
            //     return;
            // }
        }
        next(cmd);
    });
}

export const enableTransitions = () => {
    bus.use(async (cmd, next) => {
        if (cmd.type === "navigate") {
            console.log("showing the loader to login");
            // showLoadingSpinner();
            // await fakeDelay(500); // simulate fetch or animation
            // hideLoadingSpinner();
        }
        next(cmd);
    });
}