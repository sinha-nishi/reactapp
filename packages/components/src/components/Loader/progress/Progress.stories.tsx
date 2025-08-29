import type { Meta, StoryObj } from "@storybook/react-vite";
import ProgressIndicator, {
  ProgressVariant,
} from "../progress/ProgressIndicator";
import React from "react";

const meta: Meta<typeof ProgressIndicator> = {
  title: "Components/ProgressIndicator",
  component: ProgressIndicator,
  argTypes: {
    variant: { control: "radio", options: ["linear", "circle"] },
    value: { control: "number", min: 0, max: 100 },
    size: { control: "number" },
    strokeWidth: { control: "number" },
    color: { control: "color" },
    trackColor: { control: "color" },
    showLabel: { control: "boolean" },
  },
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ProgressIndicator>;

export const Linear: Story = {
  args: { variant: "linear", value: 65 },
  decorators: [
    (Story) => (
      <div style={{ width: "300px" }}>
        <Story />
      </div>
    ),
  ],
};

export const Circle: Story = {
  args: { variant: "circle", value: 42, size: 100, strokeWidth: 10 },
};
export const Full: Story = {
  args: {
    variant: "circle",
    value: 100,
    size: 120,
    strokeWidth: 12,
    color: "#0B57D0",
  },
};
export const Empty: Story = {
  args: { variant: "linear", value: 0, color: "#E91E63" },
};
