import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface ReportCompleteModalProps {
  onClose: () => void
  onHideComment: () => void
  nickname: string
}

export default function ReportCompleteModal({
  onClose,
  onHideComment,
  nickname,
}: ReportCompleteModalProps) {
  const communityLink =
    'https://transparency.meta.com/policies/community-standards'

  const handleBlockClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    alert('ui만 구현하고 로직은 구현하지 않기로 합의된 기능입니다.')
  }

  const handleCloseAndHide = () => {
    onHideComment()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4"
      onClick={handleCloseAndHide}
    >
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.1, opacity: 0 }}
        className="w-full max-w-[570px] overflow-hidden rounded-[24px] bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center px-[30px] pt-10 pb-6 text-center">
          <div className="mb-4 flex items-center justify-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#34C759"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m7 12 3.5 3.5 6.5-7" />
            </svg>
          </div>

          <h3 className="mb-2 text-[16px] font-bold text-black">
            소중한 의견 감사합니다
          </h3>

          <p className="mb-8 text-[13px] leading-snug text-gray-500">
            Instagram에서 마음에 들지 않는 콘텐츠를 발견할 경우 해당 콘텐츠가{' '}
            <a
              href={communityLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4650FA] no-underline"
            >
              커뮤니티 규정
            </a>
            을 위반한다면 신고할 수 있으며 공유한 사람을 이용 환경에서 삭제할
            수도 있습니다.
          </p>
        </div>

        <div className="flex flex-col border-t border-gray-100">
          <button
            className="flex w-full items-center justify-between px-[22px] py-4 transition-colors hover:bg-gray-50 active:bg-gray-100"
            onClick={handleBlockClick}
          >
            <span className="text-[14px] font-semibold text-[#ED4956]">
              {nickname}님 차단
            </span>
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </button>

          <div className="mx-[22px] border-b border-gray-100" />

          <a
            href={communityLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between px-[22px] py-4 no-underline transition-colors hover:bg-gray-50 active:bg-gray-100"
          >
            <span className="text-[14px] text-black">
              커뮤니티 규정에 대해 더 알아보기
            </span>
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </a>

          <div className="mx-[22px] border-b border-gray-100" />
        </div>

        <div className="px-[22px] py-5">
          <button
            onClick={handleCloseAndHide}
            className="w-full rounded-[8px] bg-[#4650FA] py-2 text-[14px] font-bold text-white transition-opacity hover:opacity-90"
          >
            닫기
          </button>
        </div>
      </motion.div>
    </div>
  )
}
