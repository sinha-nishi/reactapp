import React, { useState, useRef, useEffect } from "react";
import "./menu.css";

export type MenuVariant = "button" | "textfield" | "icon" | "selected-text";

export interface MenuItem {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface MenuProps {
  items: MenuItem[];
  variant?: MenuVariant;
  label?: string;
}

export default function Menu({
  items,
  variant = "button",
  label = "Menu",
}: MenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const renderTrigger = () => {
    switch (variant) {
      case "button":
        return (
          <button
            className="menu-trigger-btn"
            onClick={() => setOpen(!open)}
          >
            {label} ⌄
          </button>
        );

      case "textfield":
        return (
          <div
            className="menu-trigger-textfield"
            onClick={() => setOpen(!open)}
          >
            {label}
          </div>
        );

      case "icon":
        return (
          <div
            className="menu-trigger-icon"
            onClick={() => setOpen(!open)}
          >
            ☰
          </div>
        );

      case "selected-text":
        return (
          <span
            className="menu-trigger-selected"
            onClick={() => setOpen(!open)}
          >
            {label} ▼
          </span>
        );

      default:
        return null;
    }
  };

  return (
    <div className="menu-container" ref={menuRef}>
      {renderTrigger()}

      {open && (
        <div className="menu-dropdown">
          {items.map((item, i) => (
            <div
              key={i}
              className={`menu-item ${item.disabled ? "disabled" : ""}`}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick?.();
                  setOpen(false);
                }
              }}
            >
              {item.icon && (
                <span className="menu-item-icon">{item.icon}</span>
              )}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
