import { bus } from './EventBus';

export * from './EventBus';
export * from './Registry';
export * from './types';


export const enableLogging = () => {
    console.log("[NAVIGATION] Logging enabled");
    bus.use(async (cmd, next) => {
        console.log("[NAVIGATION CMD]", cmd);
        await next(cmd);
    });
}