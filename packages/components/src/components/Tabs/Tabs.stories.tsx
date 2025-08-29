import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import Tabs, { TabItem } from "./Tabs";

const meta: Meta = {
  title: "Components/Tabs",
  component: Tabs,
};
export default meta;

const items: TabItem[] = [
  { label: "Home", icon:<span>🏠</span> },
  { label: "Profile",},
  { label: "Settings",},
];

export const Default: StoryObj = {
  render: () => <Tabs items={items} />,
};

export const Pills: StoryObj = {
  render: () => <Tabs items={items} variant="pills" />,
};

export const Underline: StoryObj = {
  render: () => <Tabs items={items} variant="underline" />,
};

export const Vertical: StoryObj = {
  render: () => <Tabs items={items} orientation="vertical" variant="pills" />,
};
