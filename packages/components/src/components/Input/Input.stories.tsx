import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "file"],
    },
    className: { control: "text" },
    disabled: { control: "boolean" },
    multiple: { control: "boolean" },
    title: { control: "text" },
    message: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Text: Story = {
  args: {
    type: "text",
    title: "Enter your name",
    message: "This is a text input",
    disabled: false,
    className: "custom-input",
    onClick: () => alert("Text input clicked"),
    onChange: () => alert("Text input changed"),
    accept: "",
    multiple: false,
  },
};

export const Email: Story = {
  args: {
    ...Text.args,
    type: "email",
    title: "Enter your email",
    message: "This is an email input",
  },
};

export const Password: Story = {
  args: {
    ...Text.args,
    type: "password",
    title: "Enter your password",
    message: "This is a password input",
  },
};

export const FileUpload: Story = {
  args: {
    type: "file",
    title: "Upload your file",
    message: "Choose a file to upload",
    accept: ".png,.jpg,.jpeg",
    multiple: true,
    disabled: false,
    className: "file-input",
    onClick: () => console.log("File input clicked"),
    onChange: () => console.log("File input changed"),
  },
};
