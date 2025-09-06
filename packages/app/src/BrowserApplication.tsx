import * as React from 'react';
import { createRoot } from "react-dom/client";
import { ReactApplication } from "./ReactApplication";
import { registerSW } from "./sw/register";
import type { ApplicationConfiguration } from './types/ApplicationConfiguration';
import { attachBrowserAdapter } from '@pkvsinha/react-navigate';

export function render(app: Partial<ApplicationConfiguration>, rootId: string, strictValidation?: boolean) {
  const rootElement = document.getElementById(rootId || "app");
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <ReactApplication app={app} strictValidation={strictValidation} />
    );
  }
  attachBrowserAdapter()
  registerSW();
}
