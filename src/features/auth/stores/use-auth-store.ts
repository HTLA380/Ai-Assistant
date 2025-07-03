import { createStore } from "zustand/vanilla";
import { User } from "../types";
import { getProfile } from "../services/auth.service";

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export type AuthActions = {
  setUser: (user: User | null) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
  getMe: () => Promise<void>;
};

export type AuthStore = AuthState & AuthActions;

export const defaultInitState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export const createAuthStore = (
  initState: Partial<AuthState> = defaultInitState
) => {
  return createStore<AuthStore>()((set, get) => ({
    ...defaultInitState,
    ...initState,
    setUser: (user) => {
      set({
        user: user,
        isAuthenticated: !!user,
        isLoading: false,
      });
    },

    logout: () => {
      set({
        user: null,
        isAuthenticated: false,
      });
    },

    setLoading: (isLoading) => {
      set({ isLoading });
    },

    getMe: async () => {
      if (get().user) return;

      set({ isLoading: true });
      try {
        const user = await getProfile();
        set({ user, isAuthenticated: !!user });
      } catch (_) {
        set({ user: null, isAuthenticated: false });
      } finally {
        set({ isLoading: false });
      }
    },
  }));
};
