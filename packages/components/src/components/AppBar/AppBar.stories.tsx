import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import AppBar from "./";

const meta = {
  title: "Example/AppBar",
  component: AppBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["search", "small", "medium", "large"],
    },
    headline: { control: "text" },
    subtitle: { control: "text" },
  },
} satisfies Meta<typeof AppBar>;

export default meta;
type Story = StoryObj<typeof AppBar>;

export const Search: Story = {
  args: {
    variant: "search",

    // ① Left (menu/back icon)
    leading: <span style={{ fontSize: "20px" }}>≡</span>,

    // ② Search input leading (search icon)
    searchLeading: <span style={{ fontSize: "18px" }}>🔍</span>,

    // ③ Search input box
    searchInput: (
      <input
        type="text"
        className="appbar__search"
        placeholder="Search product"
        style={{
          border: "none",
          outline: "none",
          flex: 1,
          background: "transparent",
          fontSize: "0.95rem",
        }}
      />
    ),

    // ⑤ Search input trailing (mic icon)
    searchTrailing: <span style={{ fontSize: "18px" }}>🎤</span>,

    // ④ Right side avatar
    trailing: (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "#6C5CE7",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
        }}
      >
        A
      </div>
    ),
  },
};


export const Small: Story = {
    args: {
      variant: "small",
      leading: <span style={{ fontSize: "20px" }}>←</span>,
      headline: "Headline",
      subtitle: "Subtitle",
      trailing: (
        <div style={{ display: "flex", gap: "16px" }}>
          <span style={{ fontSize: "20px" }}>🔍</span>
          <span style={{ fontSize: "20px" }}>📅</span>
        </div>
      ),
    },
  };

export const Medium: Story = {
  args: {
    variant: "medium",
    leading: <span>←</span>,
    headline: "Headline",
    subtitle: "Subtitle",
    trailing: (
      <div style={{ display: "flex", gap: "8px" }}>
        <span>🔍</span>
        <span>📅</span>
      </div>
    ),
  },
};

export const Large: Story = {
  args: {
    variant: "large",
    leading: <span>←</span>,
    headline: "Headline",
    subtitle: "Subtitle",
    trailing: (
      <div style={{ display: "flex", gap: "8px" }}>
        <span>🔍</span>
        <span>📅</span>
      </div>
    ),
  },
};
