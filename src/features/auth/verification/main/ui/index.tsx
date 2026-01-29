import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AppFooter } from '@/shared/ui/app-footer'
import { useVerification } from '../model'
import verificationIcon from '@/assets/verification-security.png'

export function VerificationPage() {
  const navigate = useNavigate()
  const { email, code, isLoading, handleCodeChange, handleVerify } =
    useVerification()

  const [showToast, setShowToast] = useState(false)
  const [lastRequestedTime, setLastRequestedTime] = useState<number>(0)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleResendCode = () => {
    const now = Date.now()
    const diff = (now - lastRequestedTime) / 1000

    if (diff < 5) {
      alert(`잠시 후 다시 시도해주세요. (${Math.ceil(5 - diff)}초 남음)`)
      return
    }

    setLastRequestedTime(now)
    setShowToast(true)
  }

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3100)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  return (
    <div className="flex min-h-screen w-full flex-col bg-white text-center">
      <main className="flex flex-grow flex-col items-center justify-center p-4 py-10">
        <div className="mt-8 flex w-full max-w-[350px] flex-col items-center border border-gray-300 bg-white p-8 pt-10 shadow-sm">
          <img
            src={verificationIcon}
            alt="Security Verification"
            className="mb-4 h-20 w-20 object-contain"
          />

          <h2 className="mb-3 text-base font-semibold text-[#262626]">
            마지막 단계
          </h2>

          <p className="mb-6 px-4 text-sm leading-relaxed text-[#262626]">
            <span className="font-semibold">{email}</span>으로 전송된 6자리
            코드를 입력하세요
          </p>

          <div className="w-full">
            <input
              type="text"
              placeholder="######"
              maxLength={6}
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="mb-4 w-full rounded border border-gray-300 bg-[#fafafa] p-2 text-left text-sm outline-none focus:border-gray-400"
            />
          </div>

          <button
            disabled={code.length !== 6 || isLoading}
            onClick={handleVerify}
            className={`mb-6 w-full rounded py-1.5 text-sm font-semibold text-white transition-opacity ${
              code.length === 6 && !isLoading
                ? 'bg-[#4a5df9] hover:opacity-90'
                : 'cursor-default bg-[#4a5df9] opacity-30'
            }`}
          >
            {isLoading ? '확인 중...' : '확인'}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#4a5df9]">
            <button
              onClick={() =>
                navigate({
                  to: '/accounts/emailsignup/email-change',
                  search: (prev) => ({
                    ...prev,
                    email: prev.email || email,
                    password: prev.password || '',
                    nickname: prev.nickname || '',
                  }),
                })
              }
              className="hover:opacity-70"
            >
              이메일 주소 변경
            </button>
            <span className="text-[10px] text-gray-300">|</span>
            <button onClick={handleResendCode} className="hover:opacity-70">
              새 코드 요청하기
            </button>
          </div>
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
        <AppFooter />
      </footer>

      {showToast && (
        <div
          style={{
            animation:
              'slideDoubleFast 3.1s cubic-bezier(0.1, 1, 0.1, 1) forwards',
          }}
          className="fixed bottom-0 left-0 z-[100] flex w-full bg-[#555555] px-4 py-2 shadow-2xl"
        >
          <style>{`@keyframes slideDoubleFast { 0% { transform: translateY(100%); } 2.5% { transform: translateY(0%); } 97.5% { transform: translateY(0%); } 100% { transform: translateY(100%); } }`}</style>
          <span className="block text-left text-[14px] font-medium text-white">
            새로운 인증 코드를 {email} 주소로 보내드렸습니다.
          </span>
        </div>
      )}
    </div>
  )
}
