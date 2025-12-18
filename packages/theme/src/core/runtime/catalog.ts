import type { RuleRegistry, EnumerateOptions } from "./RuleRegistry";
import { getSemanticColorKeys, semanticToColorKey } from "@/tokens/semantic";

type Theme = Record<string, any>;

export type CatalogPreset =
  | { type: "classes"; classes: string[] }                         // explicit list
  | { type: "families"; families: string[] }                       // enumerate via rules
  | { type: "preset"; name: string };                              // named preset

export type Catalog = {
  presets: Record<string, (theme: Theme) => CatalogPreset>;
  families?: Record<string, (theme: Theme) => string[]>;           // optional manual family lists
};

/**
 * Default catalog (safe by default):
 * - doesn't enumerate all colors
 * - uses semantic colors only
 */
export const defaultCatalog: Catalog = {
  presets: {
    core: () => ({
      type: "classes",
      classes: [
        "container",
        "block","inline-block","inline","hidden",
        "flex","inline-flex","grid",
        "text-sm","text-base","font-normal","font-semibold",
        "p-0","p-2","p-4","m-0","mt-2","mt-4",
        "rounded","border",
      ],
    }),

    // semantic UI preset: uses semantic colors from tokens
    ui: (theme) => {
      const colors = getSemanticColorKeys(theme).map(semanticToColorKey);
      const colorClasses = colors.flatMap((c) => [
        `text-${c}`,
        `bg-${c}`,
        `border-${c}`,
      ]);
      return {
        type: "classes",
        classes: [
          ...colorClasses,
          "ring","outline-none",
          "filter","blur-md",
        ],
      };
    },
  },
};
