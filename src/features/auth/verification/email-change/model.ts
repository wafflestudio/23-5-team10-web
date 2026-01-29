import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { instance } from '@/shared/api/ky'
import { HTTPError } from 'ky'

export function useEmailChange() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/accounts/emailsignup/email-change' })

  const [newEmail, setNewEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [touched, setTouched] = useState(false)

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  const error =
    serverError ||
    (newEmail && !emailRegex.test(newEmail)
      ? '올바른 이메일 주소를 입력하세요.'
      : null) ||
    (newEmail === search.email ? '기존 이메일 주소와 동일합니다.' : null)

  const checkEmailDuplicate = async (email: string) => {
    if (!email || error || email === search.email) return

    setIsLoading(true)
    try {
      await instance
        .post('api/v1/auth/check-account', {
          json: { identity: email },
        })
        .json()

      setServerError('이미 사용 중인 이메일입니다.')
    } catch (err) {
      if (err instanceof HTTPError && err.response.status === 404) {
        setServerError('')
      } else {
        setServerError('검사 중 오류가 발생했습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = (value: string) => {
    setNewEmail(value)
    setServerError('')
  }

  const handleBlur = () => {
    setTouched(true)
    checkEmailDuplicate(newEmail)
  }

  const handleSubmit = async () => {
    if (!newEmail || error || isLoading) return

    await checkEmailDuplicate(newEmail)

    if (!error && !serverError && newEmail) {
      navigate({
        to: '/accounts/emailsignup/verification',
        search: { email: newEmail },
      })
    }
  }

  const isButtonActive = !!(newEmail && !error && !isLoading)

  return {
    currentEmail: search.email,
    newEmail,
    error,
    isLoading,
    touched,
    isButtonActive,
    handleEmailChange,
    handleBlur,
    handleSubmit,
  }
}
