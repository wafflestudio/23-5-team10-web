import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import instagramLogo from '../../assets/instagram-logo.svg'
import LoginFooter from '../../components/auth/LoginFooter'

export const Route = createFileRoute('/accounts/emailsignup')({
  component: EmailSignupPage,
})

interface FloatingInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  showPw?: boolean
  setShowPw?: (show: boolean) => void
  error?: string | null
}

const FloatingInput = ({
  label,
  value,
  onChange,
  type = 'text',
  showPw,
  setShowPw,
  error,
}: FloatingInputProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const isFloating = isFocused || value.length > 0

  return (
    <div className="relative mb-1.5 w-full">
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
          onBlur={() => setIsFocused(false)}
          className={`h-full w-full rounded-sm border ${
            error ? 'border-red-500' : 'border-gray-300'
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
      {error && (
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

  const validateContact = () => {
    if (formData.contact.length === 0) return null
    if (formData.contact.length > 254 || formData.contact.includes(' '))
      return '올바른 휴대폰 번호 또는 이메일 주소를 입력하세요.'
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.com$/
    const phoneRegex = /^010\d{8}$/
    if (emailRegex.test(formData.contact) || phoneRegex.test(formData.contact))
      return null
    return '올바른 휴대폰 번호 또는 이메일 주소를 입력하세요.'
  }

  const validatePassword = () => {
    if (formData.password.length === 0) return null
    if (formData.password.length < 6)
      return '숫자, 영문, 특수기호(!, & 등)를 조합한 여섯 자리 이상의 비밀번호를 입력하세요.'
    return null
  }

  const validateName = () => {
    if (formData.name.length >= 64) return '이름을 64자 미만으로 입력하세요.'
    return null
  }

  const validateUsername = () => {
    // 사용자 이름 중복 확인 API 필요 (추후 수정 필요) - 일단 지금은 그냥 확인 없이 pass
    if (
      formData.username.length === 0 &&
      (formData.contact || formData.password || formData.name)
    ) {
      return '계정의 사용자 이름을 선택하세요.'
    }
    return null
  }

  const errors = {
    contact: validateContact(),
    password: validatePassword(),
    name: validateName(),
    username: validateUsername(),
  }

  const isFormFilled =
    formData.contact && formData.password && formData.username
  const hasNoError =
    !errors.contact && !errors.password && !errors.name && !errors.username
  const isButtonActive = isFormFilled && hasNoError

  return (
    <div className="flex h-screen w-screen flex-col overflow-x-hidden overflow-y-auto bg-white">
      <main className="flex flex-1 flex-col items-center justify-center p-4 py-10">
        <div className="mb-2.5 flex w-full max-w-[350px] flex-col items-center border border-gray-300 bg-white p-10 pb-6 shadow-sm">
          <img src={instagramLogo} alt="Instagram" className="mb-3 w-[175px]" />
          <h2 className="mb-5 text-center text-[17px] leading-5 font-semibold text-gray-500">
            친구들의 사진과 동영상을 보려면 가입하세요.
          </h2>

          <form
            className="flex w-full flex-col gap-1"
            onSubmit={(e) => e.preventDefault()}
          >
            <FloatingInput
              label="휴대폰 번호 또는 이메일 주소"
              value={formData.contact}
              error={errors.contact}
              onChange={(v) => setFormData({ ...formData, contact: v })}
            />

            <FloatingInput
              label="비밀번호"
              type={showPw ? 'text' : 'password'}
              value={formData.password}
              showPw={showPw}
              setShowPw={setShowPw}
              error={errors.password}
              onChange={(v) => setFormData({ ...formData, password: v })}
            />

            <FloatingInput
              label="성명"
              value={formData.name}
              error={errors.name}
              onChange={(v) => setFormData({ ...formData, name: v })}
            />

            <FloatingInput
              label="사용자 이름"
              value={formData.username}
              error={errors.username}
              onChange={(v) => setFormData({ ...formData, username: v })}
            />

            <p className="my-4 text-center text-[12px] leading-4 text-gray-500">
              저희 서비스를 이용하는 사람이 회원님의 연락처 정보를 Instagram에
              업로드했을 수도 있습니다.{' '}
              <a
                href="https://www.facebook.com/help/instagram/261704639352628"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#0095f6]"
              >
                더 알아보기
              </a>
            </p>

            <button
              disabled={!isButtonActive}
              className={`rounded py-1.5 text-sm font-semibold text-white transition-colors ${
                isButtonActive ? 'bg-[#0095f6]' : 'bg-[#b2dffc]'
              }`}
            >
              가입
            </button>
          </form>
        </div>

        <div className="flex w-full max-w-[350px] justify-center border border-gray-300 bg-white p-6 shadow-sm">
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
        <LoginFooter />
      </footer>
    </div>
  )
}
