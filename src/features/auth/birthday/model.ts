import { useState, useMemo } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { instance } from '@/shared/api/ky'

export function useBirthday() {
  const navigate = useNavigate()
  const signupData = useSearch({ from: '/accounts/emailsignup/birthday' })

  const currentYear = new Date().getFullYear()
  const [birthDate, setBirthDate] = useState({
    year: currentYear.toString(),
    month: '1',
    day: '1',
  })

  const years = useMemo(
    () => Array.from({ length: 100 }, (_, i) => (currentYear - i).toString()),
    [currentYear]
  )

  const months = useMemo(
    () => Array.from({ length: 12 }, (_, i) => (i + 1).toString()),
    []
  )

  const days = useMemo(() => {
    const lastDay = new Date(
      Number(birthDate.year),
      Number(birthDate.month),
      0
    ).getDate()
    return Array.from({ length: lastDay }, (_, i) => (i + 1).toString())
  }, [birthDate.year, birthDate.month])

  const age = useMemo(() => {
    const today = new Date()
    const birth = new Date(
      Number(birthDate.year),
      Number(birthDate.month) - 1,
      Number(birthDate.day)
    )
    let calculatedAge = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      calculatedAge--
    }
    return calculatedAge
  }, [birthDate])

  const handleNext = async () => {
    try {
      const formattedBirthday = `${birthDate.year}-${birthDate.month.padStart(2, '0')}-${birthDate.day.padStart(2, '0')}`

      const res = await instance
        .post('api/v1/auth/register', {
          json: {
            email: signupData.email,
            password: signupData.password,
            nickname: signupData.nickname,
            name: signupData.name,
            birthday: formattedBirthday,
          },
        })
        .json<{ success: boolean; data: { accessToken: string } }>()

      if (res.success) {
        localStorage.setItem('accessToken', res.data.accessToken)
        navigate({ to: '/' })
      }
    } catch (err) {
      console.error(err)
    }
  }

  return {
    birthDate,
    setBirthDate,
    years,
    months,
    days,
    age,
    handleNext,
  }
}
