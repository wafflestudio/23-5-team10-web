import { useState, useCallback } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'

export function useCaptcha() {
  const navigate = useNavigate()
  const signupData = useSearch({ from: '/accounts/emailsignup/captcha' })

  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCaptchaClick = useCallback(() => {
    if (isVerified || isVerifying) return
    setIsVerifying(true)

    // 비순수 함수(Math.random)를 렌더링 단계가 아닌 핸들러 내부에서 실행
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

    const randomDelay = getNormalRandom(0, 3000)

    setTimeout(() => {
      setIsVerifying(false)
      setIsVerified(true)
    }, randomDelay)
  }, [isVerified, isVerifying])

  const handleRegister = useCallback(() => {
    if (!isVerified || isLoading) return

    setIsLoading(true)
    navigate({
      to: '/accounts/emailsignup/verification',
      search: {
        email: signupData.email,
        password: signupData.password,
        nickname: signupData.nickname,
        name: signupData.name,
        birthday: signupData.birthday,
      },
    })
    setIsLoading(false)
  }, [isVerified, isLoading, navigate, signupData])

  return {
    isVerifying,
    isVerified,
    isLoading,
    handleCaptchaClick,
    handleRegister,
  }
}
