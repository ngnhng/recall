export type ThemeState = {
  mode: "light" | "dark";
};

export type ThemeActions = {
  setTheme: (_theme: "light" | "dark") => void;
};

export type ThemeStore = ThemeState & ThemeActions;
