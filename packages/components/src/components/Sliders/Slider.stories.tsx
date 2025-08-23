// Slider.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import Slider from "./Slider";
import { useState } from "react";
import React from "react";

const meta: Meta<typeof Slider> = {
  title: "Components/Slider",
  component: Slider,
};
export default meta;

type Story = StoryObj<typeof Slider>;

export const Continuous: Story = {
  render: (args) => {
    const [val, setVal] = useState<number>(40);
    return (
      <div>
        <Slider {...args} value={val} onChange={(v) => setVal(v as number)} />
        <p>Current: {val}</p>
      </div>
    );
  },
  args: { variant: "continuous", min: 0, max: 100 },
};

export const Stepped: Story = {
  render: (args) => {
    const [val, setVal] = useState<number>(30);
    return (
      <div>
        <Slider {...args} value={val} onChange={(v) => setVal(v as number)} />
        <p>Current: {val}</p>
      </div>
    );
  },
  args: { variant: "stepped", step: 10, min: 0, max: 100 },
};

export const Range: Story = {
  render: (args) => {
    const [val, setVal] = useState<[number, number]>([0, 80]);
    return (
      <div>
        <Slider {...args} value={val} onChange={(v) => setVal(v as [number, number])} />
        <p>
          Current: {val[0]} – {val[1]}
        </p>
      </div>
    );
  },
  args: { variant: "range", min: 0, max: 100 },
};

export const Vertical: Story = {
  render: (args) => {
    const [val, setVal] = useState<number>(50);
    return (
      <div style={{ height: "200px" }}>
        <Slider {...args} value={val} onChange={(v) => setVal(v as number)} />
        <p>Current: {val}</p>
      </div>
    );
  },
  args: { variant: "vertical", min: 0, max: 100 },
};
