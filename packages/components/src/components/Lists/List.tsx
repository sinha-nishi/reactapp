import React from "react";
import "./list.css";

export type ListVariant = "one-line" | "two-line" | "three-line";

export interface ListItemProps {
  avatar?: string;
  primary: string;
  secondary?: string;
  tertiary?: string;
  variant?: ListVariant;
  withRadio?: boolean;
  withSwitch?: boolean;
  withCheckBox?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function ListItem({
  avatar,
  primary,
  secondary,
  tertiary,
  variant = "one-line",
  withRadio = false,
  withSwitch = false,
  checked = false,
  withCheckBox = false,
  onChange,
}: ListItemProps) {
  return (
    <li className={`list-item list-${variant}`}>
      {avatar && <img src={avatar} alt="avatar" className="list-avatar" />}
      <div className="list-content">
        <span className="list-primary">{primary}</span>
        {variant !== "one-line" && secondary && (
          <span className="list-secondary">{secondary}</span>
        )}
        {variant === "three-line" && tertiary && (
          <span className="list-tertiary">{tertiary}</span>
        )}
      </div>

      {withRadio && (
        <input
          type="radio"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
        />
      )}

      {withSwitch && (
        <label className="switch">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange?.(e.target.checked)}
          />
          <span className="slider"></span>
        </label>
      )}
      {withCheckBox && (
        <label className="checkbox">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange?.(e.target.checked)}
          />
          <span className="checkbox-box"></span>
        </label>
      )}
    </li>
  );
}

export interface ListProps {
  children: React.ReactNode;
}

export default function List({ children }: ListProps) {
  return <ul className="list">{children}</ul>;
}
