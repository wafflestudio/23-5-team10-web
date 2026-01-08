import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Lock } from 'lucide-react'
import instagramLogo from '../../assets/instagram-logo.svg'
import LoginFooter from '../../components/auth/LoginFooter'

export const Route = createFileRoute('/password/reset')({
  component: PasswordResetPage,
})

function PasswordResetPage() {
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const isButtonActive = inputValue.length > 0
  const isFloating = isFocused || inputValue.length > 0

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-white">
      <nav className="fixed top-0 left-0 z-50 flex h-[60px] w-full items-center justify-center border-b border-gray-300 bg-white px-4">
        <div className="flex w-full max-w-[935px] items-center justify-between">
          <img
            src={instagramLogo}
            alt="Instagram"
            className="w-[103px] cursor-pointer"
            onClick={() => navigate({ to: '/login' })}
          />
          <div className="flex gap-4">
            <button
              onClick={() => navigate({ to: '/login' })}
              className="rounded bg-[#0095f6] px-4 py-1.5 text-sm font-semibold text-white"
            >
              로그인
            </button>
            <button
              onClick={() => navigate({ to: '/accounts/emailsignup' })}
              className="text-sm font-semibold text-[#0095f6]"
            >
              가입하기
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto pt-[60px]">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="flex w-full max-w-[388px] flex-col items-center border border-gray-300 bg-white">
            <div className="flex flex-col items-center p-11 pt-8 pb-4 text-center">
              <div className="mb-4 flex h-[96px] w-[96px] items-center justify-center rounded-full border-[2px] border-black">
                <Lock size={48} strokeWidth={1.2} />
              </div>

              <h2 className="mb-4 text-base font-semibold text-gray-900">
                로그인에 문제가 있나요?
              </h2>
              <p className="mb-6 text-sm leading-tight text-gray-500">
                이메일 주소, 전화번호 또는 사용자 이름을 입력하시면 계정에 다시
                액세스할 수 있는 링크를 보내드립니다.
              </p>

              <form
                className="mb-4 w-full"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="relative mb-4 h-[38px] w-full">
                  <label
                    className={`pointer-events-none absolute left-2 text-gray-500 transition-all duration-100 ease-out ${
                      isFloating
                        ? 'top-1 text-[10px]'
                        : 'top-1/2 -translate-y-1/2 text-[12px]'
                    }`}
                  >
                    이메일, 전화번호, 사용자 이름
                  </label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`h-full w-full rounded-sm border border-gray-300 bg-[#fafafa] px-2 text-[10px] focus:border-gray-400 focus:outline-none ${
                      isFloating ? 'pt-3' : ''
                    }`}
                  />
                </div>

                <button
                  disabled={!isButtonActive}
                  className={`h-[32px] w-full rounded text-sm font-semibold text-white transition-colors ${
                    isButtonActive ? 'bg-[#0095f6]' : 'bg-[#b2dffc]'
                  }`}
                >
                  로그인 링크 보내기
                </button>
              </form>

              <a
                href="https://help.instagram.com/1068717813216421"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-8 text-xs font-semibold text-[#0095f6] hover:underline"
              >
                비밀번호를 재설정할 수 없나요?
              </a>

              <div className="mb-8 flex w-full items-center text-gray-400">
                <div className="h-px flex-1 bg-gray-300"></div>
                <span className="px-4 text-[13px] font-semibold text-gray-500">
                  또는
                </span>
                <div className="h-px flex-1 bg-gray-300"></div>
              </div>

              <button
                onClick={() => navigate({ to: '/accounts/emailsignup' })}
                className="mb-4 text-sm font-semibold text-gray-900 hover:text-gray-500"
              >
                새 계정 만들기
              </button>
            </div>

            <button
              onClick={() => navigate({ to: '/login' })}
              className="flex h-[44px] w-full items-center justify-center border-t border-gray-300 bg-[#fafafa] text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100"
            >
              로그인으로 돌아가기
            </button>
          </div>
        </div>

        <footer className="bg-white pb-8">
          <LoginFooter />
        </footer>
      </main>
    </div>
  )
}
