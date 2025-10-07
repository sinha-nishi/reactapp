import { AppContext } from '@pkvsinha/react-hooks';
import type { ApplicationConfiguration } from './ApplicationConfiguration';

export interface ReactApplicationAttributes {
    init: AppContext;
    routes: any;
}
