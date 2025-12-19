import { CssBuilder } from "../core/builder";
import type { BuilderOptions } from "../@types/styleOptions";
import { settingsPlugin } from "../styles/settings";
import { toolsPlugin } from "../styles/tools";
import { genericPlugin } from "../styles/generic";
import { elementsPlugin } from "../styles/elements";
import { objectsPlugin } from "../styles/objects";
import { componentsPlugin } from "../styles/components";
import { utilitiesPlugin } from "../styles/utilities";
import { compatTailwindPlugin } from "../plugins/compat";
import { presetCollectorPlugin } from "../plugins";

export function createThemeBuilder(opts?: BuilderOptions) {
  const builder = new CssBuilder({ prefix: opts?.prefix || "" });

  // settings layer
  opts?.layers?.settings !== false &&
    builder.use(
      settingsPlugin(
        opts?.layers?.settings === true ? undefined : opts?.layers?.settings,
      ),
    );
  opts?.layers?.tools === false ? null : builder.use(toolsPlugin(opts));
  opts?.layers?.generic === false ? null : builder.use(genericPlugin(opts));
  opts?.layers?.elements === false ? null : builder.use(elementsPlugin(opts));
  opts?.layers?.objects === false ? null : builder.use(objectsPlugin(opts));

  // components layer
  opts?.layers?.components !== false && builder.use(componentsPlugin(opts));

  // utilities layer
  opts?.layers?.utilities !== false &&
    builder.use(
      utilitiesPlugin(
        opts?.layers?.utilities === true ? undefined : opts?.layers?.utilities,
      ),
    );

  if ((opts as any)?.compat?.tailwind) {
    console.log(
      "found compat tailwind config in config: ",
      (opts as any).compat.tailwind,
    );
    builder.use(compatTailwindPlugin((opts as any).compat.tailwind));
  }

  return builder;
}

export function createPresetBuilder(opts?: BuilderOptions) {
  const b = createThemeBuilder(opts)
    .setTokens(opts?.tokens)
    // .use(tailwindCompatPlugin({ tailwind: {} }))
    .use(presetCollectorPlugin({ presets: ["core", "ui"] }));

  // b.use(presetCollectorPlugin({ families: ["spacing", "typography"] }));

  //   b.use(presetCollectorPlugin({
  //   families: ["spacing"],
  //   classes: ["container", "ring", "md:hover:bg-primary"],
  // }));

  return b;
}
