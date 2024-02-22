import { create } from "zustand";
import { useTheme } from "next-themes";

interface ThemeStore {
  isDark: boolean;
  dark: () => void;
  light: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  isDark: false,
  dark: () => {
    set({ isDark: true });
  },
  light: () => {
    set({ isDark: false });
  },
}));
