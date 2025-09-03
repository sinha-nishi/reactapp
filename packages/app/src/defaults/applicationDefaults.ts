import type { AppContext } from '@pkvsinha/react-hooks';

// App-level defaults live here (not in hooks)
export const applicationDefaults: Partial<AppContext> = {
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
  ui: { transitions: [], state: {} },
  ext: {},
};

