import type { ApplicationConfiguration } from '@/types/ApplicationConfiguration';

// App-level defaults live here (not in hooks)
export const applicationDefaults: Partial<ApplicationConfiguration> = {
  meta: { title: '' },
  title: '',
  brand: { name: '', logo: '' },
  home: undefined,
  config: {
    themes: {},
    images: {},
    shell: {
      navBar: { display: true, links: [] },
      appBar: { display: true, title: '', actions: [] },
      sideBar: { display: false, collapsed: false, sections: [] },
      footer: { display: false, text: '' },
      header: { display: false, text: '', logo: '' },
    }
  },
  views: [],
  ext: {},
};

