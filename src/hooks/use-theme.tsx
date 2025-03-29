import { ThemeProviderContext } from "@/context/theme-context";
import * as React from "react";

export function useTheme() {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
}
