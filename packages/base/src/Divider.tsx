import React from "react";

export interface DividerAttributes {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  width?: string;
  height?: string;
}

export function Divider(props: DividerAttributes) {
  const { className } = props;
  return <div className={`border-b my-8 border-slate-200 ${className}`} />;
}