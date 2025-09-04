import type { AppSetup } from '@/types/Setup';

// App-level defaults live here (not in hooks)
export const applicationDefaults: Partial<AppSetup> = {
  meta: { title: '' },
  title: '',
  brand: { name: '', logo: '' },
  home: undefined,
  config: {
    theme: {},
    images: {},
    navBar: { display: true, links: [] },
    appBar: { display: true, title: '', actions: [] },
    sideBar: { display: false, collapsed: false, sections: [] },
    footer: { display: false, text: '' },
    header: { display: false, text: '', logo: '' },
  },
  views: [],
  ext: {},
};

