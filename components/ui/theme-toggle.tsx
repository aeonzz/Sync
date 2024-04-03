"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/context/store";
import { useEffect } from "react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const darkTheme = useThemeStore((state) => state.dark);
  const lightTheme = useThemeStore((state) => state.light);

  const modeHandler = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  useEffect(() => {
    if (theme === "light") {
      darkTheme();
    } else {
      lightTheme();
    }
  }, [theme, darkTheme, lightTheme]);

  return (
    <Button variant="ghost" size="icon" onClick={() => modeHandler()}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
