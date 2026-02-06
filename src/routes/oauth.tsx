import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/oauth')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      accessToken: search.accessToken as string | undefined,
    }
  },
  component: OAuthCallback,
})

function OAuthCallback() {
  const { accessToken } = Route.useSearch()

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken)
      window.location.href = '/?page=1'
    } else {
      window.location.href = '/login'
    }
  }, [accessToken])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
        <p className="text-sm font-medium text-gray-500">
          인증 정보를 확인 중입니다...
        </p>
      </div>
    </div>
  )
}
