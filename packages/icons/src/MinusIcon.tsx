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

export function MinusIcon({
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
      <path d="M96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320z" />
    </svg>
  );
}
