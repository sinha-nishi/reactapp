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

export function DropletIcon({
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
      <path d="M320 576C214 576 128 490 128 384C128 292.8 258.2 109.9 294.6 60.5C300.5 52.5 309.8 48 319.8 48L320.2 48C330.2 48 339.5 52.5 345.4 60.5C381.8 109.9 512 292.8 512 384C512 490 426 576 320 576zM240 376C240 362.7 229.3 352 216 352C202.7 352 192 362.7 192 376C192 451.1 252.9 512 328 512C341.3 512 352 501.3 352 488C352 474.7 341.3 464 328 464C279.4 464 240 424.6 240 376z" />
    </svg>
  );
}
