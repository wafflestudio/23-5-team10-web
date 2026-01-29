import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { instance } from '@/shared/api/ky'
import { HTTPError } from 'ky'

export function useCaptcha() {
  const navigate = useNavigate()
  const signupData = useSearch({ from: '/accounts/emailsignup/captcha' })

  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getNormalRandom = (min: number, max: number): number => {
    let u = 0,
      v = 0
    while (u === 0) u = Math.random()
    while (v === 0) v = Math.random()

    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
    num = num / 6.0 + 0.5

    if (num > 1 || num < 0) return getNormalRandom(min, max)
    return num * (max - min) + min
  }

  const handleCaptchaClick = () => {
    if (isVerified || isVerifying) return
    setIsVerifying(true)

    const randomDelay = getNormalRandom(0, 3000)

    setTimeout(() => {
      setIsVerifying(false)
      setIsVerified(true)
    }, randomDelay)
  }

  const handleRegister = async () => {
    if (!isVerified || isLoading) return
    setIsLoading(true)

    try {
      const res = await instance
        .post('api/v1/auth/register', {
          json: {
            email: signupData.email,
            password: signupData.password,
            nickname: signupData.nickname,
            name: signupData.name,
            birthday: signupData.birthday,
          },
        })
        .json<{ success: boolean; data: { accessToken: string } }>()

      if (res.success) {
        localStorage.setItem('accessToken', res.data.accessToken)
        navigate({
          to: '/accounts/emailsignup/verification',
          search: { email: signupData.email },
        })
      }
    } catch (err) {
      if (err instanceof HTTPError) {
        const errorData = (await err.response.json()) as { message?: string }
        alert(errorData.message || '가입 처리 중 오류가 발생했습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isVerifying,
    isVerified,
    isLoading,
    handleCaptchaClick,
    handleRegister,
  }
}
