import React, { useState } from "react";
import "./View.css";

type ResultItem = {
  id: string;
  title: string;
  subtitle?: string;
  time?: string;
  avatar?: string;
  avatarFallback?: string;
  trailingIcon?: React.ReactNode;
};

interface SearchViewProps {
  open: boolean;
  variant?: "fullscreen" | "docked";
  query: string;
  onQueryChange: (q: string) => void;
  onClose: () => void;
  results: ResultItem[];
}

export default function SearchView({
  open,
  variant = "fullscreen",
  query,
  onQueryChange,
  onClose,
  results,
}: SearchViewProps) {
  if (!open) return null;

  return (
    <div className={`sv-overlay ${variant}`}>
      <div className="sv-container">
        {/* Header */}
        <div className="sv-header">
          <button className="sv-back" aria-label="Back" onClick={onClose}>
            ←
          </button>
          <input
            className="sv-input"
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            autoFocus
          />
          {query && (
            <button
              className="sv-clear"
              aria-label="Clear"
              onClick={() => onQueryChange("")}
            >
              ✕
            </button>
          )}
        </div>

        {/* Results */}
        <div className="sv-results">
          {results.map((r) => (
            <div key={r.id} className="sv-item">
              <div className="sv-avatar">
                {r.avatar ? (
                  <img src={r.avatar} alt="" />
                ) : (
                  <span>{r.avatarFallback}</span>
                )}
              </div>
              <div className="sv-text">
                <div className="sv-title">{r.title}</div>
                {r.subtitle && <div className="sv-subtitle">{r.subtitle}</div>}
              </div>
              <div className="sv-meta">
                {r.time && <span className="sv-time">{r.time}</span>}
                {r.trailingIcon && (
                  <button className="sv-trailing">{r.trailingIcon}</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
