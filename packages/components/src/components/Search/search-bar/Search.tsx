import React, { useId } from "react";
import "./Search.css";

type TrailingAction = {
  id?: string;
  ariaLabel: string;
  onClick?: () => void;
  /** built-in icons: "mic" | "filter" | "settings" | "close" | "search" */
  icon?: "mic" | "filter" | "settings" | "close" | "search";
  /** custom icon node (overrides icon prop if provided) */
  node?: React.ReactNode;
};

export interface SearchProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: (v: string) => void;
  onClear?: () => void;

  placeholder?: string;
  disabled?: boolean;

  /** show small avatar at leading side */
  avatarSrc?: string;
  avatarAlt?: string;
  avatarFallback?: string; // initials, eg "NS"

  /** show leading search icon (default true) */
  showLeadingIcon?: boolean;

  /** trailing action buttons (max 2 recommended) */
  trailingActions?: TrailingAction[];
}

const Icon = ({ name }: { name: NonNullable<TrailingAction["icon"]> }) => {
  switch (name) {
    case "mic":
      return (
        <svg viewBox="0 0 24 24" className="s-icon" aria-hidden="true">
          <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm-7-3a7 7 0 0 0 14 0h-2a5 5 0 0 1-10 0H5zM11 19v3h2v-3h-2z"/>
        </svg>
      );
    case "filter":
      return (
        <svg viewBox="0 0 24 24" className="s-icon" aria-hidden="true">
          <path d="M3 5h18v2H3V5zm4 6h10v2H7v-2zm4 6h2v2h-2v-2z"/>
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 24 24" className="s-icon" aria-hidden="true">
          <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm9 3h-2.1a6.9 6.9 0 0 0-.6-1.5l1.5-1.5-1.4-1.4-1.5 1.5c-.5-.3-1-.5-1.5-.6V3h-2v2.1c-.5.1-1 .3-1.5.6L8.9 4.2 7.5 5.6 9 7.1c-.3.5-.5 1-.6 1.5H6v2h2.1c.1.5.3 1 .6 1.5l-1.5 1.5 1.4 1.4 1.5-1.5c.5.3 1 .5 1.5.6V21h2v-2.1c.5-.1 1-.3 1.5-.6l1.5 1.5 1.4-1.4-1.5-1.5c.3-.5.5-1 .6-1.5H21v-2z"/>
        </svg>
      );
    case "close":
      return (
        <svg viewBox="0 0 24 24" className="s-icon" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"/>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className="s-icon" aria-hidden="true">
          <path d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-1.4 1.4l.3.3v.8L20 21.5 21.5 20 15.5 14zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"/>
        </svg>
      );
  }
};

export default function Search({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = "Search",
  disabled,
  avatarSrc,
  avatarAlt,
  avatarFallback,
  showLeadingIcon = true,
  trailingActions = [],
}: SearchProps) {
  const inputId = useId();

  const renderAvatar = () => {
    if (!avatarSrc && !avatarFallback) return null;
    return (
      <span className="s-avatar" aria-hidden={!!avatarSrc ? "true" : "false"}>
        {avatarSrc ? (
          <img src={avatarSrc} alt={avatarAlt || "avatar"} />
        ) : (
          <span className="s-avatar-fallback" aria-label={avatarAlt || "avatar"}>
            {avatarFallback}
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="s-root">
      <div className="s-field">
        {showLeadingIcon && (
          <button
            type="button"
            className="s-leading"
            aria-label="Search"
            onClick={() => onSubmit?.(value)}
            disabled={disabled}
          >
            <Icon name="search" />
          </button>
        )}

        {renderAvatar()}

        <input
          id={inputId}
          type="text"
          className="s-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit?.(value);
          }}
          aria-label={placeholder}
        />

        {/* clear button */}
        {!!value && (
          <button
            type="button"
            className="s-action subtle"
            aria-label="Clear search"
            onClick={() => {
              onClear?.();
              onChange("");
            }}
            disabled={disabled}
          >
            <Icon name="close" />
          </button>
        )}

        {/* trailing custom actions */}
        {trailingActions?.slice(0, 2).map((a, idx) => (
          <button
            key={a.id || idx}
            type="button"
            className="s-action"
            aria-label={a.ariaLabel}
            onClick={a.onClick}
            disabled={disabled}
          >
            {a.node ?? <Icon name={a.icon || "settings"} />}
          </button>
        ))}
      </div>
    </div>
  );
}
