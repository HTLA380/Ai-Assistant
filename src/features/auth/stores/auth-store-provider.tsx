"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type AuthStore,
  createAuthStore,
  type AuthState,
} from "./use-auth-store";

export type AuthStoreApi = ReturnType<typeof createAuthStore>;

export const AuthStoreContext = createContext<AuthStoreApi | undefined>(
  undefined
);

export interface AuthStoreProviderProps {
  children: ReactNode;
  initialState?: Partial<AuthState>;
}

export const AuthStoreProvider = ({
  children,
  initialState,
}: AuthStoreProviderProps) => {
  const storeRef = useRef<AuthStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createAuthStore(initialState);
  }

  return (
    <AuthStoreContext.Provider value={storeRef.current}>
      {children}
    </AuthStoreContext.Provider>
  );
};

export const useAuthStore = <T,>(selector: (store: AuthStore) => T): T => {
  const authStoreContext = useContext(AuthStoreContext);

  if (!authStoreContext) {
    throw new Error(`useAuthStore must be used within AuthStoreProvider`);
  }

  return useStore(authStoreContext, selector);
};
