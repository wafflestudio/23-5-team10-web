import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { instance } from '@/shared/api/ky'
import { HTTPError } from 'ky'
import { useInvalidateCurrentUser } from '@/shared/auth/useCurrentUser'

export function useVerification() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/accounts/emailsignup/verification' })
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const invalidateCurrentUser = useInvalidateCurrentUser()

  const handleCodeChange = (value: string) => {
    setCode(value.replace(/[^0-9]/g, ''))
  }

  const handleVerify = async () => {
    if (code.length !== 6 || isLoading) return

    setIsLoading(true)
    try {
      const res = await instance
        .post('api/v1/auth/register', {
          json: {
            email: search.email,
            password: search.password,
            nickname: search.nickname,
            name: search.name,
            birthday: search.birthday,
            code: code,
          },
        })
        .json<{
          data: {
            accessToken: string
            refreshToken: string
          }
          isSuccess: boolean
        }>()

      if (res.isSuccess) {
        localStorage.setItem('accessToken', res.data.accessToken)
        localStorage.setItem('refreshToken', res.data.refreshToken)
        await invalidateCurrentUser()
        navigate({
          to: '/',
          replace: true,
          search: { page: 1 },
        })
      }
    } catch (err) {
      if (err instanceof HTTPError) {
        const errorData = (await err.response.json()) as { message?: string }
        window.alert(
          errorData.message || '오류가 발생했습니다. 다시 시도해주세요.'
        )

        if (err.response.status === 400) {
          navigate({
            to: '/accounts/emailsignup',
            replace: true,
          })
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    email: search.email,
    code,
    isLoading,
    handleCodeChange,
    handleVerify,
  }
}
