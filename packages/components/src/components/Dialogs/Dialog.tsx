import React, { ReactNode } from "react";
import "./dialog.css";

export interface DialogProps {
  open: boolean;
  title: string;
  header: ReactNode;   // custom header content
  body: ReactNode;     // custom body content
  footer: ReactNode;   // custom footer actions
  showCloseButton: boolean; // default true
  onClose: () => void;
  size: "sm" | "md" | "lg"; // dialog size option
  backdropClosable?: boolean; // close on backdrop click
  className?: string;   // custom class for outer backdrop
  style?: React.CSSProperties; // custom style for outer backdrop
  dialogClassName?: string; // custom class for inner dialog box
  dialogStyle?: React.CSSProperties; // custom style for inner dialog box
}

export function Dialog({
  open,
  title,
  header,
  body,
  className = "",
  style,
  dialogClassName = "",
  dialogStyle,
  footer,
  showCloseButton = true,
  onClose,
  size = "md",
  backdropClosable = true,
}: DialogProps) {
  if (!open) return null;

  return (
    <div
      className={`dialog-backdrop ${className}`}
      style={style}
      onClick={backdropClosable ? onClose : undefined}
    >
      <div
        className={`dialog-container dialog-${size} ${dialogClassName}`}
        style={dialogStyle}
        onClick={(e) => e.stopPropagation()} // prevent backdrop click
      >
        {/* ---- Header ---- */}
        <div className="dialog-header">
          {title && <h2>{title}</h2>}
          {header}
          {showCloseButton && (
            <button className="dialog-close" onClick={onClose}>
              ✕
            </button>
          )}
        </div>

        {/* ---- Body ---- */}
        <div className="dialog-body">{body}</div>

        {/* ---- Footer ---- */}
        <div className="dialog-footer">
          {footer ? (
            footer
          ) : (
            <button className="dialog-button" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
