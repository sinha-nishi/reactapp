import React from "react";
import { createRoot } from "react-dom/client";
import { View } from "./types/View";
import { ReactApplication } from "./ReactApplication";
import { registerSW } from "./sw/register";

export function render(rootId: string, views: View[], home: string) {
  const rootElement = document.getElementById(rootId);
  if (rootElement) {
    const app = createRoot(rootElement);
    app.render(
      <ReactApplication views={views} home={home} theme={{ primaryColor: 'red' }} />
    );
  }
  registerSW();
}

