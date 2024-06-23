"use client";

import { createContext, useContext, useRef } from "react";
import { AppStore, createRootStore, initRootStore } from "@/stores/root.store";
import { useStore } from "zustand";

export type RootStoreApi = ReturnType<typeof createRootStore>;

export const StoreContext = createContext<RootStoreApi | null>(null);

export type StoreProviderProps = {
  children: React.ReactNode;
};

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const storeRef = useRef<RootStoreApi | null>(null);
  if (!storeRef.current) {
    storeRef.current = createRootStore(initRootStore());
  }

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};

export const useRootStore = <T,>(selector: (_store: AppStore) => T): T => {
  const rootStoreContext = useContext(StoreContext);
  if (!rootStoreContext) {
    throw new Error("useStore must be used within a StoreProvider");
  }

  return useStore(rootStoreContext, selector);
};
