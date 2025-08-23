import type { Meta, StoryObj } from "@storybook/react-vite";
import Menu from "./Menu";

const meta: Meta<typeof Menu> = {
  title: "Components/Menu",
  component: Menu,
  argTypes: {
    variant: {
      control: "select",
      options: ["button", "textfield", "icon", "selected-text"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Menu>;

export const ButtonMenu: Story = {
  args: {
    label: "Options",
    variant: "button",
    items: [
      { label: "Profile", onClick: () => alert("Profile clicked"), icon: "👤" },
      { label: "Settings", onClick: () => alert("Settings clicked"), icon: "⚙️" },
      { label: "Logout", onClick: () => alert("Logout clicked"), icon: "🚪" },
    ],
  },
};

export const IconMenu: Story = {
  args: {
    label: "Menu",
    variant: "icon",
    items: [
      { label: "Profile", icon: "👤" },
      { label: "Settings", icon: "⚙️" },
      { label: "Logout", icon: "🚪" },
    ],
  },
};

export const TextFieldMenu: Story = {
  args: {
    label: "Select option",
    variant: "textfield",
    items: [
      { label: "Profile", icon: "👤" },
      { label: "Settings", icon: "⚙️" },
    ],
  },
  tags: ['autodocs'],
};

export const SelectedTextMenu: Story = {
  args: {
    label: "Choose action",
    variant: "selected-text",
    items: [
      { label: "Edit",  },
      { label: "Delete",},
    ],
  },
};
