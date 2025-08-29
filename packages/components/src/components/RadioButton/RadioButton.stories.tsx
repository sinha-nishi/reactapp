import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import RadioButton from "./RadioButton";

const meta: Meta<typeof RadioButton> = {
  title: "Components/RadioButton",
  component: RadioButton,
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof RadioButton>;

export const Default: Story = {
  args: {
    name: "example",
    label: "Option A",
    value: "A",
  },
};

export const Group: Story = {
  render: () => {
    const [selected, setSelected] = useState("A");
    return (
      <div>
        <RadioButton
          name="group1"
          label="Option A"
          value="A"
          checked={selected === "A"}
          onChange={setSelected}
        />
        <RadioButton
          name="group1"
          label="Option B"
          value="B"
          checked={selected === "B"}
          onChange={setSelected}
        />
        <RadioButton
          name="group1"
          label="Option C"
          value="C"
          checked={selected === "C"}
          onChange={setSelected}
        />
        <p>Selected: {selected}</p>
      </div>
    );
  },
};

export const States: Story = {
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <RadioButton name="demo" label="Default" value="A" />
        <RadioButton name="demo" label="Checked" value="B" checked />
        <RadioButton name="demo" label="Disabled" value="C" disabled />
        <RadioButton name="demo" label="ReadOnly" value="D" readOnly />
        <RadioButton name="demo" label="Error" value="E" error />
      </div>
    ),
  };
