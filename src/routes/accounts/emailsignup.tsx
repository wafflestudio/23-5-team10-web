import { useState, useRef, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { MessageCircle } from 'lucide-react'
import instagramLogo from '@/assets/instagram-logo.svg'
import { AppFooter } from '@/shared/ui/app-footer'
import { instance } from '@/shared/api/ky'

export const Route = createFileRoute('/accounts/emailsignup')({
  component: EmailSignupPage,
})

const generateRandomId = (base: string) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const randomSuffixLen = Math.floor(Math.random() * 3) + 2
  const randomSuffix = Array.from(
    { length: randomSuffixLen },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('')
  const cleanBase = base
    .replace(/[^a-zA-Z0-9._]/g, '')
    .toLowerCase()
    .slice(0, 15)
  return cleanBase ? `${cleanBase}_${randomSuffix}` : `user_${randomSuffix}`
}

interface FloatingInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  type?: string
  showPw?: boolean
  setShowPw?: (show: boolean) => void
  error?: string | null
  touched?: boolean
  isValid?: boolean
  isUsernameField?: boolean
  onRefreshClick?: () => void
  isCheckingNickname?: boolean
  hasCheckedNickname?: boolean
}

const FloatingInput = ({
  label,
  value,
  onChange,
  onBlur,
  type = 'text',
  showPw,
  setShowPw,
  error,
  touched,
  isValid,
  isUsernameField,
  onRefreshClick,
  isCheckingNickname,
  hasCheckedNickname,
}: FloatingInputProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const isFloating = isFocused || value.length > 0
  const showError = touched && error
  const isPasswordField = label === '비밀번호'

  const passwordBtnRef = useRef<HTMLButtonElement>(null)
  const [btnWidth, setBtnWidth] = useState(0)

  useEffect(() => {
    if (passwordBtnRef.current) {
      setBtnWidth(passwordBtnRef.current.offsetWidth)
    }
  }, [showPw, value])

  return (
    <div className="relative mb-0.5 w-full">
      <style>{`
        @keyframes spin-reverse-custom {
          from { transform: rotate(270deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-custom {
          animation: spin-reverse-custom 0.4s linear infinite;
        }
      `}</style>
      <div className="relative h-[38px] w-full">
        <label
          className={`pointer-events-none absolute left-2 text-gray-500 transition-all duration-100 ease-out ${
            isFloating
              ? 'top-1 text-[10px]'
              : 'top-1/2 -translate-y-1/2 text-[12px]'
          }`}
        >
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false)
            onBlur()
          }}
          className={`h-full w-full rounded-sm border ${
            showError ? 'border-red-500' : 'border-gray-300'
          } bg-[#fafafa] px-2 text-[12px] focus:border-gray-400 focus:outline-none ${
            isFloating ? 'pt-3' : ''
          }`}
          style={{
            paddingRight: isPasswordField
              ? `${btnWidth + 45}px`
              : isUsernameField
                ? '70px'
                : '45px',
          }}
        />

        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1.5">
          {isValid && (
            <div
              className="flex items-center justify-center text-[#8e8e8e]"
              style={{ transform: 'translateX(-4px)' }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path
                  d="m9 12 2 2 4-4"
                  style={{
                    transform: 'scale(1.25)',
                    transformOrigin: '11px 12px',
                  }}
                />
              </svg>
            </div>
          )}

          {isUsernameField && hasCheckedNickname && (
            <button
              type="button"
              onClick={onRefreshClick}
              className={`flex items-center justify-center text-[#0095f6] ${isCheckingNickname ? 'animate-spin-custom' : ''}`}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: 'translateX(-6px)' }}
              >
                <path d="M12 20a8 8 0 1 1 8-8" />
                <polyline points="15 11 19 15 23 11" />
              </svg>
            </button>
          )}

          {isPasswordField && value.length > 0 && setShowPw && (
            <button
              ref={passwordBtnRef}
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="h-[26px] rounded-[8px] border-[1.5px] border-gray-300 bg-transparent px-2 text-[12px] font-medium whitespace-nowrap text-gray-800 transition-colors hover:bg-gray-200/50"
            >
              {showPw ? '숨기기' : '비밀번호 표시'}
            </button>
          )}
        </div>
      </div>
      {showError && (
        <p className="mt-1 text-[11px] leading-tight text-red-500">{error}</p>
      )}
    </div>
  )
}

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
    if (!nickname || nickname === lastCheckedNickname) return

    setIsCheckingNickname(true)
    setHasCheckedNickname(true)
    try {
      const res = await instance
        .get('api/v1/auth/check-nickname', {
          searchParams: { nickname },
        })
        .json<{ data: { isAvailable: boolean } }>()

      setIsNicknameAvailable(res.data.isAvailable)
      setLastCheckedNickname(nickname)
    } catch {
      setIsNicknameAvailable(false)
    } finally {
      setIsCheckingNickname(false)
    }
  }

  const handleUsernameBlur = () => {
    setTouched((prev) => ({ ...prev, username: true }))
    checkNicknameAvailability(formData.username)
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
    username: null,
  }

  const isContactValid = !!(formData.contact && !errors.contact)
  const isPasswordValid = !!(formData.password.length >= 6)
  const isNameValid = !!(formData.name.length > 0 && !errors.name)
  const isButtonActive =
    isContactValid && isPasswordValid && isNameValid && isNicknameAvailable

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
              isValid={isContactValid}
              onChange={(v) => setFormData({ ...formData, contact: v })}
              onBlur={() => setTouched({ ...touched, contact: true })}
            />
            <FloatingInput
              label="성명"
              value={formData.name}
              error={errors.name}
              touched={touched.name}
              isValid={isNameValid}
              onChange={(v) => setFormData({ ...formData, name: v })}
              onBlur={() => setTouched({ ...touched, name: true })}
            />
            <FloatingInput
              label="사용자 이름"
              value={formData.username}
              touched={touched.username}
              isValid={isNicknameAvailable}
              isUsernameField={true}
              hasCheckedNickname={hasCheckedNickname}
              isCheckingNickname={isCheckingNickname}
              onRefreshClick={handleRefreshNickname}
              onChange={(v) => {
                setFormData({ ...formData, username: v })
                if (v !== lastCheckedNickname) {
                  setIsNicknameAvailable(false)
                }
              }}
              onBlur={handleUsernameBlur}
            />
            <FloatingInput
              label="비밀번호"
              type={showPw ? 'text' : 'password'}
              value={formData.password}
              showPw={showPw}
              setShowPw={setShowPw}
              isValid={isPasswordValid}
              onChange={(v) => setFormData({ ...formData, password: v })}
              onBlur={() => setTouched({ ...touched, password: true })}
            />

            <div className="my-5 text-left text-[12px] leading-4 text-gray-500">
              저희 서비스를 이용하는 사람이 회원님의 연락처 정보를 Instagram에
              업로드했을 수도 있습니다.{' '}
              <a
                href="https://www.facebook.com/help/instagram/261704639352628"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#4a5df9] hover:underline"
              >
                더 알아보기
              </a>
            </div>

            <button
              disabled={!isButtonActive}
              className={`h-[32px] rounded text-sm font-semibold text-white transition-colors ${isButtonActive ? 'bg-[#4a5df9]' : 'bg-[#b2dffc]'}`}
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
