import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import Search from "../search-bar/Search";

const meta: Meta<typeof Search> = {
  title: "Components/Search",
  component: Search,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Search>;

const useSearchState = (initial = "") => {
  const [q, setQ] = useState(initial);
  return { q, setQ };
};

export const WithAvatar: Story = {
  render: () => {
    const { q, setQ } = useSearchState();
    return (
      <Search
        value={q}
        onChange={setQ}
        onSubmit={(v) => alert("Search: " + v)}
        avatarSrc="https://i.pravatar.cc/100?img=12"
        placeholder="Search people, files..."
      />
    );
  },
};

export const WithOneTrailingIcon: Story = {
  render: () => {
    const { q, setQ } = useSearchState();
    return (
      <Search
        value={q}
        onChange={setQ}
        placeholder="Search anything"
        trailingActions={[{ ariaLabel: "Voice search", icon: "mic", onClick: () => alert("Mic!") }]}
      />
    );
  },
};

export const WithTwoTrailingIcons: Story = {
  render: () => {
    const { q, setQ } = useSearchState();
    return (
      <Search
        value={q}
        onChange={setQ}
        placeholder="Search with filters"
        trailingActions={[
          { ariaLabel: "Filter", icon: "filter", onClick: () => alert("Filter") },
          { ariaLabel: "Settings", icon: "settings", onClick: () => alert("Settings") },
        ]}
      />
    );
  },
};

export const AvatarWithTrailingIcon: Story = {
  render: () => {
    const { q, setQ } = useSearchState();
    return (
      <Search
        value={q}
        onChange={setQ}
        avatarFallback="NS"
        placeholder="Search projects"
        trailingActions={[{ ariaLabel: "Filter", icon: "filter", onClick: () => alert("Filter") }]}
      />
    );
  },
};

