import * as React from 'react';
import { useNavigation } from "./useNavigation";

interface NavigateAttributeBase {
    to: string;
    className?: string;
}

interface NavigateLabelAttribute extends NavigateAttributeBase {
    label: string;
    children?: React.ReactNode;
}

interface NavigateChildrenAttribute extends NavigateAttributeBase {
    label?: string;
    children: React.ReactNode;
    as?: "button" | "a";
}

export type NavigateAttribute = NavigateLabelAttribute | NavigateChildrenAttribute;

export function Navigate(props: NavigateAttribute) {
    const { navigate } = useNavigation();

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        // Prevent the browser's default link behavior (full page refresh)
        event.preventDefault();
        // Use our custom navigate function
        navigate(props.to);
    };

    return <a href={props.to} className={props.className} onClick={handleClick}>{props.label || props.children || "Navigate"}</a>;
}