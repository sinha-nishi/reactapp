import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import List, { ListItem } from "./List";

// export default {
//   title: "Components/List",
//   component: List,
//   tags: ['autodocs'],
  
// };


const meta: Meta<typeof List> = {
  title: "Example/List",
  component: List,
  tags: ['autodocs'],
  
  }


export default meta;
type Story = StoryObj<typeof List>;

export const OneLine = () => (
  <List>
    <ListItem primary="Inbox" />
    <ListItem primary="Drafts" />
    <ListItem primary="Trash" />
  </List>
);

export const TwoLine = () => (
  <List>
    <ListItem primary="Brunch this weekend?" secondary="Ali Connors" variant="two-line" />
    <ListItem primary="Summer BBQ" secondary="to Alex, Scott, Jennifer" variant="two-line" />
  </List>
);

export const ThreeLine = () => (
  <List>
    <ListItem
      primary="Brunch this weekend?"
      secondary="Ali Connors"
      tertiary="I’ll be in your neighborhood doing errands this weekend. Do you want to hang out?"
      variant="three-line"
    />
  </List>
);

export const WithAvatar = () => (
  <List>
    <ListItem primary="John Doe" secondary="Developer" avatar="https://i.pravatar.cc/40" variant="two-line" />
    <ListItem primary="Jane Smith" secondary="Designer" avatar="https://i.pravatar.cc/41" variant="two-line" />
  </List>
);

export const WithRadio = () => {
  const [selected, setSelected] = useState("Inbox");
  return (
    <List>
      <ListItem
        primary="Inbox"
        withRadio
        checked={selected === "Inbox"}
        onChange={() => setSelected("Inbox")}
      />
      <ListItem
        primary="Drafts"
        withRadio
        checked={selected === "Drafts"}
        onChange={() => setSelected("Drafts")}
      />
    </List>
  );
};

export const WithSwitch = () => {
  const [checked, setChecked] = useState('Wi-Fi');
  return (
    <List>
      <ListItem primary="Wi-Fi" withSwitch checked={checked === 'Wi-Fi'} onChange={() => setChecked("Wi-Fi")} />
      <ListItem primary="Bluetooth" withSwitch checked={checked === 'Bluetooth'} onChange={() => setChecked("Bluetooth")} />
    </List>
  );
};

export const WithCheckBox = () => {
    const [wifi, setWifi] = useState(true);
    const [bluetooth, setBluetooth] = useState(false);
  
    return (
      <List>
        <ListItem primary="Wi-Fi" withCheckBox checked={wifi} onChange={setWifi} />
        <ListItem primary="Bluetooth" withCheckBox checked={bluetooth} onChange={setBluetooth} />
      </List>
    );
  };
  
  
