import { CssBuilder } from "../builder/core";
import type { StyleOptions } from "../@types/styleOptions";
import { settingsPlugin } from "./settings";
import { toolsPlugin } from "./tools";
import { genericPlugin } from "./generic";
import { elementsPlugin } from "./elements";
import { objectsPlugin } from "./objects";
import { componentsPlugin } from "./components";
import { utilitiesPlugin } from "./utilities";
import { compatTailwindPlugin } from "../compat";

export function createThemeBuilder(opts?: StyleOptions) {
  const builder = new CssBuilder({ prefix: opts?.prefix || "" });
  opts?.layers?.settings === false ? null : builder.use(settingsPlugin(opts));
  opts?.layers?.tools === false ? null : builder.use(toolsPlugin(opts));
  opts?.layers?.generic === false ? null : builder.use(genericPlugin(opts));
  opts?.layers?.elemets === false ? null : builder.use(elementsPlugin(opts));
  opts?.layers?.objects === false ? null : builder.use(objectsPlugin(opts));
  opts?.layers?.components === false
    ? null
    : builder.use(componentsPlugin(opts));
  opts?.layers?.utilites === false ? null : builder.use(utilitiesPlugin(opts));

  if ((opts as any)?.compat?.tailwind) {
    console.log(
      "found compat tailwind config in config: ",
      (opts as any).compat.tailwind,
    );
    builder.use(compatTailwindPlugin((opts as any).compat.tailwind));
  }

  return builder;
}
