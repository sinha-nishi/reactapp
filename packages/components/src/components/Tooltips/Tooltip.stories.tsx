import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import Tooltip from "./";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Plain: Story = {
  render: () => (
    <Tooltip type="plain" content="Plain tooltip">
      <button>Hover me</button>
    </Tooltip>
  ),
};

export const Rich: Story = {
  render: () => (
    <Tooltip
      type="rich"
      title="Rich tooltip"
      description="Rich tooltips bring attention to a particular element or feature that warrants the user’s focus. It supports multiple lines of informational text."
      action={<a href="#">Action</a>}
    >
      <button>Hover me</button>
    </Tooltip>
  ),
};

export const Positions: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "50px", justifyContent: "center", marginTop: "100px" }}>
      <Tooltip type="plain" content="Top tooltip" position="top"><button>Top</button></Tooltip>
      <Tooltip type="plain" content="Right tooltip" position="right"><button>Right</button></Tooltip>
      <Tooltip type="plain" content="Bottom tooltip" position="bottom"><button>Bottom</button></Tooltip>
      <Tooltip type="plain" content="Left tooltip" position="left"><button>Left</button></Tooltip>
    </div>
  ),
};
