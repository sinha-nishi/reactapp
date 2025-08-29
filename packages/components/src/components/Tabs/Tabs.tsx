import React, { useState, ReactNode } from "react";
import "./tabs.css";

export type TabVariant = "default" | "underline" | "pills";
export type TabOrientation = "horizontal" | "vertical";

export interface TabItem {
  label: string;
  content?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  defaultIndex?: number;
  variant?: TabVariant;
  orientation?: TabOrientation;
  onChange?: (index: number) => void;
}

export default function Tabs({
  items,
  defaultIndex = 0,
  variant = "default",
  orientation = "horizontal",
  onChange,
}: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const handleClick = (index: number, disabled?: boolean) => {
    if (disabled) return;
    setActiveIndex(index);
    onChange?.(index);
  };

  return (
    <div className={`tabs tabs-${orientation} tabs-${variant}`}>
      <div className="tabs-list">
        {items.map((item, idx) => (
          <button
            key={idx}
            className={`tab-item ${activeIndex === idx ? "active" : ""} ${
              item.disabled ? "disabled" : ""
            }`}
            onClick={() => handleClick(idx, item.disabled)}
            disabled={item.disabled}
          >
            {item.icon && <span className="tab-icon">{item.icon}</span>}
            {item.label}
          </button>
        ))}
      </div>
      {items[activeIndex]?.content && (
        <div className="tabs-content">{items[activeIndex]?.content}</div>
      )}
    </div>
  );
}
