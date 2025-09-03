import * as React from 'react';
import { createRoot } from "react-dom/client";
import { View } from "./types/View";
import { ReactApplication } from "./ReactApplication";
import { registerSW } from "./sw/register";
import type { AppContext } from '@pkvsinha/react-hooks';

export function render(
  rootId: string,
  views: View[],
  home: string,
  app?: Partial<AppContext>,
  appDefaults?: Partial<AppContext>
) {
  const rootElement = document.getElementById(rootId);
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <ReactApplication
        views={views}
        home={home}
        theme={{ primaryColor: 'red' }}
        app={app}
        appDefaults={appDefaults}
      />
    );
  }
  registerSW();
}
