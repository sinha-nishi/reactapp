import React, { ReactNode } from "react";
import "./card.css";

type CardVariant = "elevated" | "filled" | "outlined";
type CardState =
  | "default"
  | "hovered"
  | "focused"
  | "pressed"
  | "dragged"
  | "disabled";

interface CardProps {
  variant?: CardVariant;
  state?: CardState;
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties; // 👈 add this
  draggable?: boolean; // 👈 new prop
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const Card: React.FC<CardProps> = ({
  variant = "elevated",
  state = "default",
  children,
  onClick,
  className = "",
  style,
  draggable = false,
  onDragStart,
  onDrop
}) => {
  return (
    <div
      className={`card ${variant} ${state} ${className}`}
      style={style} // 👈 pass to div
      onClick={state !== "disabled" ? onClick : undefined}
      tabIndex={state !== "disabled" ? 0 : -1}
      draggable={draggable} // 👈 enable drag
      onDragStart={onDragStart}
      onDrop={onDrop}
    >
      {children}
    </div>
  );
};
