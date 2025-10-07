import * as React from 'react';

type HomeIconProps = {
    size?: number | string;
    color?: string;
    strokeWidth?: number;
    variant?: 'outlined' | 'filled';
};

export function HomeIcon({
    size = 24,
    color = "#4A90E2",
    strokeWidth = 2,
    variant = 'outlined',
}: HomeIconProps) {
    return (
        <svg 
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {variant === 'outlined' ? (
                <>
                    <path 
                        d="M3 10L12 2L21 10V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V10Z"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path 
                        d="M9 21V14H15V21"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </>
            ) : (
                <>
                    <path 
                        d="M3 10L12 2L21 10V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V10Z"
                        fill={color}
                    />
                    <path 
                        d="M9 21V14H15V21"
                        fill={color}
                    />
                </>
            )}
        </svg>
    );
}
