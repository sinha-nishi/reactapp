import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import Dialog from "./Dialog";

const meta: Meta<typeof Dialog> = {
  title: "Example/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  argTypes: {
    showCloseButton: {
      control: { type: "boolean" }, // ✅ boolean toggle in Docs/Controls
      defaultValue: true,
    },
    size: {
      control: { type: "select" }, // ✅ size toggle as radio buttons
      options: ["sm", "md", "lg"],
      defaultValue: "md",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  args: {
    showCloseButton: true, // 👈 default value (Docs me toggle ho jayega)
    size: "md",
  },
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <div style={{ padding: "40px" }}>
        <button onClick={() => setOpen(true)}>Open Dialog</button>
        <Dialog
          {...args}
          open={open}
          title="User Profile"
          onClose={() => setOpen(false)}
          body={<p>This is the body content of the dialog.</p>}
          footer={
            <>
              <button className="dialog-button" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="dialog-button primary">Save</button>
            </>
          }
        />
      </div>
    );
  },
};
