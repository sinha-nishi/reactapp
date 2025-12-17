// src/stories/Icons.stories.tsx
import { Meta, StoryObj } from "@storybook/react-vite";
import { ImageIcon } from "../ImageIcons";

const meta: Meta<typeof ImageIcon> = {
  title: "Icons/Image",
  component: ImageIcon,
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
type Story = StoryObj<typeof ImageIcon>;

export const Default: Story = {
  args: {
    size: 48,
    color: "#4A90E2",
    variant: "outlined",
  },
};

export const Filled: Story = {
  args: {
    size: 48,
    color: "rgba(18, 18, 18, 1)",
    variant: "filled",
  },
};
