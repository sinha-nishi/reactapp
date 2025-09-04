import type { AppSetup } from '@/types/Setup';

export interface ReactApplicationAttributes {
    app?: Partial<AppSetup>;
    strictValidation?: boolean;
}
