import { compatPlugin, createThemeBuilder } from "@pkvsinha/react-theme";
import { basePlugin } from "@pkvsinha/react-base";
import { layoutPlugin } from "@pkvsinha/react-layout";
import { componentsPlugin } from "@pkvsinha/react-components";

const builder = createThemeBuilder({
  tokens: { "color-primary-500": "#16a34a" },
})
  .use(compatPlugin({ tailwind: true }))
  .use(basePlugin())
  .use(layoutPlugin({ container: "1280px" }))
  .use(componentsPlugin());

export const material = builder;
