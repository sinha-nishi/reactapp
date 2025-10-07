import * as React from "react";
import {
  ApplicationProvider,
  deepMerge,
  validateAppContext,
} from "@pkvsinha/react-hooks";
import { NavigationProvider, Router } from "@pkvsinha/react-navigate";
import { DefaultComponentView } from "./views/DefaultComponentView";
import { ReactApplicationAttributes } from "./@types/Application";
import { PageNotFound } from "./views/PageNotFound";
import type { View } from "./@types/View";
import { applicationDefaults } from "./defaults/applicationDefaults";

export function ReactApplication({init, routes}: ReactApplicationAttributes): React.JSX.Element {

  console.log("init app = ", init);
  console.log("routes = ", routes);

  return (
    <React.StrictMode>
      <ApplicationProvider value={init}>
        <NavigationProvider>
          <Router routes={routes} x404={PageNotFound} />
        </NavigationProvider>
      </ApplicationProvider>
    </React.StrictMode>
  );
}
