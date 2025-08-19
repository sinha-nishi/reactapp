import type { Meta, StoryObj } from '@storybook/react-vite';
import DatePicker from "./";

const meta: Meta<typeof DatePicker> = {
  title: "Example/DatePicker",
  component: DatePicker,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["docked", "modal", "modal-input"],
    },
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Docked: Story = { args: { variant: "docked" } };
export const Modal: Story = { args: { variant: "modal" } };
export const ModalInput: Story = { args: { variant: "modal-input" } };
