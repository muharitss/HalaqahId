import { create } from "zustand";

export type Theme = "dark" | "light" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const storageKey = "app-theme";

export const applyTheme = (theme: Theme) => {
  if (typeof window === "undefined") return;
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: ((typeof window !== "undefined" && localStorage.getItem(storageKey)) as Theme) || "light",
  setTheme: (theme) => {
    localStorage.setItem(storageKey, theme);
    set({ theme });
    applyTheme(theme);
  },
}));

// Apply the theme immediately on module load
if (typeof window !== "undefined") {
  applyTheme(useThemeStore.getState().theme);
}
