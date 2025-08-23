import React from "react";
import "./loading.css";

export interface AuroraLoaderProps {
  size?: number;            // overall box size (px)
  color?: string;           // active stroke color
  trackColor?: string;      // track ring color
  strokeWidth?: number;     // px
  speed?: number;           // seconds per cycle
  text?: string;            // optional label
  glow?: boolean;           // glow effect toggle
}

export default function AuroraLoader({
  size = 72,
  color = "#6750A4",       // MD3 primary-ish
  trackColor = "rgba(103,80,164,0.15)",
  strokeWidth = 6,
  speed = 1.6,
  text = "Loading…",
  glow = true,
}: AuroraLoaderProps) {
  // SVG circle math
  const radius = 50 - strokeWidth; // viewBox 0 0 100 100
  const dashArray = Math.PI * 2 * radius;

  return (
    <div className="aurora-wrap" style={{ width: size, height: size }}>
      <svg
        className={`aurora ${glow ? "aurora--glow" : ""}`}
        viewBox="0 0 100 100"
        style={
          {
            "--stroke": color,
            "--track": trackColor,
            "--sw": `${strokeWidth}px`,
            "--dash": dashArray,
            "--speed": `${speed}s`,
          } as React.CSSProperties
        }
        role="status"
        aria-label={text || "Loading"}
      >
        {/* track */}
        <circle
          className="aurora__track"
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
        />
        {/* comet stroke */}
        <circle
          className="aurora__arc"
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* soft inner pulse */}
        <circle className="aurora__pulse" cx="50" cy="50" r="22" />
      </svg>
      {text !== "" && <div className="aurora__label">{text}</div>}
    </div>
  );
}
