import { MessageCircle } from 'lucide-react'
import instagramLogo from '@/assets/instagram-logo.svg'
import { AppFooter } from '@/shared/ui/app-footer'
import { FloatingInput } from '@/shared/ui/floating-input'
import { useEmailSignup } from './model'
import { useNavigate } from '@tanstack/react-router'

export function EmailSignupPage() {
  const navigate = useNavigate()
  const {
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
  } = useEmailSignup()

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <main className="flex flex-grow flex-col items-center justify-center p-4 py-10">
        <div className="mb-2.5 flex w-full max-w-[388px] flex-col items-center border border-gray-300 bg-white p-11 pb-8 shadow-sm">
          <img src={instagramLogo} alt="Instagram" className="mb-4 w-[175px]" />
          <h2 className="mb-5 text-center text-[17px] font-semibold text-gray-500">
            친구들의 사진과 동영상을 보려면 가입하세요.
          </h2>
          <button
            type="button"
            className="mb-6 flex h-[34px] w-full items-center justify-center gap-2 rounded bg-[#FEE500] text-[14px] font-semibold text-[#191919] transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4 fill-[#191919] stroke-none" />
            카카오톡으로 로그인
          </button>
          <div className="mb-6 flex w-full items-center text-gray-400">
            <div className="h-px flex-1 bg-gray-300"></div>
            <span className="px-4 text-[13px] font-semibold text-gray-500">
              또는
            </span>
            <div className="h-px flex-1 bg-gray-300"></div>
          </div>
          <form
            className="flex w-full flex-col gap-0.5"
            onSubmit={handleSignup}
          >
            <FloatingInput
              label="이메일 주소"
              value={formData.contact}
              error={errors.contact}
              touched={touched.contact}
              isValid={!!(formData.contact && !errors.contact)}
              onChange={(v) => {
                setFormData({ ...formData, contact: v })
                setServerErrors((prev) => ({ ...prev, contact: '' }))
              }}
              onBlur={() => setTouched({ ...touched, contact: true })}
            />
            <FloatingInput
              label="성명"
              value={formData.name}
              error={errors.name}
              touched={touched.name}
              isValid={formData.name.length > 0 && !errors.name}
              onChange={(v) => setFormData({ ...formData, name: v })}
              onBlur={() => setTouched({ ...touched, name: true })}
            />
            <FloatingInput
              label="사용자 이름"
              value={formData.username}
              error={errors.username}
              touched={touched.username}
              isValid={isNicknameAvailable && !errors.username}
              isUsernameField={true}
              hasCheckedNickname={hasCheckedNickname}
              isCheckingNickname={isCheckingNickname}
              onRefreshClick={handleRefreshNickname}
              onChange={(v) => {
                const lowerV = v.toLowerCase().replace(/\s/g, '')
                setFormData({ ...formData, username: lowerV })
                setServerErrors((prev) => ({ ...prev, username: '' }))
                setIsNicknameAvailable(false)
              }}
              onBlur={handleUsernameBlur}
            />
            <FloatingInput
              label="비밀번호"
              type={showPw ? 'text' : 'password'}
              value={formData.password}
              showPw={showPw}
              setShowPw={setShowPw}
              isValid={formData.password.length >= 6}
              onChange={(v) => setFormData({ ...formData, password: v })}
              onBlur={() => setTouched({ ...touched, password: true })}
            />
            <button
              disabled={!isButtonActive}
              className={`mt-4 h-[32px] rounded text-sm font-semibold text-white transition-colors ${isButtonActive ? 'bg-[#0095f6] hover:bg-[#1877f2]' : 'bg-[#b2dffc]'}`}
            >
              {isSubmitting ? '처리 중...' : '가입'}
            </button>
          </form>
        </div>
        <div className="flex w-full max-w-[388px] justify-center border border-gray-300 bg-white p-6 shadow-sm">
          <p className="text-sm">
            계정이 있으신가요?{' '}
            <button
              onClick={() => navigate({ to: '/login' })}
              className="font-semibold text-[#0095f6] hover:underline"
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
