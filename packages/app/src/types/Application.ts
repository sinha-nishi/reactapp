import type { AppContext } from '@pkvsinha/react-hooks';

export interface ReactApplicationAttributes {
    app?: Partial<AppContext>;
    strictValidation?: boolean;
}
