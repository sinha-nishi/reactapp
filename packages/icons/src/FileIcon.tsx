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

export function FileIcon({
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
      <path d="M192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 234.5C512 217.5 505.3 201.2 493.3 189.2L386.7 82.7C374.7 70.7 358.5 64 341.5 64L192 64zM453.5 240L360 240C346.7 240 336 229.3 336 216L336 122.5L453.5 240z" />
    </svg>
  );
}
