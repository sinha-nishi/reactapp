import type { Meta, StoryObj } from "@storybook/react-vite";
import NavigationDrawer from "../navDrawer/NavDrawer";

const meta: Meta<typeof NavigationDrawer> = {
  title: "Components/NavigationDrawer",
  component: NavigationDrawer,
};

export default meta;
type Story = StoryObj<typeof NavigationDrawer>;

export const LeftDrawer: Story = {
  args: {
    position: "left",
    links: [
      { label: "Home", href: "#" },
      { label: "About", href: "#" },
      { label: "Services", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
};

export const RightDrawer: Story = {
  args: {
    position: "right",
    links: [
      { label: "Dashboard", href: "#" },
      { label: "Profile", href: "#" },
      { label: "Settings", href: "#" },
    ],
  },
};
