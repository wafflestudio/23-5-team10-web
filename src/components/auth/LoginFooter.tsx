interface LoginFooterProps {
  onLocationClick?: () => void
}

const LoginFooter = ({ onLocationClick }: LoginFooterProps) => {
  const footerLinks = [
    { name: 'Meta', url: 'https://about.meta.com/' },
    { name: '소개', url: 'https://about.instagram.com/' },
    { name: '블로그', url: 'https://about.instagram.com/blog/' },
    { name: '채용 정보', url: 'https://about.instagram.com/about-us/careers' },
    { name: '도움말', url: 'https://help.instagram.com/' },
    { name: 'API', url: 'https://developers.facebook.com/docs/instagram' },
    { name: '개인정보처리방침', url: 'https://privacycenter.instagram.com/' },
    { name: '약관', url: 'https://help.instagram.com/581066165581870' },
    {
      name: '위치',
      url: '#',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault()
        onLocationClick?.()
      },
    },
    {
      name: 'Instagram Lite',
      url: 'https://help.instagram.com/1559405347493117',
    },
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

  return (
    <footer className="flex flex-col items-center gap-4 px-4 py-10 text-xs text-[#737373]">
      <div className="flex max-w-[1000px] flex-wrap justify-center gap-x-4 gap-y-2 text-center">
        {footerLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target={link.onClick ? undefined : '_blank'}
            rel="noopener noreferrer"
            onClick={link.onClick}
            className="transition-opacity hover:underline active:opacity-50"
          >
            {link.name}
          </a>
        ))}
      </div>

      <div className="mt-2 flex gap-4">
        <div className="flex cursor-pointer items-center gap-1 transition-colors hover:text-black">
          <span>한국어</span>
          <span className="text-[10px] select-none">⌵</span>
        </div>
        <span className="select-none">© 2026 Instagram from Meta</span>
      </div>
    </footer>
  )
}

export default LoginFooter
