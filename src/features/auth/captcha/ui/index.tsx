import { useEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { AppFooter } from '@/shared/ui/app-footer'
import { useCaptcha } from '../model'

export function CaptchaPage() {
  const navigate = useNavigate()
  const signupData = useSearch({ from: '/accounts/emailsignup/captcha' })
  const {
    isVerifying,
    isVerified,
    isLoading,
    handleCaptchaClick,
    handleRegister,
  } = useCaptcha()

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
          <h2 className="mb-3 text-base font-semibold text-[#262626]">
            가입하기
          </h2>
          <p className="mb-6 text-sm text-[#262626]">이메일로 가입</p>
          <div className="mb-6 w-full rounded-sm border border-[#d3d3d3] bg-[#f9f9f9] p-2 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCaptchaClick}
                  className="flex h-7 w-7 items-center justify-center border-2 border-[#c1c1c1] bg-white transition-all"
                >
                  {isVerifying && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#4a5df9] border-t-transparent" />
                  )}
                  {isVerified && (
                    <svg
                      className="h-5 w-5 text-[#00a041]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
                <span className="text-[14px] text-[#262626]">
                  로봇이 아닙니다.
                </span>
              </div>
              <div className="flex scale-90 flex-col items-center">
                <img
                  src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
                  alt="reCAPTCHA"
                  className="h-7 w-7 object-contain opacity-70"
                />
                <span className="text-[8px] text-[#767676]">reCAPTCHA</span>
                <span className="text-[7px] text-[#767676]">
                  개인정보 보호 - 약관
                </span>
              </div>
            </div>
          </div>
          <div className="mb-6 space-y-4 px-2 text-left text-[11px] leading-snug text-[#8e8e8e]">
            <p>
              이는 유해한 행위를 방지하고 스팸을 감지 및 예방하며 제품의
              무결성을 유지하는 데 도움이 됩니다.
            </p>
            <p>
              Meta에서는 Google의 reCAPTCHA Enterprise 제품을 사용하여 이 보안
              확인 절차를 제공해왔습니다. 회원님의 reCAPTCHA Enterprise 사용에는
              Google의 개인정보처리방침과 이용 약관이 적용됩니다.
            </p>
            <p>
              reCAPTCHA Enterprise에서는 reCAPTCHA Enterprise를 제공, 유지 및
              개선하고 일반적인 보안 목적으로 사용하기 위해 기기, 앱 데이터 등의
              하드웨어 및 소프트웨어 정보를 수집하여 Google에 전송합니다. 이
              정보는 Google에서 광고를 맞춤화하는 데 사용되지 않습니다.
            </p>
          </div>
          <button
            disabled={!isVerified || isLoading}
            onClick={handleRegister}
            className={`mb-4 w-full rounded py-1.5 text-sm font-semibold text-white transition-opacity ${
              isVerified && !isLoading
                ? 'bg-[#4a5df9] hover:opacity-90'
                : 'cursor-default bg-[#4a5df9] opacity-30'
            }`}
          >
            {isLoading ? '가입 중...' : '다음'}
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
              search: { ...signupData },
            })
          }
          onLiteClick={() =>
            navigate({
              to: '/web/lite',
              search: { ...signupData },
            })
          }
        />
      </footer>
    </div>
  )
}
