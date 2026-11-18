"use client";

import { Icon } from "./Icon";

import { THEME_KEY } from "@/lib/theme";

// Switches between the dark (default) and light theme by setting
// <html data-theme>. Both icons are rendered and CSS shows the right one, so
// server and client markup always match.
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Private mode / blocked storage: the switch still works for this page.
    }
  }

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label="Switch between light and dark mode" title="Light / dark mode">
      <Icon name="sun" size={20} className="icon icon-sun" />
      <Icon name="moon" size={20} className="icon icon-moon" />
    </button>
  );
}
