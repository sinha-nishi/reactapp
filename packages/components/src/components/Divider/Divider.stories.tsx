import type { Meta, StoryObj } from "@storybook/react-vite";
import Divider from "./Divider";

const meta: Meta<typeof Divider> = {
  title: "Example/Divider",
  component: Divider,
  argTypes: {
    dashed: { control: "boolean" },
    align: {
      control: { type: "select" },
      options: ["left", "center", "right", "top", "middle", "bottom"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  args: {
    dashed: false,
    align: "center",
  },
};
