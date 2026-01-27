import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { MessageCircle } from 'lucide-react'
import instagramLogo from '@/assets/instagram-logo.svg'
import { AppFooter } from '@/shared/ui/app-footer'

export const Route = createFileRoute('/accounts/emailsignup')({
  component: EmailSignupPage,
})

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
}: FloatingInputProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const isFloating = isFocused || value.length > 0
  const showError = touched && error

  return (
    <div className="relative mb-0.5 w-full">
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
          } bg-[#fafafa] px-2 text-[10px] focus:border-gray-400 focus:outline-none ${
            isFloating ? 'pt-3' : ''
          }`}
        />
        {label === '비밀번호' && value.length > 0 && setShowPw && (
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute top-1/2 right-2 h-[26px] -translate-y-1/2 rounded-[8px] border-[1.5px] border-gray-300 bg-transparent px-2 text-[12px] font-medium text-gray-800 transition-colors hover:bg-gray-200/50"
          >
            {showPw ? '숨기기' : '비밀번호 표시'}
          </button>
        )}
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

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const validateContact = () => {
    if (formData.contact.length === 0) return null
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(formData.contact)
      ? null
      : '올바른 이메일 주소를 입력하세요.'
  }

  const validatePassword = () => {
    if (formData.password.length === 0) return null
    return formData.password.length < 6
      ? '여섯 자리 이상의 비밀번호를 입력하세요.'
      : null
  }

  const validateName = () => {
    return formData.name.length >= 64
      ? '이름을 64자 미만으로 입력하세요.'
      : null
  }

  const validateUsername = () => {
    return formData.username.length === 0 &&
      (formData.contact || formData.password)
      ? '사용자 이름을 입력하세요.'
      : null
  }

  const errors = {
    contact: validateContact(),
    password: validatePassword(),
    name: validateName(),
    username: validateUsername(),
  }

  const isButtonActive =
    formData.contact &&
    formData.password &&
    formData.username &&
    formData.name &&
    !Object.values(errors).some((e) => e !== null)

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
            onSubmit={(e) => e.preventDefault()}
          >
            <FloatingInput
              label="이메일 주소"
              value={formData.contact}
              error={errors.contact}
              touched={touched.contact}
              onChange={(v) => setFormData({ ...formData, contact: v })}
              onBlur={() => handleBlur('contact')}
            />
            <FloatingInput
              label="성명"
              value={formData.name}
              error={errors.name}
              touched={touched.name}
              onChange={(v) => setFormData({ ...formData, name: v })}
              onBlur={() => handleBlur('name')}
            />
            <FloatingInput
              label="사용자 이름"
              value={formData.username}
              error={errors.username}
              touched={touched.username}
              onChange={(v) => setFormData({ ...formData, username: v })}
              onBlur={() => handleBlur('username')}
            />
            <FloatingInput
              label="비밀번호"
              type={showPw ? 'text' : 'password'}
              value={formData.password}
              showPw={showPw}
              setShowPw={setShowPw}
              error={errors.password}
              touched={touched.password}
              onChange={(v) => setFormData({ ...formData, password: v })}
              onBlur={() => handleBlur('password')}
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
              className={`h-[32px] rounded text-sm font-semibold text-white transition-colors ${
                isButtonActive ? 'bg-[#4a5df9]' : 'bg-[#b2dffc]'
              }`}
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
