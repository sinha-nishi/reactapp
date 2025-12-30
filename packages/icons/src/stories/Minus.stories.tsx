import React from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { MinusIcon } from "../MinusIcon";

const meta: Meta<typeof MinusIcon> = {
  title: "Icons/MinusIcon",
  component: MinusIcon,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: { control: "number" },
    color: { control: "color" },
    strokeWidth: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof MinusIcon>;

export const Default: Story = {
  args: {
    size: 24,
    color: "#4A90E2",
  },
};

export const Filled: Story = {
  args: {
    size: 24,
    color: "rgba(22, 171, 111, 1)",
    variant: "filled",
  },
};
