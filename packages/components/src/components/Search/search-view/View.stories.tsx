import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import SearchView from "../search-view/View";

const meta: Meta<typeof SearchView> = {
  title: "Components/SearchView",
  component: SearchView,
};
export default meta;

type Story = StoryObj<typeof SearchView>;

export const Fullscreen: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [q, setQ] = useState("Eli");
    return (
      <SearchView
        open={open}
        variant="fullscreen"
        query={q}
        onQueryChange={setQ}
        onClose={() => setOpen(false)}
        results={[
          {
            id: "1",
            title: "Eli, me",
            subtitle: "Adopt a pup?",
            time: "8:22 AM",
            avatarFallback: "E",
            trailingIcon: <span>⭐</span>,
          },
          {
            id: "2",
            title: "Zita, Odette, Dagmar",
            subtitle: "Movie marathon",
            time: "7:15 AM",
            avatarFallback: "Z",
            trailingIcon: <span>⭐</span>,
          },
        ]}
      />
    );
  },
};

export const Docked: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [q, setQ] = useState("Eli");
    return (
      <SearchView
        open={open}
        variant="docked"
        query={q}
        onQueryChange={setQ}
        onClose={() => setOpen(false)}
        results={[
          {
            id: "1",
            title: "In, Aki",
            subtitle: "Museum field trip",
            time: "9:40 AM",
            avatarFallback: "I",
            trailingIcon: <span>⭐</span>,
          },
        ]}
      />
    );
  },
};
