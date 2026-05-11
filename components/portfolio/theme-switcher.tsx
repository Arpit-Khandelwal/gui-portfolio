import { ChevronDown, Palette } from "lucide-react";

import type { WorkMode } from "./types";

type ThemeMode<T extends string> = WorkMode & { id: T };

type ThemeSwitcherProps<T extends string> = {
  modes: readonly ThemeMode<T>[];
  value: T;
  onChange: (id: T) => void;
  compact?: boolean;
  variant?: "chips" | "dropdown";
};

export function ThemeSwitcher<T extends string>({
  modes,
  value,
  onChange,
  compact = false,
  variant = "chips",
}: ThemeSwitcherProps<T>) {
  if (variant === "dropdown") {
    return (
      <div
        className={`theme-dropdown ${compact ? "theme-dropdown-compact" : ""}`}
        aria-label="Theme switcher"
      >
        <span className="theme-switcher-label">
          <Palette size={15} />
          Theme
        </span>
        <label className="theme-select-shell">
          <span className="theme-chip-swatch" aria-hidden />
          <select
            value={value}
            onChange={(event) => onChange(event.target.value as T)}
            className="theme-select"
            aria-label="Theme"
          >
            {modes.map((mode) => (
              <option key={mode.id} value={mode.id}>
                {mode.label}
              </option>
            ))}
          </select>
          <ChevronDown className="theme-select-icon" size={15} aria-hidden />
        </label>
      </div>
    );
  }

  return (
    <div
      className={`theme-switcher ${compact ? "theme-switcher-compact" : ""}`}
      aria-label="Theme switcher"
    >
      <span className="theme-switcher-label">
        <Palette size={15} />
        Theme
      </span>
      <div className="theme-switcher-options">
        {modes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => onChange(mode.id)}
            className={`theme-chip ${value === mode.id ? "theme-chip-active" : ""}`}
            aria-pressed={value === mode.id}
            aria-label={`${mode.label} theme`}
          >
            <span className="theme-chip-swatch" aria-hidden />
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
}
