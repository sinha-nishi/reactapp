import React, { useState } from "react";
import { StoryFn, Meta } from "@storybook/react-vite";
import  Switch  from "./Switch";

export default {
  title: "Components/Switch",
  component: Switch,
} as Meta;

const Template: StoryFn<typeof Switch> = (args) => {
  const [checked, setChecked] = useState(args.checked || false);
  return <Switch {...args} checked={checked} onChange={setChecked} />;
};

export const Default = Template.bind({});
Default.args = {
  label: "Toggle me",
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  label: "Notifications",
  icon: <span style={{ fontSize: "12px" }}>🔔</span>,
};

export const SuccessOutline = Template.bind({});
SuccessOutline.args = {
  label: "Success",
  variant: "success",
  type: "outline",
};

export const ErrorSolid = Template.bind({});
ErrorSolid.args = {
  label: "Error",
  variant: "error",
  type: "solid",
};
