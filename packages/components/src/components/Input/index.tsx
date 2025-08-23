import React from "react";
import "./input.css";

export interface InputAttributes {
  type: string;
  accept: string;
  multiple: boolean;
  title: string;
  message: string;
  className: string;
  disabled: boolean;
  onClick: () => void;
  onChange: () => void;
}

export function Input(props: InputAttributes) {
  const {
    type,
    className,
    disabled,
    onClick,
    onChange,
    accept,
    multiple,
    title,
    message,
  } = props;

  switch (type) {
    case "file":
      return (
        <div className="input-wrapper">
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={onChange}
            onClick={onClick}
            className={`custom-input file-input ${className}`}
            disabled={disabled}
          />
          {title || message ? (
            <p className="input-message">{message || title}</p>
          ) : null}
        </div>
      );

    case "text":
    case "email":
    case "password":
    default:
      return (
        <div className="input-wrapper">
          <input
            type={type}
            onChange={onChange}
            className={`custom-input text-input ${className}`}
            disabled={disabled}
          />
          {title || message ? (
            <p className="input-message">{message || title}</p>
          ) : null}
        </div>
      );
  }
}
