"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div className="theme-toggle-track">
        <div className={`theme-toggle-thumb ${theme}`}>
          <Sun 
            className={`theme-icon sun-icon ${theme === "light" ? "active" : ""}`} 
          />
          <Moon 
            className={`theme-icon moon-icon ${theme === "dark" ? "active" : ""}`} 
          />
        </div>
      </div>
    </button>
  );
}
