import * as React from 'react';

export interface ContainerAttributes {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  width?: string;
  height?: string;
}

export function Container(props: ContainerAttributes) {
  const { children, className } = props;
  
  return <div className={`px-2 md:px-8 ${className}`}>{children}</div>;
}