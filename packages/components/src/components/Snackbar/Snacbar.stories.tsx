// Snackbar.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { SnackbarProvider, useSnackbar } from "./Snacbar";

const meta: Meta = {
  title: "Components/Snackbar",
  component: SnackbarProvider,
};
export default meta;

const DemoPanel: React.FC = () => {
  const { enqueue } = useSnackbar();

  const fire = (variant: any, tone: any, msg = "Saved successfully!") => {
    enqueue({
      message: msg,
      variant,
      tone,
      actionLabel: "Undo",
      onAction: () => alert("Undo clicked"),
      dismissible: true,
      duration: 3500,
      valign: "bottom",
      halign: "center",
    });
  };

  return (
    <div style={{ display: "grid", gap: 8, gridAutoFlow: "row", alignItems: "start" }}>
      <button onClick={() => fire("neutral", "elevated", "Hello from Snackbar!")}>Neutral / Elevated</button>
      <button onClick={() => fire("success", "solid", "Changes saved!")}>Success / Solid</button>
      <button onClick={() => fire("error", "outline", "Failed to upload file")}>Error / Outline</button>
      <button onClick={() => fire("warning", "glass", "Low disk space")}>Warning / Glass</button>
      <button onClick={() => fire("info", "elevated", "New update available")}>Info / Elevated</button>
      <button
        onClick={() => {
          enqueue({
            message: (
              <span>
                <strong>Heads up:</strong> we’ll sign you out soon.
              </span>
            ),
            variant: "warning",
            tone: "solid",
            actionLabel: "Stay",
            onAction: () => alert("Staying signed in"),
            duration: 8000,
            valign: "top",
            halign: "end",
          });
        }}
      >
        Custom Content / Top-End
      </button>
      <button
        onClick={() => {
          enqueue({
            message: "Persistent snackbar (click × to close)",
            variant: "info",
            tone: "glass",
            duration: 0, // persistent
            valign: "bottom",
            halign: "start",
          });
        }}
      >
        Persistent
      </button>
    </div>
  );
};

export const Playground: StoryObj = {
  render: () => (
    <SnackbarProvider>
      <DemoPanel />
    </SnackbarProvider>
  ),
};
