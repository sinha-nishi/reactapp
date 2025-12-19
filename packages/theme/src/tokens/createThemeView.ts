import { LoadedTheme, ThemeName } from "../@types";

function makeProxy(getter: (path: string) => any, prefix = ""): any {
  return new Proxy(
    {},
    {
      get(_t, prop) {
        if (typeof prop !== "string") return undefined;
        if (prop === "$path") return prefix; // debug helper
        const next = prefix ? `${prefix}.${prop}` : prop;

        // allow calling as function: theme.vars("colors.primary")
        if (prop === "call" || prop === "apply") return undefined;

        // if accessed as a leaf, we still return a proxy; users can stringify if needed
        return makeProxy(getter, next);
      },
      // allow: String(theme.vars.colors.primary)
      getOwnPropertyDescriptor() {
        return { enumerable: true, configurable: true };
      },
    },
  );
}

export function createThemeView(tp: {
  loaded: LoadedTheme;
  getThemeName: () => ThemeName;
  computed: (publicPath: string) => string;
}) {
  const loaded = tp.loaded;

  const varsGetter = (path: string) => loaded.varRefPublic(path);
  const valGetter = (path: string) => tp.computed(path);

  const vars = makeProxy((p) => varsGetter(p));
  const val = makeProxy((p) => valGetter(p));

  // helper function access too:
  const varsFn = (p: string) => loaded.varRefPublic(p);
  const valFn = (p: string) => tp.computed(p);

  return { vars, val, varsFn, valFn };
}
