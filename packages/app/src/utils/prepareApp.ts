import {
  ApplicationConfiguration,
  RenderOptions,
} from "@/@types/ApplicationConfiguration";

type SimpleConfig = {
  brand: string;
  theme: string;
  view: string;
  contextPath: string;
};

const DefaultApplicationConfig: ApplicationConfiguration = {
  meta: {
    title: "React Application Builder",
  },
  contextPath: "/",
  config: {
    themes: {},
    images: {},
    shell: {
      navBar: { display: false, links: [] },
      appBar: {
        display: false,
        title: "React Application Builder",
        actions: [],
      },
      //   navBar: {
      //     render: () => <NavBar />,
      //     links: [
      //       { title: "Home", path: "home" },
      //       { title: "About", path: "about" },
      //       { title: "Blogs", path: "blogs" },
      //       { title: "Apps", path: "apps" },
      //       { title: "Guides", path: "guides" },
      //       { title: "AI", path: "ai" },
      //     ],
      //   },
    },
  },
  views: [
    {
      id: "home",
      meta: {
        title: "React App Builder",
      },
      appBar: {
        display: false,
      },
      navBar: {
        display: false,
      },
      //   type: "stackview",
      stack: ["carousel"],
      view: "Hello",
      layout: "stack",
    },
  ],
  title: "React App Builder",
  brand: {
    name: "React App Builder",
    logo: "",
  },
  //   ui: {
  //     transitions: [
  //       {
  //         from: "any",
  //         to: "any",
  //         run: function log() {},
  //       },
  //     ],
  //     state: {},
  //   },
  home: "home",
};

type AppConfig =
  | Partial<ApplicationConfiguration>
  | Partial<SimpleConfig>
  | undefined;

function isSimpleConfig(
  config: Partial<ApplicationConfiguration> | Partial<SimpleConfig> | undefined,
): config is Partial<SimpleConfig> {
  return (config as Partial<SimpleConfig>)?.view !== undefined;
}

function prepareView(app: Partial<SimpleConfig>) {
  return {
    id: "home",
    meta: {
      title: app?.brand || "React Application Builder",
    },
    appBar: {
      display: false,
    },
    navBar: {
      display: false,
    },
    //   type: "stackview",
    stack: ["carousel"],
    view: app.view || "Welcome to React Application Builder!",
    layout: "stack" as "stack",
  };
}

export function prepareApp(
  app?: AppConfig,
  options?: RenderOptions,
): ApplicationConfiguration {
  if (!app) {
    return { ...DefaultApplicationConfig };
  }
  if (isSimpleConfig(app)) {
    // Fill in the values from SimpleConfig to ApplicationConfiguration
    return {
      ...DefaultApplicationConfig,
      contextPath: app.contextPath || "/",
      views: [
        app?.view
          ? { ...prepareView(app) }
          : { ...DefaultApplicationConfig.views[0] },
      ],
    };
  }

  return {
    // Merge the provided ApplicationConfiguration with defaults
    ...DefaultApplicationConfig,
    ...app,
    contextPath: app.contextPath || "/",
    meta: {
      ...DefaultApplicationConfig.meta,
      ...(app?.meta ?? {}),
    },
    config: {
      ...DefaultApplicationConfig.config,
      ...(app?.config ?? {}),
    },
    brand: {
      ...DefaultApplicationConfig.brand,
      ...(app?.brand ?? {}),
    },
    views: app?.views ?? DefaultApplicationConfig.views,
    title: app?.title ?? DefaultApplicationConfig.title,
    home: app?.home ?? DefaultApplicationConfig.home,
  };
}
