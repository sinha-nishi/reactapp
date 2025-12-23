import * as React from 'react';
import { useNavigation } from "./useNavigation";

interface NavigateAttributeBase {
    to: string;
    replace?: boolean;
    className?: string;
    as?: "button" | "a";
}

interface NavigateLabelAttribute extends NavigateAttributeBase {
    label: string;
    children?: React.ReactNode;
}

interface NavigateChildrenAttribute extends NavigateAttributeBase {
    label?: string;
    children: React.ReactNode;
}

export type NavigateAttribute = NavigateLabelAttribute | NavigateChildrenAttribute;

export function Navigate(props: NavigateAttribute) {
    const { navigate, replace: doReplace } = useNavigation();
    const go = () => (props.replace ? doReplace(props.to) : navigate(props.to));

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        // Prevent the browser's default link behavior (full page refresh)
        event.preventDefault();
        // Use our custom navigate function
        go();
    };

    if (props.as === "button") {
        return <button type="button" className={props.className} onClick={handleClick}>{props.label || props.children || "Navigate"}</button>;
    }    

    return <a href={props.to} className={props.className} onClick={handleClick}>{props.label || props.children || "Navigate"}</a>;
}