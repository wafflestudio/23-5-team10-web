import { X } from 'lucide-react'
import cakeIcon from '@/assets/birthday-cake.png'

interface BirthdayModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BirthdayModal({ isOpen, onClose }: BirthdayModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[600px] overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-12 items-center justify-center border-b border-gray-200 px-4">
          <span className="text-base font-semibold text-[#262626]">생일</span>
          <button
            onClick={onClose}
            className="absolute right-3 text-gray-500 hover:text-black"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col items-center p-8 pb-4 text-center">
          <img
            src={cakeIcon}
            alt="Birthday Cake"
            className="mb-6 h-24 w-48 object-contain"
          />
          <h3 className="mb-3 text-xl font-semibold text-[#262626]">
            Instagram에 표시되는 생일
          </h3>
          <p className="text-[14px] leading-relaxed text-[#8e8e8e]">
            생일을 입력하면 기능과 회원님에게 표시되는 광고가 개선되며 Instagram
            커뮤니티를 안전하게 유지하는 데 도움이 됩니다. 입력한 생일은 개인
            정보 계정 설정에서 확인할 수 있습니다.
          </p>
        </div>

        <div className="w-full">
          <div className="w-full border-t border-gray-200" />
          <a
            href="https://help.instagram.com/155833707900388"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 text-center text-sm font-semibold text-[#4a5df9] transition-colors hover:bg-gray-50"
          >
            더 알아보기
          </a>
        </div>
      </div>
    </div>
  )
}
