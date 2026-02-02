import { create } from 'zustand'

type AuthState = {
  isSessionExpired: boolean
  setSessionExpired: () => void
  reset: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isSessionExpired: false,
  setSessionExpired: () =>
    set({
      isSessionExpired: true,
    }),
  reset: () =>
    set({
      isSessionExpired: false,
    }),
}))
