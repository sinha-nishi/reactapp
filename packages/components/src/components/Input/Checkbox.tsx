import React, { useState } from "react";
import "./checkbox.css";

export type CheckboxSize = "sm" | "md" | "lg";
export type CheckboxVariant = "default" | "primary" | "success" | "danger";

export interface CheckboxProps {
  checked?: boolean; // controlled mode
  defaultChecked?: boolean; // uncontrolled mode
  label?: string;
  disabled?: boolean;
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  onChange?: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  defaultChecked = false,
  label,
  disabled = false,
  size = "md",
  variant = "default",
  onChange,
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (!isControlled) {
      setInternalChecked(e.target.checked);
    }
    onChange?.(e.target.checked);
  };

  return (
    <label
      className={`checkbox-wrapper ${size} ${variant} ${
        disabled ? "disabled" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
      />
      <span className="checkbox-custom"></span>
      {label && <span className="checkbox-label">{label}</span>}
    </label>
  );
};

export Checkbox
