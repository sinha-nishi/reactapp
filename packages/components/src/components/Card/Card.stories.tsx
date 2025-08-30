import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import   Card  from "./";

const meta = {
  title: "Example/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["elevated", "filled", "outlined"],
    },
    state: {
      control: "select",
      options: ["default", "hovered", "focused", "pressed", "dragged", "disabled"],
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof Card>;

export const Elevated: Story = {
  args: {
    variant: "elevated",
    children: (
      <>
        <h3>Elevated Card</h3>
        <p>This is an elevated card.</p>
        <button>Action</button>
      </>
    ),
  },
};

export const Filled: Story = {
  args: {
    variant: "filled",
    children: (
      <>
        <h3>Filled Card</h3>
        <p>This is a filled card with solid background.</p>
      </>
    ),
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
    children: (
      <>
        <h3>Outlined Card</h3>
        <p>This card has a border outline.</p>
      </>
    ),
  },
};

export const Hovered: Story = {
  args: {
    state: "hovered",
    children: (
      <>
        <h3>Hovered State</h3>
        <p>Card when hovered.</p>
      </>
    ),
  },
};

export const Focused: Story = {
  args: {
    state: "focused",
    children: (
      <>
        <h3>Focused State</h3>
        <p>Card when focused.</p>
      </>
    ),
  },
};

export const Pressed: Story = {
  args: {
    state: "pressed",
    children: (
      <>
        <h3>Pressed State</h3>
        <p>Card when pressed.</p>
      </>
    ),
  },
};

export const Dragged: Story = {
  args: {
    state: "dragged",
    children: (
      <>
        <h3>Dragged State</h3>
        <p>Card while being dragged.</p>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    state: "disabled",
    children: (
      <>
        <h3>Disabled Card</h3>
        <p>This card is disabled and non-interactive.</p>
      </>
    ),
  },
};

export const Combined: Story = {
  args: {
    variant: "outlined",
    state: "hovered",
    children: (
      <>
        <h3>Combined Example</h3>
        <p>Outlined card with hovered state.</p>
        <button onClick={() => alert("Clicked!")}>Click me</button>
      </>
    ),
  },
};

export const WithThumbnail: Story = {
    args: {
      variant: "elevated",
      children: (
        <>
          <img
            src="data:image/jpeg;base64,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"
            alt="avatar"
            style={{ borderRadius: "50%", marginBottom: "8px" }}
          />
          <h3>Card with Thumbnail</h3>
          <p>This card has an avatar/logo thumbnail.</p>
        </>
      ),
    },
  };
  
  export const WithImage: Story = {
    args: {
      variant: "outlined",
      children: (
        <>
          <img
            src="data:image/jpeg;base64,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"
            alt="sample"
            style={{ width: "100%", borderRadius: "4px" }}
          />
          <h3>Card with Image</h3>
          <p>This card has an illustration/photo.</p>
        </>
      ),
    },
  };
  
  export const WithVideo: Story = {
    args: {
      variant: "filled",
      children: (
        <>
          <video
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            controls
            style={{ width: "100%", borderRadius: "4px" }}
          />
          <h3>Card with Video</h3>
          <p>This card contains a video element.</p>
        </>
      ),
    },
  };
  
