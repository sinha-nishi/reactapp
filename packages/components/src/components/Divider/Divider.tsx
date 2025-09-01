import React from "react";
import "./divider.css";

export interface DividerProps {
  dashed?: boolean;
  align?: "left" | "center" | "right" | "top" | "middle" | "bottom";
  className?: string;
  style?: React.CSSProperties;
}

export function Divider({
  dashed = false,
  align = "center",
  className = "",
  style,
}: DividerProps) {
  return (
    <div
      className={`divider divider-horizontal 
        ${align ? `divider-horizontal-${align}` : ""} 
        ${dashed ? "divider-dashed" : ""} 
        ${className}`}
      style={style}
    />
  );
}
