import { useNavigate } from '@tanstack/react-router'

export function useSmartBack() {
  const navigate = useNavigate()

  return () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      navigate({ to: '/login' })
    }
  }
}
