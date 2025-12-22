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

export function PlusIcon({
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
      <path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z" />
    </svg>
  );
}
