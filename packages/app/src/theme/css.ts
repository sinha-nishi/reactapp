import { createThemeBuilder } from "@pkvsinha/react-theme";
import { basePlugin } from "@pkvsinha/react-base";
import { layoutPlugin } from "@pkvsinha/react-layout";
import { componentsPlugin } from "@pkvsinha/react-components";
import { widgetsPlugin } from "@pkvsinha/react-widgets";

// Default theme (pkv.app.*)
// const app = createThemeBuilder().use(basePlugin()).use(layoutPlugin()).use(componentsPlugin()).use(widgetsPlugin());
const app = createThemeBuilder();
// Material preset
const material = createThemeBuilder({
  tokens: {
    "color-primary-500": "#6750A4",
    "radius-md": "12px",
  },
})
  .use(basePlugin())
  .use(layoutPlugin())
  .use(componentsPlugin())
  .use(widgetsPlugin());

// Ant-like preset
const ant = createThemeBuilder({
  tokens: {
    "color-primary-500": "#1677ff",
    "radius-md": "6px",
  },
})
  .use(basePlugin())
  .use(layoutPlugin())
  .use(componentsPlugin())
  .use(widgetsPlugin());

export { app, ant };
