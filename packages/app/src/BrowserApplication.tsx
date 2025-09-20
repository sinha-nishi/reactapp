import * as React from 'react';
import { createRoot } from "react-dom/client";
import { ReactApplication } from "./ReactApplication";
import { registerSW } from "./sw/register";
import type { ApplicationConfiguration } from './types/ApplicationConfiguration';
import { attachBrowserAdapter } from '@pkvsinha/react-navigate';

type RenderOptions = {
  rootId?: string;
  strictValidation?: boolean;
}

function prepareApp(app?: Partial<ApplicationConfiguration>, options?: RenderOptions) {
  return app;
}

export function render(app?: Partial<ApplicationConfiguration>, options?: RenderOptions) {
  let rootElement = document.getElementById(options?.rootId || "root");
  if (!rootElement) {
    rootElement = document.getElementById("app");
  }
  if (!rootElement) {
    rootElement = document.createElement("div");
    rootElement.id = options?.rootId || "root";
    document.body.appendChild(rootElement);
  }
  const root = createRoot(rootElement);
  const applicationConfig = prepareApp(app, options);
  root.render(
    <ReactApplication app={applicationConfig} strictValidation={options?.strictValidation} />
  );
  attachBrowserAdapter()
  registerSW();
}
