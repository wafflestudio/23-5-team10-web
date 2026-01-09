import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import instagramLogo from '../../assets/instagram-logo.svg'

interface FloatingInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  showPw?: boolean
  setShowPw?: (show: boolean) => void
}

const FloatingInput = ({
  label,
  value,
  onChange,
  type = 'text',
  showPw,
  setShowPw,
}: FloatingInputProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const isFloating = isFocused || value.length > 0

  return (
    <div className="relative mb-1.5 h-[38px] w-full">
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
        className={`h-full w-full rounded-sm border border-gray-300 bg-gray-50 px-2 text-[12px] focus:border-gray-400 focus:outline-none ${
          isFloating ? 'pt-3' : ''
        } `}
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
  )
}

const LoginCard = () => {
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const navigate = useNavigate()

  const isValid = id.length > 0 && pw.length >= 6

  return (
    <div className="flex w-full flex-col items-center bg-white p-10">
      <img
        src={instagramLogo}
        alt="Instagram"
        className="mt-2 mb-8 w-[175px]"
      />

      <form
        className="flex w-full flex-col"
        onSubmit={(e) => {
          e.preventDefault()
          navigate({ to: '/' })
        }}
      >
        <FloatingInput
          label="전화번호, 사용자 이름 또는 이메일"
          value={id}
          onChange={setId}
        />
        <FloatingInput
          label="비밀번호"
          value={pw}
          onChange={setPw}
          type={showPw ? 'text' : 'password'}
          showPw={showPw}
          setShowPw={setShowPw}
        />

        <button
          disabled={!isValid}
          className={`mt-3 rounded py-1.5 text-sm font-semibold text-white transition-colors ${
            isValid ? 'bg-[#0095f6]' : 'bg-[#b2dffc]'
          }`}
        >
          로그인
        </button>
      </form>

      <div className="my-6 flex w-full items-center text-gray-400">
        <div className="h-px flex-1 bg-gray-300"></div>
        <span className="px-4 text-[13px] font-semibold text-gray-500">
          또는
        </span>
        <div className="h-px flex-1 bg-gray-300"></div>
      </div>

      <button
        onClick={() => navigate({ to: '/password/reset' })}
        className="mt-2 cursor-pointer text-xs text-[#00376b] hover:underline"
      >
        비밀번호를 잊으셨나요?
      </button>
    </div>
  )
}

export default LoginCard
