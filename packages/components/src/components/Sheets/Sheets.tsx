import React, { useEffect } from "react";
import "./sheet.css";

type Position = "left" | "right" | "top" | "bottom";
type Size = "sm" | "md" | "lg" | "full";
type Variant = "default" | "outlined" | "glass";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  position?: Position;
  size?: Size;
  variant?: Variant;
  children: React.ReactNode;
  closeOnOverlayClick?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const Sheet: React.FC<SheetProps> = ({
  open,
  onClose,
  position = "right",
  size = "md",
  variant = "default",
  children,
  className = "",
  style,
  closeOnOverlayClick = true,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      className={`sheet-overlay ${className}`}
      onClick={closeOnOverlayClick ? onClose : undefined}
      style={style}
    >
      <div
        className={`sheet sheet-${position} sheet-${size} sheet-${variant} sheet-open${className}`}
        onClick={(e) => e.stopPropagation()}
        style={style}
      >
        <button className="sheet-close" onClick={onClose}>
          ×
        </button>
        <div className={`sheet-content${className}`} style={style}>{children}</div>
      </div>
    </div>
  );
};

export default Sheet;
