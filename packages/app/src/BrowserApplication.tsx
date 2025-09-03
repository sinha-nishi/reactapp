import * as React from 'react';
import { createRoot } from "react-dom/client";
import { ReactApplication } from "./ReactApplication";
import { registerSW } from "./sw/register";
import type { AppSetup } from '@/types/Setup';

export function render(rootId: string, app: Partial<AppSetup>, strictValidation?: boolean) {
  const rootElement = document.getElementById(rootId);
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <ReactApplication app={app} strictValidation={strictValidation} />
    );
  }
  registerSW();
}
