import React from "react";
import "./progress.css";

export type ProgressVariant = "linear" | "circle";

export interface ProgressIndicatorProps {
  variant?: ProgressVariant;
  value: number; // 0-100
  size?: number; // for circle only
  strokeWidth?: number; // for circle only
  color?: string;
  trackColor?: string;
  showLabel?: boolean;
}

export function ProgressIndicator({
  variant = "linear",
  value,
  size = 80,
  strokeWidth = 8,
  color = "#6750A4",
  trackColor = "#e0e0e0",
  showLabel = true,
}: ProgressIndicatorProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  if (variant === "circle") {
    return (
      <div
        className="progress-circle-wrapper"
        style={{ width: size, height: size }}
      >
        <svg className="progress-circle" viewBox={`0 0 ${size} ${size}`}>
          <circle
            className="progress-circle-track"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={trackColor}
            fill="none"
          />
          <circle
            className="progress-circle-bar"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={color}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        {showLabel && <div className="progress-circle-label">{value}%</div>}
      </div>
    );
  }

  // Linear variant
  return (
    <div className="progress-linear-wrapper">
      <div className="progress-linear-track">
        <div
          className="progress-linear-bar"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}, #9575cd)`,
          }}
        />
      </div>
      {showLabel && <span className="progress-linear-label">{value}%</span>}
    </div>
  );
}
