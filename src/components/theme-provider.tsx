import {
  JsonTheme,
  Theme,
  ThemeProviderContext,
} from "@/context/theme-context";
import * as React from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  defaultJsonTheme?: JsonTheme;
};

const defaultJsonThemeLight: JsonTheme = "alabaster";
const defaultJsonThemeDark: JsonTheme = "poimandres";

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  defaultJsonTheme = "system",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  const [jsonTheme, setJsonTheme] = React.useState<JsonTheme>(
    () =>
      (localStorage.getItem(storageKey + "-json") as JsonTheme) ||
      defaultJsonTheme,
  );

  React.useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  React.useEffect(() => {
    const root = window.document.documentElement;

    if (jsonTheme === "system") {
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";

        root.dataset.theme =
          systemTheme === "light"
            ? defaultJsonThemeLight
            : defaultJsonThemeDark;
      } else {
        root.dataset.theme =
          theme === "light" ? defaultJsonThemeLight : defaultJsonThemeDark;
      }

      return;
    }

    root.dataset.theme = jsonTheme;
  }, [theme, jsonTheme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    jsonTheme,
    setJsonTheme: (theme: JsonTheme) => {
      localStorage.setItem(storageKey + "-json", theme);
      setJsonTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
