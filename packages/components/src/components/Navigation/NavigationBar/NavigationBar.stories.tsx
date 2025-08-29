import type { Meta, StoryObj } from "@storybook/react-vite";
import NavBar, { MenuLinkAttributes } from "./NavBar";
import React from "react";

const meta: Meta<typeof NavBar> = {
  title: "Components/NavBar",
  component: NavBar,
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;

type Story = StoryObj<typeof NavBar>;

const defaultLinks: MenuLinkAttributes[] = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/blogs", label: "Blogs", icon: "✍️" },
  { href: "/ai", label: "AI", icon: "🤖" },
  { href: "/apps", label: "Apps", icon: "📱" },
  { href: "/gallery", label: "Gallery", icon: "🖼️" },
  { href: "/guides", label: "Guides", icon: "📘" },
];

export const Default: Story = {
  render: () => <NavBar links={defaultLinks} logo="https://via.placeholder.com/100x40" />,
};

export const NavBarTop: Story = {
  render: () => <NavBar position="top" links={defaultLinks} logo="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg" />,
};

export const NavBarBottom: Story = {
  render: () => <NavBar position="bottom" links={defaultLinks} logo="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg" />,
};
