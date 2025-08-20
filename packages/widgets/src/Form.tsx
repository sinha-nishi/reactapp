import React from "react";

interface FormAttributes {
  className: string;
  title: string;
  message: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
};

export function Form(props: FormAttributes) {
  const { children, className, onSubmit, message, title } = props;
  return (
    <form className={className} onSubmit={onSubmit}>
      {title && (
        <h1
          className="text-3xl"
          style={{ color: "#333", marginBottom: "20px" }}
        >
          {title}
        </h1>
      )}
      {children}
      {message}
    </form>
  );
}
