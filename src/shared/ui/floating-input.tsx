import { useState, useRef, useEffect } from 'react'

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

export const FloatingInput = ({
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
              className="flex items-center justify-center text-[#0095f6]"
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
