import type { Meta, StoryObj } from "@storybook/react-vite";
import Toolbar from "./Toolbar";
import React from "react";

const meta: Meta<typeof Toolbar> = {
  title: "Components/Toolbar",
  component: Toolbar,
  argTypes: {
    variant: {
      control: "select",
      options: ["flat", "elevated", "bordered", "transparent"],
    },
    align: {
      control: "select",
      options: ["left", "center", "right", "space-between"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Toolbar>;

export const Default: Story = {
  args: {
    children: (
      <>
        <span>Logo</span>
        <button>Login</button>
      </>
    ),
    variant: "flat",
    align: "space-between",
  },
};

export const WithSearch: Story = {
  args: {
    children: (
      <>
        <span style={{ fontWeight: 600 }}>My App</span>
        <input type="text" placeholder="Search..." />
        <button>Go</button>
      </>
    ),
    variant: "elevated",
    align: "space-between",
  },
};

export const Centered: Story = {
  args: {
    children: <span>Centered Toolbar</span>,
    variant: "bordered",
    align: "center",
  },
};

export const Transparent: Story = {
  args: {
    children: (
      <>
        <button>← Back</button>
        <span>Page Title</span>
        <button>Next →</button>
      </>
    ),
    variant: "transparent",
    align: "space-between",
  },
};
