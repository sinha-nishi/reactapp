import React from "react";
import "./appbar.css";

type AppBarVariant = "search" | "small" | "medium" | "large";

interface AppBarProps {
  variant?: AppBarVariant;
  leading?: React.ReactNode;
  headline?: string;
  subtitle?: string;
  trailing?: React.ReactNode;

  // 🔥 Search-specific slots
  searchLeading?: React.ReactNode;
  searchInput?: React.ReactNode;
  searchTrailing?: React.ReactNode;
}

const AppBar: React.FC<AppBarProps> = ({
  variant = "small",
  leading,
  headline,
  subtitle,
  trailing,
  searchLeading,
  searchInput,
  searchTrailing,
}) => {
  return (
    <header className={`appbar appbar--${variant}`}>
      {variant === "search" ? (
        <div className="appbar__row">
          {/* Left (menu/back etc.) */}
          <div className="appbar__leading">{leading}</div>

          {/* Search container */}
          <div className="appbar__search-container">
            {searchLeading && (
              <div className="appbar__search-leading">{searchLeading}</div>
            )}

            {searchInput ?? (
              <input
                type="text"
                className="appbar__search"
                placeholder="Search product"
              />
            )}

            {searchTrailing && (
              <div className="appbar__search-trailing">{searchTrailing}</div>
            )}
          </div>

          {/* Right (avatar/icons etc.) */}
          <div className="appbar__trailing">{trailing}</div>
        </div>
      ) : (
        <div className="appbar__row">
          <div className="appbar__leading">{leading}</div>
          <div className="appbar__title">
            <div className="appbar__headline">{headline}</div>
            {subtitle && <div className="appbar__subtitle">{subtitle}</div>}
          </div>
          <div className="appbar__trailing">{trailing}</div>
        </div>
      )}
    </header>
  );
};

export default AppBar;
