import { useState, useEffect, useRef } from 'react'

interface LoginFooterProps {
  onLocationClick?: () => void
  onLiteClick?: () => void
}

const LoginFooter = ({ onLocationClick, onLiteClick }: LoginFooterProps) => {
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('한국어')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const footerLinks = [
    { name: 'Meta', url: 'https://about.meta.com/' },
    { name: '소개', url: 'https://about.instagram.com/' },
    { name: '블로그', url: 'https://about.instagram.com/blog/' },
    { name: '채용 정보', url: 'https://about.instagram.com/about-us/careers' },
    { name: '도움말', url: 'https://help.instagram.com/' },
    { name: 'API', url: 'https://developers.facebook.com/docs/instagram' },
    { name: '개인정보처리방침', url: 'https://privacycenter.instagram.com/' },
    { name: '약관', url: 'https://help.instagram.com/581066165581870' },
    { name: '위치', url: '#' },
    { name: 'Instagram Lite', url: '#' },
    { name: 'Meta AI', url: 'https://www.meta.ai/' },
    { name: 'Threads', url: 'https://www.threads.net/' },
    {
      name: '연락처 업로드 & 비사용자',
      url: 'https://www.facebook.com/help/instagram/261704639352628',
    },
    {
      name: 'Meta Verified',
      url: 'https://about.meta.com/technologies/meta-verified/',
    },
  ]

  const languages = ['한국어']

  useEffect(() => {
    const handleClose = (e: MouseEvent | WheelEvent | TouchEvent) => {
      if (!isLangOpen) return

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsLangOpen(false)
      } else if (e.type === 'wheel' || e.type === 'touchmove') {
        setIsLangOpen(false)
      }
    }

    if (isLangOpen) {
      window.addEventListener('mousedown', handleClose)
      window.addEventListener('wheel', handleClose, { passive: true })
      window.addEventListener('touchmove', handleClose, { passive: true })
    }

    return () => {
      window.removeEventListener('mousedown', handleClose)
      window.removeEventListener('wheel', handleClose)
      window.removeEventListener('touchmove', handleClose)
    }
  }, [isLangOpen])

  return (
    <footer className="flex flex-col items-center gap-4 px-4 py-10 text-xs tracking-tighter text-[#737373]">
      <div className="flex max-w-[1000px] flex-wrap justify-center gap-x-4 gap-y-2 text-center">
        {footerLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target={
              link.name === '위치' || link.name === 'Instagram Lite'
                ? undefined
                : '_blank'
            }
            rel={
              link.name === '위치' || link.name === 'Instagram Lite'
                ? undefined
                : 'noopener noreferrer'
            }
            onClick={(e) => {
              if (link.name === '위치') {
                e.preventDefault()
                onLocationClick?.()
              } else if (link.name === 'Instagram Lite') {
                e.preventDefault()
                onLiteClick?.()
              }
            }}
            className="cursor-pointer transition-opacity hover:underline active:opacity-50"
          >
            {link.name}
          </a>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-4">
        <div
          className="relative flex items-center justify-start"
          ref={dropdownRef}
        >
          <div
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex cursor-pointer items-center gap-1 transition-colors hover:text-black"
          >
            <span>{currentLang}</span>
            <span
              className={`text-[10px] transition-transform select-none ${isLangOpen ? 'rotate-180' : ''}`}
            >
              ⌵
            </span>
          </div>

          {isLangOpen && (
            <div className="absolute bottom-full left-0 z-50 mb-2 w-[132px] overflow-hidden rounded-[3px] border border-gray-300 bg-white shadow-md">
              {languages.map((lang) => (
                <div
                  key={lang}
                  className={`cursor-pointer px-3 py-1.5 text-left text-[12px] transition-colors ${
                    currentLang === lang
                      ? 'bg-[#737373] text-white'
                      : 'text-black hover:bg-[#737373] hover:text-white'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentLang(lang)
                    setIsLangOpen(false)
                  }}
                >
                  {lang}
                </div>
              ))}
            </div>
          )}
        </div>
        <span className="select-none">© 2026 Instagram from Meta</span>
      </div>
    </footer>
  )
}

export default LoginFooter
