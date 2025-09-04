import React from "react";
import "./RadioButton.css";

export interface RadioButtonProps {
  /** unique name to group radio buttons */
  name: string;
  /** label text shown beside the radio */
  label: string;
  /** value of radio button */
  value: string;
  /** currently selected value */
  checked?: boolean;
  /** disable radio */
  disabled?: boolean;
  /** readonly (cannot change but looks enabled) */
  readOnly?: boolean;
  /** error state */
  error?: boolean;
  /** handle selection change */
  onChange?: (value: string) => void;
}

export function RadioButton({
  name,
  label,
  value,
  checked = false,
  disabled = false,
  readOnly = false,
  error = false,
  onChange,
}: RadioButtonProps) {
  return (
    <label
      className={`radio-wrapper 
        ${disabled ? "disabled" : ""} 
        ${error ? "error" : ""}
        ${readOnly ? "readonly" : ""}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled || readOnly}
        onChange={() => {
          if (!readOnly && onChange) onChange(value);
        }}
      />
      <span className="custom-radio" />
      <span className="radio-label">{label}</span>
    </label>
  );
}


