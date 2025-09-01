import React from "react";
import "./switch.css";

type Variant = "primary" | "secondary" | "success" | "error";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  variant?: Variant;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const VARIANT_COLOR: Record<Variant, string> = {
  primary: "#3b82f6",
  secondary: "#6b7280",
  success: "#10b981",
  error: "#ef4444",
};

export function Switch({
  checked,
  onChange,
  label,
  variant = "primary",
  icon,
  disabled = false,
}: SwitchProps) {
  const bgColor = checked ? VARIANT_COLOR[variant] : "#e5e7eb";

  return (
    <label
      className="switch-wrapper"
      style={{ cursor: disabled ? "not-allowed" : "pointer" }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <div
        className={`switch ${disabled ? "disabled" : ""}`}
        style={{ backgroundColor: bgColor }}
      >
        <div className="switch-handle">{icon && checked ? icon : null}</div>
      </div>
      {label && <span className="switch-label">{label}</span>}
    </label>
  );
}
