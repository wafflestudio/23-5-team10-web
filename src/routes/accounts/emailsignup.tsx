import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { MessageCircle } from 'lucide-react'
import instagramLogo from '@/assets/instagram-logo.svg'
import { AppFooter } from '@/shared/ui/app-footer'
import { FloatingInput } from '@/shared/ui/floating-input'
import { generateRandomId } from '@/shared/lib/auth.utils'
import { instance } from '@/shared/api/ky'

export const Route = createFileRoute('/accounts/emailsignup')({
  component: EmailSignupPage,
})

function EmailSignupPage() {
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
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

  const [isCheckingNickname, setIsCheckingNickname] = useState(false)
  const [hasCheckedNickname, setHasCheckedNickname] = useState(false)
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false)
  const [lastCheckedNickname, setLastCheckedNickname] = useState('')

  const checkNicknameAvailability = async (nickname: string) => {
    if (!nickname || nickname === lastCheckedNickname || errors.username) return
    setIsCheckingNickname(true)
    setHasCheckedNickname(true)
    try {
      const res = await instance
        .get('api/v1/auth/check-nickname', { searchParams: { nickname } })
        .json<{ data: { isAvailable: boolean } }>()
      setIsNicknameAvailable(res.data.isAvailable)
      setLastCheckedNickname(nickname)
    } catch {
      setIsNicknameAvailable(false)
    } finally {
      setIsCheckingNickname(false)
    }
  }

  const handleRefreshNickname = async () => {
    let available = false
    let newId = ''
    setIsCheckingNickname(true)
    while (!available) {
      newId = generateRandomId(formData.username)
      try {
        const res = await instance
          .get('api/v1/auth/check-nickname', {
            searchParams: { nickname: newId },
          })
          .json<{ data: { isAvailable: boolean } }>()
        if (res.data.isAvailable) available = true
      } catch {
        available = true
      }
    }
    setFormData((prev) => ({ ...prev, username: newId }))
    setLastCheckedNickname(newId)
    setIsNicknameAvailable(true)
    setIsCheckingNickname(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await instance
        .post('api/v1/auth/register', {
          json: {
            email: formData.contact,
            password: formData.password,
            nickname: formData.username,
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

  const errors = {
    contact:
      formData.contact &&
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.contact)
        ? '올바른 이메일 주소를 입력하세요.'
        : null,
    password:
      formData.password && formData.password.length < 6
        ? '여섯 자리 이상의 비밀번호를 입력하세요.'
        : null,
    name:
      formData.name.length >= 64 ? '이름을 64자 미만으로 입력하세요.' : null,
    username:
      formData.username &&
      (!/^[a-z0-9._]+$/.test(formData.username)
        ? '사용자 이름에는 영문 소문자, 숫자, 밑줄 및 마침표만 사용할 수 있습니다.'
        : /^[._]|[. _]$/.test(formData.username)
          ? '사용자 이름의 시작이나 끝에 마침표나 밑줄을 사용할 수 없습니다.'
          : /\.\./.test(formData.username)
            ? '마침표를 연속해서 사용할 수 없습니다.'
            : formData.username.length > 30
              ? '사용자 이름은 30자 이하여야 합니다.'
              : null),
  }

  const isButtonActive =
    !!(formData.contact && !errors.contact) &&
    formData.password.length >= 6 &&
    formData.name.length > 0 &&
    !errors.username && // 추가된 형식 검사 통과 여부
    isNicknameAvailable

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
            <MessageCircle className="h-4 w-4 fill-[#191919] stroke-none" />{' '}
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
              onChange={(v) => setFormData({ ...formData, contact: v })}
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
                const lowerV = v.toLowerCase().replace(/\s/g, '') // 공백 제거 및 소문자 강제
                setFormData({ ...formData, username: lowerV })
                if (lowerV !== lastCheckedNickname)
                  setIsNicknameAvailable(false)
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, username: true }))
                checkNicknameAvailability(formData.username)
              }}
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
              className={`mt-4 h-[32px] rounded text-sm font-semibold text-white ${isButtonActive ? 'bg-[#4a5df9]' : 'bg-[#b2dffc]'}`}
            >
              가입
            </button>
          </form>
        </div>
        <div className="flex w-full max-w-[388px] justify-center border border-gray-300 bg-white p-6 shadow-sm">
          <p className="text-sm">
            계정이 있으신가요?{' '}
            <button
              onClick={() => navigate({ to: '/login' })}
              className="font-semibold text-[#4a5df9] hover:underline"
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

export default EmailSignupPage
