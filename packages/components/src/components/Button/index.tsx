import React from 'react';

export interface ButtonAttributes {
    primary?: boolean;
    secondary?: boolean;
    tertiary?: boolean;
    outlined?: boolean;
    elevated?: boolean;
    disabled?: boolean;
    label?: string;
    size?: "sm" | "md" | "lg";
    onClick?: () => void
}

export const Button = ({
    label,
    size = "md",
    onClick,
}: ButtonAttributes) => {
    console.log("trying to render button", label, size);
    return <button onClick={onClick}> { label ? `ti${label}` : ''} </button>;
}