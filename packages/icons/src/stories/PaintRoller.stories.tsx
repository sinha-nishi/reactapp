// Notification.stories.tsx
import React from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { PaintRollerIcon } from "../PaintRoller";

const meta: Meta<typeof PaintRollerIcon> = {
  title: "Icons/PaintRollerIcon",
  component: PaintRollerIcon,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: { control: "number" },
    color: { control: "color" },
    strokeWidth: { control: "number" },
    variant: {
      control: "radio",
      options: ["outlined", "filled"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof PaintRollerIcon>;

export const Outlined: Story = {
  args: {
    size: 24,
    color: "#4A90E2",
    strokeWidth: 2,

    variant: "outlined",
  },
};

export const Filled: Story = {
  args: {
    size: 24,
    color: "#4A90E2",
    strokeWidth: 2,
    variant: "filled",
  },
};
