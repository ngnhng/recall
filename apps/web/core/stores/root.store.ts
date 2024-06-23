import { createStore } from "zustand/vanilla";
import { ThemeState, ThemeActions } from "@/stores/theme.store";

export type AppState = {
  theme: ThemeState;
};

export type AppActions = ThemeActions;

export type AppStore = AppState & AppActions;

export const initRootStore = (): AppState => {
  return {
    theme: {
      mode: "light",
    },
  };
};

export const defaultInitialState: AppState = {
  theme: {
    mode: "light",
  },
};

export const createRootStore = (initialState = defaultInitialState) =>
  createStore<AppStore>((set) => ({
    ...initialState,
    setTheme: (value) => set({ theme: { mode: value } }),
  }));
