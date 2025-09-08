import type { ApplicationConfiguration } from './ApplicationConfiguration';

export interface ReactApplicationAttributes {
    app?: Partial<ApplicationConfiguration>;
    strictValidation?: boolean;
}
