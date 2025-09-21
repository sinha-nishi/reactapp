import * as React from 'react';
import { createRoot } from "react-dom/client";
import { ReactApplication } from "./ReactApplication";
import { registerSW } from "./sw/register";
import type { ApplicationConfiguration, RenderOptions } from './types/ApplicationConfiguration';
import { attachBrowserAdapter } from '@pkvsinha/react-navigate';
import { prepareApp } from './utils/prepareApp';


export function render(app?: Partial<ApplicationConfiguration>, options?: RenderOptions) {
  const rootElement = getRootElement(options);
  const root = createRoot(rootElement);
  const applicationConfig = prepareApp(app, options);
  console.log("Starting application with config:", applicationConfig);
  root.render(
    <ReactApplication app={applicationConfig} strictValidation={options?.strictValidation} />
  );
  attachBrowserAdapter(app?.contextPath);
  // registerSW();
}

function getRootElement(options: RenderOptions | undefined) {
  let rootElement = document.getElementById(options?.rootId || "root");
  if (!rootElement) {
    rootElement = document.getElementById("app");
  }

  if (!rootElement) {
    rootElement = document.createElement("div");
    rootElement.id = options?.rootId || "root";
    document.body.appendChild(rootElement);
  }
  return rootElement;
}

