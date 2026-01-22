import { useState } from 'react'

interface LoginFooterProps {
  onLocationClick?: () => void
  onLiteClick?: () => void
}

const LoginFooter = ({ onLocationClick, onLiteClick }: LoginFooterProps) => {
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('한국어')

  const footerLinks = [
    { name: 'Meta', url: 'https://about.meta.com/' },
    { name: '소개', url: 'https://about.instagram.com/' },
    { name: '블로그', url: 'https://about.instagram.com/blog/' },
    { name: '채용 정보', url: 'https://about.instagram.com/about-us/careers' },
    { name: '도움말', url: 'https://help.instagram.com/' },
    { name: 'API', url: 'https://developers.facebook.com/docs/instagram' },
    { name: '개인정보처리방침', url: 'https://privacycenter.instagram.com/' },
    { name: '약관', url: 'https://help.instagram.com/581066165581870' },
    { name: '위치', url: '#', action: onLocationClick },
    { name: 'Instagram Lite', url: '#', action: onLiteClick },
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

  return (
    <footer className="flex flex-col items-center gap-4 px-4 py-10 text-xs text-[#737373]">
      <div className="flex max-w-[1000px] flex-wrap justify-center gap-x-4 gap-y-2 text-center">
        {footerLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target={link.action ? undefined : '_blank'}
            rel={link.action ? undefined : 'noopener noreferrer'}
            onClick={(e) => {
              if (link.action) {
                e.preventDefault() // 주소창에 #이 붙는 것을 원천 차단
                link.action()
              }
            }}
            className="cursor-pointer transition-opacity hover:underline active:opacity-50"
          >
            {link.name}
          </a>
        ))}
      </div>

      <div className="mt-2 flex gap-4">
        <div className="relative">
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
            <div className="absolute bottom-full left-0 z-50 mb-2 w-[132px] rounded-[3px] border border-gray-300 bg-white py-0 shadow-md">
              {languages.map((lang) => (
                <div
                  key={lang}
                  className={`cursor-pointer px-3 py-1.5 text-[12px] transition-colors ${
                    currentLang === lang
                      ? 'bg-[#737373] text-white'
                      : 'text-black hover:bg-[#737373] hover:text-white'
                  }`}
                  onClick={() => {
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
