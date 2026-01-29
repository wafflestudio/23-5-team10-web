import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { instance } from '@/shared/api/ky'
import { generateRandomId } from '@/shared/lib/auth.utils'
import { HTTPError } from 'ky'

export function useEmailSignup() {
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingNickname, setIsCheckingNickname] = useState(false)
  const [hasCheckedNickname, setHasCheckedNickname] = useState(false)
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false)
  const [lastCheckedNickname, setLastCheckedNickname] = useState('')

  const [serverErrors, setServerErrors] = useState({
    contact: '',
    username: '',
  })
  const [formData, setFormData] = useState({
    contact: '',
    password: '',
    name: '',
    username: '',
  })
  const [touched, setTouched] = useState({
    contact: false,
    password: false,
    name: false,
    username: false,
  })

  const errors = {
    contact:
      serverErrors.contact ||
      (formData.contact &&
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.contact)
        ? '올바른 이메일 주소를 입력하세요.'
        : null),
    password:
      formData.password && formData.password.length < 6
        ? '여섯 자리 이상의 비밀번호를 입력하세요.'
        : null,
    name:
      formData.name.length >= 64 ? '이름을 64자 미만으로 입력하세요.' : null,
    username:
      serverErrors.username ||
      (formData.username &&
        (!/^[a-z0-9._]+$/.test(formData.username)
          ? '사용자 이름에는 영문 소문자, 숫자, 밑줄 및 마침표만 사용할 수 있습니다.'
          : null)),
  }

  const checkDuplicate = async (identity: string): Promise<boolean> => {
    try {
      await instance
        .post('api/v1/auth/check-account', {
          json: { identity },
        })
        .json()
      return true
    } catch (err) {
      if (err instanceof HTTPError && err.response.status === 404) {
        return false
      }
      throw err
    }
  }

  const handleUsernameBlur = async () => {
    setTouched({ ...touched, username: true })
    if (
      !formData.username ||
      errors.username ||
      formData.username === lastCheckedNickname
    )
      return

    setIsCheckingNickname(true)
    setHasCheckedNickname(true)
    try {
      const exists = await checkDuplicate(formData.username)
      setIsNicknameAvailable(!exists)
      setLastCheckedNickname(formData.username)
      if (exists) {
        setServerErrors((prev) => ({
          ...prev,
          username: '이미 사용 중인 사용자 이름입니다.',
        }))
      }
    } catch {
      setIsNicknameAvailable(false)
    } finally {
      setIsCheckingNickname(false)
    }
  }

  const handleRefreshNickname = async () => {
    setIsCheckingNickname(true)
    setHasCheckedNickname(true)

    let available = false
    let newId = ''
    let attempts = 0

    while (!available && attempts < 5) {
      newId = generateRandomId(formData.name || formData.contact || 'user')
      try {
        const exists = await checkDuplicate(newId)
        if (!exists) available = true
      } catch {
        available = true
      }
      attempts++
    }

    setFormData((prev) => ({ ...prev, username: newId }))
    setLastCheckedNickname(newId)
    setServerErrors((prev) => ({ ...prev, username: '' }))
    setIsNicknameAvailable(true)
    setIsCheckingNickname(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setServerErrors({ contact: '', username: '' })

    try {
      const [emailExists, nicknameExists] = await Promise.all([
        checkDuplicate(formData.contact),
        checkDuplicate(formData.username),
      ])

      if (emailExists || nicknameExists) {
        setServerErrors({
          contact: emailExists ? '이미 사용 중인 이메일입니다.' : '',
          username: nicknameExists ? '이미 사용 중인 사용자 이름입니다.' : '',
        })
        setIsNicknameAvailable(!nicknameExists)
        return
      }

      navigate({
        to: '/accounts/emailsignup/birthday',
        search: {
          email: formData.contact,
          password: formData.password,
          name: formData.name,
          nickname: formData.username,
        },
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isButtonActive =
    !!(formData.contact && !errors.contact) &&
    formData.password.length >= 6 &&
    formData.name.length > 0 &&
    !errors.username &&
    !isSubmitting

  return {
    formData,
    setFormData,
    touched,
    setTouched,
    showPw,
    setShowPw,
    errors,
    isSubmitting,
    isCheckingNickname,
    hasCheckedNickname,
    isNicknameAvailable,
    isButtonActive,
    handleSignup,
    handleUsernameBlur,
    handleRefreshNickname,
    setServerErrors,
    setIsNicknameAvailable,
  }
}
