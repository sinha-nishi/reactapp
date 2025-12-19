import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { ThemeName } from "../@types";
import { ThemeProvider as ThemeProviderClass } from "../ThemeProvider";

const ThemeCtx = createContext<ThemeProviderClass | null>(null);

export function ThemeProvider({
  value,
  applyToDocument = true,
  children,
}: {
  value: ThemeProviderClass;
  applyToDocument?: boolean;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (applyToDocument) value.applyToDocument(document);
    const unsub = value.subscribe(() => {
      if (applyToDocument) value.applyToDocument(document);
    });
    return () => {
      unsub();
    };
  }, [value, applyToDocument]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useThemeProvider() {
  const ctx = useContext(ThemeCtx);
  if (!ctx)
    throw new Error("useThemeProvider must be used inside <ThemeProvider />");
  return ctx;
}

export function useThemeName(): [ThemeName, (t: ThemeName) => void] {
  const tp = useThemeProvider();

  const themeName = useSyncExternalStore(
    (cb) => tp.subscribe(() => cb()),
    () => tp.getThemeName(),
    () => tp.getThemeName(), // SSR fallback
  );

  return [themeName, (t) => tp.setThemeName(t)];
}

// const primary = useToken("colors.primary");
export function useToken(publicPath: string) {
  const tp = useThemeProvider();
  const [themeName] = useThemeName();

  return useMemo(
    () => tp.computedPublic(publicPath, document),
    [tp, themeName, publicPath],
  );
}

// const ring = useVarRef("colors.focusRing");
export function useVarRef(publicPath: string) {
  const tp = useThemeProvider();
  return useMemo(
    () => tp.getLoadedTheme().varRefPublic(publicPath),
    [tp, publicPath],
  );
}
