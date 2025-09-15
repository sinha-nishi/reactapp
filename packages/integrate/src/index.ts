import { bus } from './EventBus';

export * from './EventBus';
export * from './Registry';

export const enableLogging = () => {
    bus.use((cmd, next) => {
        console.log("[NAVIGATION CMD]", cmd);
        next(cmd);
    });
}