import React from "react";

export interface CenteredLayoutAttributes {
    children?: React.ReactNode;
    className?: string;
}

export function Centered(props: CenteredLayoutAttributes) {
  const { children, className } = props;
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}
      style={{
        height: "100vh",
        margin: 0,
        backgroundColor: "#f4f7f6",
      }}
    >
        {children}
    </div>
  );
}
