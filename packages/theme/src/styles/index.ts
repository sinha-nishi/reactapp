import { CssBuilder } from "@/builder/core";
import type { StyleOptions } from "../@types/styleOptions";
import { settingsPlugin } from "./settings";
import { toolsPlugin } from "./tools";
import { genericPlugin } from "./generic";
import { elementsPlugin } from "./elements";
import { objectsPlugin } from "./objects";
import { componentsPlugin } from "./components";
import { utilitiesPlugin } from "./utilities";

export function createThemeBuilder(opts?: StyleOptions) {
  const builder = new CssBuilder({ prefix: "pkv" });
  return builder
    .use(settingsPlugin(opts))
    .use(toolsPlugin(opts))
    .use(genericPlugin(opts))
    .use(elementsPlugin(opts))
    .use(objectsPlugin(opts))
    .use(componentsPlugin(opts))
    .use(utilitiesPlugin(opts));
}
