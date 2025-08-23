import React, { useState } from "react";
import "./NavRail.css";

type NavItem = {
  key: string;
  label: string;
  icon: React.ReactNode; // emoji ya <svg />
};

interface NavigationRailProps {
  items: NavItem[];
  defaultActive?: string;
  position?: "left" | "right";
  expanded?: boolean;
  onChange?: (key: string) => void;
  footerItem?: NavItem;
  logo?: React.ReactNode;
}

export default function NavigationRail({
  items,
  defaultActive,
  position = "left",
  expanded: defaultExpanded = false,
  onChange,
  footerItem,
  logo = "",
}: NavigationRailProps) {
  const [active, setActive] = useState(defaultActive || items[0]?.key);
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleSelect = (key: string) => {
    setActive(key);
    onChange?.(key);
  };

  return (
    <nav className={`nav-rail ${position} ${expanded ? "expanded" : "collapsed"}`}>
      {/* Header */}
      <div className="nav-rail-header">
        <span className="nav-rail-logo">{logo}</span>
        <button
          className="nav-rail-toggle"
          onClick={() => setExpanded(!expanded)}
          aria-label="Toggle navigation"
        >
          {expanded ? "«" : "»"}
        </button>
      </div>

      {/* Items */}
      <ul className="nav-rail-list">
        {items.map((item) => (
          <li
            key={item.key}
            className={`nav-rail-item ${active === item.key ? "active" : ""}`}
            onClick={() => handleSelect(item.key)}
          >
            <span className="nav-rail-icon">{item.icon}</span>
            <span className="nav-rail-label">{item.label}</span>
          </li>
        ))}
      </ul>

      {/* Footer */}
      {footerItem && (
        <div
          className={`nav-rail-footer ${active === footerItem.key ? "active" : ""}`}
          onClick={() => handleSelect(footerItem.key)}
        >
          <span className="nav-rail-icon">{footerItem.icon}</span>
          {expanded && <span className="nav-rail-label">{footerItem.label}</span>}
        </div>
      )}
    </nav>
  );
}
