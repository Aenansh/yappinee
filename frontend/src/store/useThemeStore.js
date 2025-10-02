import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("yappinee-theme") || "light",
  setTheme: (theme) => {
    localStorage.setItem("yappinee-theme", theme);
    set({ theme });
  },
}));
