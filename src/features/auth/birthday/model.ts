import { useState, useMemo } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'

export function useBirthday() {
  const navigate = useNavigate()
  const signupData = useSearch({ from: '/accounts/emailsignup/birthday' })

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = (now.getMonth() + 1).toString()
  const currentDay = now.getDate().toString()

  const [birthDate, setBirthDate] = useState({
    year: currentYear.toString(),
    month: currentMonth,
    day: currentDay,
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

  const isAgeValid = useMemo(() => {
    const birth = new Date(
      Number(birthDate.year),
      Number(birthDate.month) - 1,
      Number(birthDate.day)
    )
    const ageLimitDate = new Date(
      now.getFullYear() - 5,
      now.getMonth(),
      now.getDate()
    )
    return birth <= ageLimitDate
  }, [birthDate, now])

  const handleNext = (): void => {
    if (!isAgeValid) return

    const formattedBirthday = `${birthDate.year}-${birthDate.month.padStart(2, '0')}-${birthDate.day.padStart(2, '0')}`

    navigate({
      to: '/accounts/emailsignup/captcha',
      search: {
        email: signupData.email ?? '',
        name: signupData.name ?? '',
        nickname: signupData.nickname ?? '',
        password: signupData.password ?? '',
        birthday: formattedBirthday,
      },
    })
  }

  return {
    birthDate,
    setBirthDate,
    years,
    months,
    days,
    isAgeValid,
    handleNext,
  }
}
