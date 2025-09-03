import React, { ReactNode } from "react";
import "./toolbar.css";

export type ToolbarVariant =
  | "flat"
  | "elevated"
  | "bordered"
  | "transparent"
  | "gradient"
  | "glass";

export type ToolbarAlign = "left" | "center" | "right" | "space-between";

interface ToolbarProps {
  children: ReactNode;
  variant?: ToolbarVariant;
  align?: ToolbarAlign;
  className?: string;
}

export function ToolBar({
  children,
  variant = "flat",
  align = "space-between",
  className = "",
}: ToolbarProps) {
  return (
    <div
      className={`toolbar toolbar-${variant} toolbar-${align} ${className}`}
    >
      {children}
    </div>
  );
}
