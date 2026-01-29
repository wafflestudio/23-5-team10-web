import { useState, useEffect } from 'react'
import cakeIcon from '@/assets/birthday-cake.png'
import { AppFooter } from '@/shared/ui/app-footer'
import { useBirthday } from '../model'
import { useNavigate } from '@tanstack/react-router'
import { BirthdayModal } from './birthday-modal'

export function BirthdayPage() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {
    birthDate,
    setBirthDate,
    years,
    months,
    days,
    isAgeValid,
    handleNext,
  } = useBirthday()

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col bg-white text-center">
      <main className="flex flex-grow flex-col items-center justify-center p-4 py-10">
        <div className="mt-8 flex w-full max-w-[350px] flex-col items-center border border-gray-300 bg-white p-8 pt-12 shadow-sm">
          <img
            src={cakeIcon}
            alt="Birthday Cake"
            className="mb-4 h-24 w-48 object-contain"
          />
          <h2 className="mb-3 text-base font-semibold text-[#262626]">
            생일 추가
          </h2>
          <p className="text-sm text-[#262626]">
            공개 프로필에 포함되지 않습니다.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mb-4 text-sm font-semibold text-[#4a5df9] hover:opacity-70"
          >
            왜 생년월일을 입력해야 하나요?
          </button>
          <div className="mb-2 flex w-full justify-center gap-2">
            <select
              className="w-[70px] rounded border border-gray-300 bg-white p-2 text-[12px] text-gray-500 outline-none focus:border-gray-400"
              value={birthDate.month}
              onChange={(e) =>
                setBirthDate({ ...birthDate, month: e.target.value })
              }
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}월
                </option>
              ))}
            </select>
            <select
              className="w-[52px] rounded border border-gray-300 bg-white p-2 text-[12px] text-gray-500 outline-none focus:border-gray-400"
              value={birthDate.day}
              onChange={(e) =>
                setBirthDate({ ...birthDate, day: e.target.value })
              }
            >
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              className="w-[72px] rounded border border-gray-300 bg-white p-2 text-[12px] text-gray-500 outline-none focus:border-gray-400"
              value={birthDate.year}
              onChange={(e) =>
                setBirthDate({ ...birthDate, year: e.target.value })
              }
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <p className="mb-4 text-xs text-[#8e8e8e]">
            태어난 날짜를 입력해야 합니다
          </p>
          <p className="mb-6 px-2 text-xs leading-relaxed text-[#8e8e8e]">
            비즈니스나 반려동물 등을 위한 계정인 경우에도 회원님의 생년월일을
            사용하세요
          </p>
          <button
            onClick={handleNext}
            disabled={!isAgeValid}
            className={`mb-4 w-full rounded py-1.5 text-sm font-semibold text-white transition-opacity ${
              isAgeValid
                ? 'bg-[#4a5df9] hover:opacity-90'
                : 'cursor-default bg-[#4a5df9] opacity-30'
            }`}
          >
            다음
          </button>
          <button
            onClick={() => navigate({ to: '/accounts/emailsignup' })}
            className="text-sm font-semibold text-[#4a5df9] hover:opacity-70"
          >
            돌아가기
          </button>
        </div>
        <div className="mt-2.5 flex w-full max-w-[350px] justify-center border border-gray-300 bg-white p-6 shadow-sm">
          <p className="text-sm text-[#262626]">
            계정이 있으신가요?{' '}
            <button
              onClick={() => navigate({ to: '/login' })}
              className="font-semibold text-[#4a5df9] hover:opacity-70"
            >
              로그인
            </button>
          </p>
        </div>
      </main>
      <BirthdayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <footer className="shrink-0 bg-white py-8">
        <AppFooter />
      </footer>
    </div>
  )
}
