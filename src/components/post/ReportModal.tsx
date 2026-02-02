import { useState } from 'react'
import { X, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import ReportCompleteModal from './ReportCompleteModal'

interface ReportModalProps {
  onClose: () => void
  onHideComment: () => void
  nickname: string
}

const REPORT_REASONS = [
  '마음에 들지 않습니다',
  '따돌림 또는 원치 않는 연락',
  '자살, 자해 및 섭식 장애',
  '나체 이미지 또는 성적 행위',
  '혐오 발언 또는 상징',
  '폭력 또는 학대',
  '규제 품목의 판매 또는 홍보',
  '스캠, 사기 또는 스팸',
  '거짓 정보',
]

export default function ReportModal({
  onClose,
  onHideComment,
  nickname,
}: ReportModalProps) {
  const [isComplete, setIsComplete] = useState(false)

  if (isComplete) {
    return (
      <ReportCompleteModal
        onClose={onClose}
        onHideComment={onHideComment}
        nickname={nickname}
      />
    )
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.1, opacity: 0 }}
        className="w-full max-w-[570px] overflow-hidden rounded-[24px] bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center justify-center border-b border-gray-200 py-4">
          <button
            onClick={onClose}
            className="absolute left-4 p-1 transition-opacity hover:opacity-60"
          >
            <X className="h-6 w-6 text-black" />
          </button>
          <span className="text-base font-bold text-black">신고</span>
        </div>

        <div className="scrollbar-hide max-h-[600px] overflow-x-hidden overflow-y-auto">
          <div className="px-5 py-[18px]">
            <h3 className="text-[16px] font-bold text-black">
              이 댓글을 신고하는 이유
            </h3>
          </div>

          <div className="mx-5 border-b border-gray-100" />

          <div className="flex flex-col pb-[14px]">
            {REPORT_REASONS.map((reason, index) => (
              <div key={reason}>
                <button
                  onClick={() => setIsComplete(true)}
                  className="flex w-full items-center justify-between px-5 py-[14px] transition-colors hover:bg-gray-50 active:bg-gray-100"
                >
                  <span className="text-[14px] text-black">{reason}</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
                {index !== REPORT_REASONS.length - 1 && (
                  <div className="mx-5 border-b border-gray-100" />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
