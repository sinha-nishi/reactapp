export * from "./scales";

import radixPack from "./radix.json";
import { loadTheme } from "./load";
import type { LoadedTheme, ThemeName } from "../@types";

export const packs: Record<string, LoadedTheme> = {
  radix: loadTheme(radixPack as any),
};
