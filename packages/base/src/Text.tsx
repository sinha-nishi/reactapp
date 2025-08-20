import React from "react";

export interface ParagraphAttributes {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  width?: string;
  height?: string;
}

export function P(props: ParagraphAttributes) {
  const { children, className } = props;
  return (
    <p
      className={`text-base md:text-lg lg:text-xl lg:leading-loose ${className}`}
    >
      {children}
    </p>
  );
}

export interface HeadingAttributes {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  width?: string;
  height?: string;
}

export function H1(props: HeadingAttributes) {
  const { children, className } = props;
  return (
    <h1
      className={`font-bold text-xl md:text-2xl lg:text-3xl my-3 lg:my-5 ${className}`}
    >
      {children}
    </h1>
  );
}

export function H2(props: HeadingAttributes) {
  const { children, className } = props;
  return (
    <h2
      className={`font-bold text-lg md:text-xl lg:text-2xl my-2 md:my-3 lg:my-5 ${className}`}
    >
      {children}
    </h2>
  );
}

export function H3(props: HeadingAttributes) {
  const { children, className } = props;
  return (
    <h3 className={`text-slate-500 my-1 lg:my-2 font-bold ${className}`}>
      {children}
    </h3>
  );
}

export interface ListAttributes {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  width?: string;
  height?: string;
  bullets?: boolean;
  numbered?: boolean;
  data: string[];
}

export function List(props: ListAttributes) {
  const { className, data } = props;
  return (
    <ul
      className={`list-disc list-inside mt-5 ml-5 lg:mt-10 lg:ml-10 text-base lg:text-xl ${className}`}
    >
      {data.map((el, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <li key={i}>{el}</li>
      ))}
    </ul>
  );
}

export function Bold() {}

export function Italics() {}
