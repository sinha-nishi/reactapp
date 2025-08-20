import React from "react";

export interface SectionAttributes {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  style?: React.CSSProperties;
  width?: string;
  height?: string;
}

export function Section(props: SectionAttributes) {
  const { children, className, style } = props;
  return (
    <section className={`mb-4 bg-white lg:mb-8 ${className}`} style={style}>
      {children}
    </section>
  );
}

export function Article(props: SectionAttributes) {
  const { children, className, style } = props;
  return (
    <article className={`mb-4 bg-white lg:mb-8 ${className}`} style={style}>
      {children}
    </article>
  );
}
