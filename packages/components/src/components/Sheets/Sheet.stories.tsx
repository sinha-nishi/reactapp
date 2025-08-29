import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import Sheet from "./Sheets";

const meta: Meta<typeof Sheet> = {
  title: "Components/Sheet",
  component: Sheet,
};
export default meta;

type Story = StoryObj<typeof Sheet>;

const Template = (args: any) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open Sheet</button>
      <Sheet {...args} open={open} onClose={() => setOpen(false)}>
        <h2 style={{color:'blue'}}>Sheet Content</h2>
        <p>This is a {args.position} sheet with {args.size} size and {args.variant} variant.</p>
      </Sheet>
    </>
  );
};

export const Right: Story = {
  render: (args) => <Template {...args} />,
  args: { position: "right", size: "md", variant: "default" },
};

export const Left: Story = {
  render: (args) => <Template {...args} />,
  args: { position: "left", size: "lg", variant: "outlined" },
};

export const Top: Story = {
  render: (args) => <Template {...args} />,
  args: { position: "top", size: "full", variant: "glass" },
};

export const Bottom: Story = {
  render: (args) => <Template {...args} />,
  args: { position: "bottom", size: "sm", variant: "default" },
};
