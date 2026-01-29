import { useEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { AppFooter } from '@/shared/ui/app-footer'
import { useEmailChange } from '../model'
import verificationIcon from '@/assets/verification-security.png'

export function EmailChangePage() {
  const navigate = useNavigate()
  const signupData = useSearch({ from: '/accounts/emailsignup/email-change' })
  const {
    currentEmail,
    newEmail,
    error,
    isLoading,
    isButtonActive,
    handleEmailChange,
    handleBlur,
    handleSubmit,
  } = useEmailChange()

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
        <div className="mt-8 flex w-full max-w-[350px] flex-col items-center border border-gray-300 bg-white p-8 pt-10 shadow-sm">
          <img
            src={verificationIcon}
            alt="Security Verification"
            className="mb-4 h-20 w-20 object-contain"
          />
          <h2 className="mb-1 text-base font-semibold text-[#262626]">
            이메일 주소 변경
          </h2>
          <p className="mb-2 text-sm text-[#262626]">현재 이메일 주소:</p>
          <p className="mb-6 text-sm font-semibold text-[#262626]">
            {currentEmail}
          </p>
          <div className="w-full">
            <input
              type="email"
              placeholder="새 이메일 주소"
              value={newEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={handleBlur}
              className={`w-full rounded border bg-[#fafafa] p-2 text-left text-sm outline-none focus:border-gray-400 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error && (
              <p className="mt-1.5 text-left text-xs text-red-500">{error}</p>
            )}
          </div>
          <button
            disabled={!isButtonActive}
            onClick={handleSubmit}
            className={`mt-4 mb-6 w-full rounded py-1.5 text-sm font-semibold text-white transition-opacity ${
              isButtonActive
                ? 'bg-[#4a5df9] hover:opacity-90'
                : 'cursor-default bg-[#4a5df9] opacity-30'
            }`}
          >
            {isLoading ? '확인 중...' : '변경'}
          </button>
          <button
            onClick={() => window.history.back()}
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
      <footer className="shrink-0 bg-white py-8">
        <AppFooter
          onLocationClick={() =>
            navigate({
              to: '/explore/locations',
              search: {
                ...signupData,
              },
            })
          }
          onLiteClick={() =>
            navigate({
              to: '/web/lite',
              search: {
                ...signupData,
              },
            })
          }
        />
      </footer>
    </div>
  )
}
