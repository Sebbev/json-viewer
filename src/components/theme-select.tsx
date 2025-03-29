import { Check, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";
import {
  darkThemes,
  JsonTheme,
  lightThemes,
  themes,
} from "@/context/theme-context";

export function ThemeSelect() {
  const { jsonTheme, setJsonTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Palette />
          {themes[jsonTheme]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="justify-between gap-2"
          onClick={() => setJsonTheme("system")}
        >
          Follow System
          {jsonTheme === "system" && <Check />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>Light Themes</DropdownMenuLabel>
          {Object.entries(lightThemes).map(([key, name]) => (
            <DropdownMenuItem
              key={key}
              className="justify-between gap-2"
              onClick={() => setJsonTheme(key as JsonTheme)}
            >
              {name}
              {jsonTheme === key && <Check />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Dark Themes</DropdownMenuLabel>
          {Object.entries(darkThemes).map(([key, name]) => (
            <DropdownMenuItem
              key={key}
              className="justify-between gap-2"
              onClick={() => setJsonTheme(key as JsonTheme)}
            >
              {name}
              {jsonTheme === key && <Check />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
