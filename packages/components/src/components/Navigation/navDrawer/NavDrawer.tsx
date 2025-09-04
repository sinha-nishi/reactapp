import React, { useState } from "react";
import "./NavDrawer.css";

export interface DrawerLink {
  label: string;
  href: string;
}

export interface NavigationDrawerProps {
  links: DrawerLink[];
  position?: "left" | "right";
  width?: string;
}

export function NavigationDrawer({
  links,
  position = "left",
  width = "280px",
}: NavigationDrawerProps) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);
  const closeDrawer = () => setOpen(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        className={`drawer-toggle toggle-${position}`}
        onClick={toggleDrawer}
        aria-label="Toggle navigation"
      >
        ☰
      </button>

      {/* Overlay */}
      {open && <div className="drawer-overlay" onClick={closeDrawer}></div>}

      {/* Drawer */}
      <div
        className={`drawer drawer-${position} ${open ? "open" : ""}`}
        style={{ width }}
      >
        <button className="drawer-close" onClick={closeDrawer}>
          ✕
        </button>
        <ul className="drawer-menu">
          {links.map((link, i) => (
            <li key={i} className="drawer-item">
              <a href={link.href} onClick={closeDrawer}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
