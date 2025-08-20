import type { Meta, StoryObj } from '@storybook/react-vite';
import DatePicker from "./";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["docked", "modal", "modal-input"],
    },
    mode: {
      control: "select",
      options: ["single", "range"],
    },
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Docked: Story = { args: { variant: "docked" } };
export const ModalSingle: Story = { args: { variant: "modal", mode: "single" } };
export const ModalRange: Story = { args: { variant: "modal", mode: "range" } };
export const ModalInputSingle: Story = {
  args: { variant: "modal-input", mode: "single" },
};

export const ModalInputRange: Story = {
  args: { variant: "modal-input", mode: "range" },
};
