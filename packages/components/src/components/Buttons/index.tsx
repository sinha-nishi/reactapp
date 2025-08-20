// src/components/Buttons/Button.tsx
import React from 'react';
import './Button.css';

export interface ButtonAttribute {
  variant?: 'primary' | 'secondary' | 'tertiary';
  outlined?: boolean;
  elevated?: boolean;
  disabled?: boolean;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;

  style?: React.CSSProperties; 

}

export const Button = ({
  variant = 'primary',
  outlined = false,
  elevated = false,
  disabled = false,
  label,
  size = 'md',
  className = '',
  onClick,
}:  ButtonAttribute) => {
  const classNames = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    outlined && 'btn--outlined',
    elevated && 'btn--elevated',
    disabled && 'btn--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classNames}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

/**
 * import React from "react";
import PropTypes from "prop-types";

const propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

const defaultProps = {
  title: "",
  className: "",
  disabled: false,
  onClick: () => {},
};

export default function Button(props) {
  const { title, className, disabled, onClick } = props;
  return (
    <button
      type="submit"
      className={className}
      disabled={disabled}
      onClick={onClick}
      aria-label={title}
      style={{
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        padding: "12px 24px",
        borderRadius: "8px",
        fontSize: "16px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
      }}
    >
      {title}
    </button>
  );
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;
 */