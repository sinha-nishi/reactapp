import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimePicker } from "../TimePicker";

const meta: Meta<typeof TimePicker> = {
  title: "Components/TimePicker",
  component: TimePicker,
  argTypes: {
    type: {
      control: { type: "radio" },
      options: ["dial", "input"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof TimePicker>;

export const DialMode: Story = {
    args: {
      type: "dial",
    },
  };
  
  export const InputMode: Story = {
    args: {
      type: "input",
    },
  };
