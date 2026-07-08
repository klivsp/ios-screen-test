import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type ThemePreference = "system" | "light" | "dark";
type Resolved = "light" | "dark";

const STORAGE_KEY = "screendoctor.theme-preference";

type Palette = {
  bg: string;
  panel: string;
  card: string;
  panelBorder: string;
  text: string;
  textDim: string;
  textFaint: string;
  accent: string;
  statusBar: "light" | "dark";
};

const palettes: Record<Resolved, Palette> = {
  dark: {
    bg: "#0d1117",
    panel: "rgba(255,255,255,0.06)",
    card: "rgba(255,255,255,0.04)",
    panelBorder: "rgba(255,255,255,0.09)",
    text: "#ffffff",
    textDim: "rgba(255,255,255,0.42)",
    textFaint: "rgba(255,255,255,0.28)",
    accent: "#a78bfa",
    statusBar: "light",
  },
  light: {
    bg: "#f4f5f7",
    panel: "#ffffff",
    card: "#ffffff",
    panelBorder: "rgba(17,19,24,0.08)",
    text: "#11131a",
    textDim: "rgba(17,19,26,0.5)",
    textFaint: "rgba(17,19,26,0.35)",
    accent: "#7c3aed",
    statusBar: "dark",
  },
};

type ThemeContextValue = {
  preference: ThemePreference;
  resolved: Resolved;
  colors: Palette;
  setPreference: (p: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      if (v === "light" || v === "dark" || v === "system") setPreferenceState(v);
    });
  }, []);

  const setPreference = (p: ThemePreference) => {
    setPreferenceState(p);
    AsyncStorage.setItem(STORAGE_KEY, p).catch(() => {});
  };

  const resolved: Resolved =
    preference === "system" ? (systemScheme === "light" ? "light" : "dark") : preference;

  const value = useMemo(
    () => ({ preference, resolved, colors: palettes[resolved], setPreference }),
    [preference, resolved],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used within a ThemeProvider");
  return ctx;
}
