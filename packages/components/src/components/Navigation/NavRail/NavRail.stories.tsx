import type { Meta, StoryObj } from "@storybook/react-vite";
import NavigationRail from "./NavigationRail";
import React from "react";

const meta: Meta<typeof NavigationRail> = {
  title: "Components/NavigationRail",
  component: NavigationRail,
  argTypes: {
    expanded: {
      control: { type: "boolean" },
      description: "Toggle between expanded and collapsed state",
    },
    position: {
      control: { type: "radio" },
      options: ["left", "right"],
      description: "Position of the Navigation Rail",
    },
    defaultActive: {
      control: { type: "text" },
      description: "Default active item key",
    },
  },
  args: {
    items: [
      { key: "home", label: "Home", icon: "🏠" },
      { key: "search", label: "Search", icon: "🔍" },
      { key: "fav", label: "Favorites", icon: "❤️" },
      { key: "profile", label: "Profile", icon: "👤" },
    ],
    defaultActive: "home",
    position: "left",
    expanded: false,
    footerItem: { key: "settings", label: "Settings", icon: "⚙️" },
  },
};
export default meta;

type Story = StoryObj<typeof NavigationRail>;

export const Collapsed: Story = {
  args: {
    expanded: false,
  },
};

export const Expanded: Story = {
  args: {
    expanded: true,
  },
};
