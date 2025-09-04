import React, { ReactNode, useState, useRef } from "react";
import "./Tooltip.css";

export type TooltipType = "plain" | "rich";
export type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  type?: TooltipType;
  position?: TooltipPosition;
  title?: string;
  description?: string;
  action?: ReactNode;
  content?: string;
  children: ReactNode;
  delay?: number;
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  type = "plain",
  position = "top",
  title,
  description,
  action,
  content,
  children,
  delay = 150,
  disabled = false,
}) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  const show = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };
  
  const hide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(false);
  };
  

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      {visible && !disabled && (
        <div
          className={`tooltip tooltip-${type} tooltip-${position}`}
          onMouseEnter={show}   // ✅ tooltip ke andar bhi hover allow
          onMouseLeave={hide}   // ✅ jab tak tooltip pe ho, band mat karo
        >
          {type === "plain" && <span>{content}</span>}
          {type === "rich" && (
            <div className="tooltip-rich-content">
              {title && <div className="tooltip-title">{title}</div>}
              {description && <div className="tooltip-description">{description}</div>}
              {action && <div className="tooltip-action">{action}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
