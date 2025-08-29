import type { Meta, StoryObj } from "@storybook/react-vite";
import  Checkbox  from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: ["default", "primary", "success", "danger"],
    },
    disabled: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: "Default Checkbox",
    size: "md",
    variant: "default",
    defaultChecked: false, // ✅ will toggle by itself
  },
};

export const Primary: Story = {
  args: {
    label: "Primary Checkbox",
    size: "md",
    variant: "primary",
  },
};

export const Success: Story = {
  args: {
    label: "Success Checkbox",
    defaultChecked: true, // ✅ starts as checked
    variant: "success",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Checkbox",
    disabled: true,
    defaultChecked: true,
  },
};
