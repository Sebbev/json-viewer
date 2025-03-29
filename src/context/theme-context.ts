import * as React from "react";

export const lightThemes = {
  alabaster: "Alabaster",
} as const;

export const darkThemes = {
  halcyon: "Halcyon",
  poimandres: "Poimandres",
} as const;

export const themes: Record<JsonTheme, string> = {
  ...lightThemes,
  ...darkThemes,
  system: "System",
};

export type Theme = "dark" | "light" | "system";
export type JsonTheme =
  | "system"
  | keyof typeof lightThemes
  | keyof typeof darkThemes;

export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  jsonTheme: JsonTheme;
  setJsonTheme: (theme: JsonTheme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  jsonTheme: "system",
  setJsonTheme: () => null,
};

export const ThemeProviderContext =
  React.createContext<ThemeProviderState>(initialState);
