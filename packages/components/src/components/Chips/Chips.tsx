import React, { useState } from "react";
import "./Chips.css";

type ChipType = "assist" | "filter" | "input" | "suggestion";
type ChipState =
  | "enabled"
  | "hovered"
  | "focused"
  | "pressed"
  | "dragged"
  | "disabled";

interface ChipProps {
  label: string;
  type?: ChipType;
  state?: ChipState;
  selected?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  onDelete?: () => void;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLButtonElement>) => void;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  type = "assist",
  state = "enabled",
  selected = false,
  leadingIcon,
  trailingIcon,
  onDelete,
  onClick,
  className = "",
  style,
  draggable = false,
  onDragStart,
  onDrop,
}) => {
  const [isSelected, setIsSelected] = useState(selected);

  const handleClick = () => {
    if (state === "disabled") return;
    if (type === "filter") {
      setIsSelected(!isSelected);
    }
    onClick?.();
  };

  return (
    <button
      className={`chip chip-${type} chip-${state} 
        ${isSelected ? "chip-selected" : ""} ${className}`}
      style={style}
      onClick={handleClick}
      disabled={state === "disabled"}
      draggable={draggable}
      onDragStart={onDragStart}
      onDrop={onDrop}
      tabIndex={state !== "disabled" ? 0 : -1}
    >
      {leadingIcon && <span className="chip-icon">{leadingIcon}</span>}

      <span className="chip-label">{label}</span>

      {type === "input" && (
        <span className="chip-close" onClick={onDelete}>
          ✕
        </span>
      )}

      {trailingIcon && <span className="chip-icon">{trailingIcon}</span>}
    </button>
  );
};
