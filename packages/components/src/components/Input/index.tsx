import * as React from 'react';

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
        <>
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={onChange}
            onClick={onClick}
            className={className}
            disabled={disabled}
            style={{
              border: "2px dashed #28a745",
              borderRadius: "8px",
              padding: "30px",
              cursor: "pointer",
              display: "block",
              width: "100%",
              marginBottom: "20px",
            }}
          />
          {title || message ? (
            <p
              style={{
                marginTop: "15px",
                color: "#d9534f",
                fontWeight: "bold",
              }}
            >
              {message || title}
            </p>
          ) : null}
        </>
      );
    case "text":
    case "email":
    case "password":
    default:
      return (
        <>
          <input
            onChange={onChange}
            type="text"
            style={{
              border: "2px dashed #28a745",
              borderRadius: "8px",
              padding: "30px",
              cursor: "pointer",
              display: "block",
              width: "100%",
              marginBottom: "20px",
            }}
          />
          {title || message ? (
            <p
              style={{
                marginTop: "15px",
                color: "#d9534f",
                fontWeight: "bold",
              }}
            >
              {message || title}
            </p>
          ) : null}
        </>
      );
  }
}
