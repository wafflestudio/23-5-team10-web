import cakeIcon from '@/assets/birthday-cake.png'
import { AppFooter } from '@/shared/ui/app-footer'
import { useBirthday } from './model'
import { useNavigate } from '@tanstack/react-router'

export function BirthdayPage() {
  const navigate = useNavigate()
  const { birthDate, setBirthDate, years, months, days, handleNext } =
    useBirthday()

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <main className="flex flex-grow flex-col items-center justify-center p-4 py-10">
        <div className="flex w-full max-w-[350px] flex-col items-center border border-gray-300 bg-white p-8 shadow-sm">
          <img
            src={cakeIcon}
            alt="Birthday Cake"
            className="mb-4 h-24 w-48 object-contain"
          />

          <h2 className="mb-3 text-center text-base font-semibold">
            생일 추가
          </h2>

          <p className="text-center text-sm">
            공개 프로필에 포함되지 않습니다.
          </p>
          <button className="mb-4 text-center text-sm font-semibold text-[#0095f6] hover:text-[#00376b]">
            왜 생년월일을 입력해야 하나요?
          </button>

          <div className="mb-2 flex w-full gap-2">
            <select
              className="flex-1 rounded border border-gray-300 bg-white p-2 text-[12px] text-gray-500 outline-none focus:border-gray-400"
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
              className="flex-1 rounded border border-gray-300 bg-white p-2 text-[12px] text-gray-500 outline-none focus:border-gray-400"
              value={birthDate.day}
              onChange={(e) =>
                setBirthDate({ ...birthDate, day: e.target.value })
              }
            >
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}일
                </option>
              ))}
            </select>
            <select
              className="flex-1 rounded border border-gray-300 bg-white p-2 text-[12px] text-gray-500 outline-none focus:border-gray-400"
              value={birthDate.year}
              onChange={(e) =>
                setBirthDate({ ...birthDate, year: e.target.value })
              }
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}년
                </option>
              ))}
            </select>
          </div>

          <p className="mb-4 text-center text-xs text-gray-500">
            {birthDate.year}년 {birthDate.month}월 {birthDate.day}일
          </p>

          <p className="mb-6 text-center text-xs text-gray-500">
            비즈니스나 반려동물 등을 위한 계정인 경우에도 회원님의 생년월일을
            사용하세요
          </p>

          <button
            onClick={handleNext}
            className="mb-4 w-full rounded bg-[#0095f6] py-1.5 text-sm font-semibold text-white hover:bg-[#1877f2]"
          >
            다음
          </button>

          <button
            onClick={() => navigate({ to: '/accounts/emailsignup' })}
            className="text-center text-sm font-semibold text-[#0095f6]"
          >
            돌아가기
          </button>
        </div>

        <div className="mt-2.5 flex w-full max-w-[350px] justify-center border border-gray-300 bg-white p-6 shadow-sm">
          <p className="text-sm">
            계정이 있으신가요?{' '}
            <button
              onClick={() => navigate({ to: '/login' })}
              className="font-semibold text-[#0095f6]"
            >
              로그인
            </button>
          </p>
        </div>
      </main>
      <footer className="shrink-0 bg-white py-8">
        <AppFooter />
      </footer>
    </div>
  )
}
