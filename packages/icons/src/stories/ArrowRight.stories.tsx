// src/stories/Icons.stories.tsx
import { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRightIcon } from "../ArrowRight";

const meta: Meta<typeof ArrowRightIcon> = {
  title: "Icons/Right",
  component: ArrowRightIcon,
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
type Story = StoryObj<typeof ArrowRightIcon>;

export const Default: Story = {
  args: {
    size: 24,
    color: "#4A90E2",
    variant: "outlined",
  },
};

export const Filled: Story = {
  args: {
    size: 24,
    color: "rgba(22, 171, 111, 1)",
    variant: "filled",
  },
};
