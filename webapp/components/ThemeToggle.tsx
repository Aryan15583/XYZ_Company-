"use client";

import { Icon } from "./Icon";
import { THEME_KEY } from "@/lib/theme";

// The site follows the device's light/dark setting until the visitor clicks
// this button. Clicking picks the opposite of what is showing and saves it;
// picking the same theme the device uses clears the choice, so the site goes
// back to following the device. Both icons are rendered and CSS shows the
// right one, so server and client markup always match.
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const deviceDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const current = root.dataset.theme ?? (deviceDark ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    const matchesDevice = (next === "dark") === deviceDark;
    try {
      if (matchesDevice) localStorage.removeItem(THEME_KEY);
      else localStorage.setItem(THEME_KEY, next);
    } catch {
      // Private mode / blocked storage: the switch still works for this page.
    }
    if (matchesDevice) delete root.dataset.theme;
    else root.dataset.theme = next;
  }

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label="Switch between light and dark mode" title="Light / dark mode">
      <Icon name="sun" size={20} className="icon icon-sun" />
      <Icon name="moon" size={20} className="icon icon-moon" />
    </button>
  );
}
