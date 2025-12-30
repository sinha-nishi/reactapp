// src/icons/FileIcon.tsx
import * as React from "react";

// src/icons/Icon.types.ts
export type IconProps = {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  variant?: "outlined" | "filled";
  className?: string;
};

export function CompassIcon({
  size = 24,
  color = "#4A90E2",
  strokeWidth = 2,
  variant = "outlined",
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      fill={variant === "filled" ? color : "none"}
      stroke={variant === "outlined" ? color : "none"}
      strokeWidth={strokeWidth}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
    >
      <path d="M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zm50.7-186.9L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
    </svg>
  );
}
