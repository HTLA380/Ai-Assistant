import { createStore } from "zustand/vanilla"
import { User } from "@/lib/auth"

export type AuthState = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export type AuthActions = {
  setUser: (user: User | null) => void
  setLoading: (isLoading: boolean) => void
}

export type AuthStore = AuthState & AuthActions

export const defaultInitState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

export const createAuthStore = (initState: Partial<AuthState> = defaultInitState) => {
  return createStore<AuthStore>()((set) => ({
    ...defaultInitState,
    ...initState,
    setUser: (user) => {
      set({
        user: user,
        isAuthenticated: !!user,
        isLoading: false,
      })
    },

    setLoading: (isLoading) => {
      set({ isLoading })
    },
  }))
}

export const authStore = createAuthStore()
