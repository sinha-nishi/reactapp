import React from "react";

export interface BoxAttributes {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  width?: string;
  height?: string;
}

export default function Box(props: BoxAttributes) {
  const { children, className, title, subtitle, width, height } = props;
  return (
    <div
      className={className}
      style={{
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        width,
        height,
        textAlign: "center",
      }}
    >
      {title && (
        <h1 className="text-3xl" style={{ color: "#333" }}>
          {title}
        </h1>
      )}
      {subtitle && (
        <p>{subtitle}</p>
      )}
      {children}
    </div>
  );
}