import { create } from 'zustand'

interface User {
  id: number
  nickname: string
  profileImageUrl: string
}

type AuthState = {
  isAuthenticated: boolean
  isSessionExpired: boolean
  user: User | null
  setAuthenticated: (value: boolean, user?: User) => void
  setSessionExpired: () => void
  reset: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isSessionExpired: false,
  user: null,
  setAuthenticated: (value, user) =>
    set({
      isAuthenticated: value,
      user: user || null,
    }),
  setSessionExpired: () =>
    set({
      isAuthenticated: false,
      user: null,
      isSessionExpired: true,
    }),
  reset: () =>
    set({
      isAuthenticated: false,
      user: null,
      isSessionExpired: false,
    }),
}))
