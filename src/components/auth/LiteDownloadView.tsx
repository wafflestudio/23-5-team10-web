import instagramIcon from '../../assets/instagram-icon.png'
import googlePlayBadge from '../../assets/google-play-badge.png'

interface LiteDownloadViewProps {
  onBack: () => void
}

const LiteDownloadView = ({ onBack }: LiteDownloadViewProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center px-4 pt-40 text-center tracking-tighter">
      <img
        src={instagramIcon}
        alt="Instagram"
        className="mb-4 h-16 w-16 cursor-pointer object-contain"
        onClick={onBack}
      />

      <h1 className="mb-[6px] text-[22px] font-bold text-black">
        Instagram Lite 다운로드
      </h1>

      <p className="mb-[20px] text-[16px] text-black">
        더 가볍고 빠르며 데이터도 절약할 수 있습니다
      </p>

      <div className="flex w-full flex-col items-center">
        <button className="mb-[7px] flex w-full max-w-[130px] items-center justify-center gap-2 rounded-[8px] bg-[#4a5df9] py-3 text-[13px] font-semibold tracking-tighter text-white transition-opacity hover:opacity-90">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          APK 다운로드
        </button>
      </div>

      <div className="cursor-pointer">
        <img
          src={googlePlayBadge}
          alt="Google Play"
          className="h-12 object-contain"
        />
      </div>
    </div>
  )
}

export default LiteDownloadView
