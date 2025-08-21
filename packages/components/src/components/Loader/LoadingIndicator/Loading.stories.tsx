import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import AuroraLoader from "./Loading";

const meta: Meta<typeof AuroraLoader> = {
  title: "Components/AuroraLoader",
  component: AuroraLoader,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "number" },
    strokeWidth: { control: "number" },
    color: { control: "color" },
    trackColor: { control: "color" },
    speed: { control: "number" },
    text: { control: "text" },
    glow: { control: "boolean" },
  },
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof AuroraLoader>;

export const Default: Story = {
  args: { text: "Loading…", size: 72, color: "#6750A4", strokeWidth: 6, glow: true },
};
export const Dense: Story = {
  args: { text: "Syncing", size: 56, strokeWidth: 8, speed: 1.2, color: "#386A20" },
};
export const Quiet: Story = {
  args: { text: "Please wait", size: 64, color: "#1D1B20", trackColor: "rgba(0,0,0,0.08)", glow: false },
};
export const LabelOff: Story = {
  args: { text: "", size: 80, color: "#0B57D0" },
};
