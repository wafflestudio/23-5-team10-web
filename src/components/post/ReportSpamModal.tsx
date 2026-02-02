import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface ReportSpamModalProps {
  onClose: () => void
  onBack: () => void
  onSubmit: () => void
}

const SPAM_REASONS = ['거짓 또는 사기', '스팸']

export default function ReportSpamModal({
  onClose,
  onBack,
  onSubmit,
}: ReportSpamModalProps) {
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
            onClick={onBack}
            className="absolute left-4 p-1 transition-opacity hover:opacity-60"
          >
            <ChevronLeft className="h-6 w-6 text-black" />
          </button>
          <span className="text-base font-bold text-black">신고</span>
          <button
            onClick={onClose}
            className="absolute right-4 p-1 transition-opacity hover:opacity-60"
          >
            <X className="h-6 w-6 text-black" />
          </button>
        </div>

        <div className="scrollbar-hide max-h-[600px] overflow-x-hidden overflow-y-auto">
          <div className="px-5 py-[18px]">
            <h3 className="text-[16px] leading-tight font-bold text-black">
              다음 중 문제를 가장 잘 설명하는 항목은 무엇인가요?
            </h3>
          </div>

          <div className="mx-5 border-b border-gray-100" />

          <div className="flex flex-col pb-[14px]">
            {SPAM_REASONS.map((reason) => (
              <div key={reason}>
                <button
                  onClick={onSubmit}
                  className="flex w-full items-center justify-between px-5 py-[14px] transition-colors hover:bg-gray-50 active:bg-gray-100"
                >
                  <span className="text-left text-[14px] text-black">
                    {reason}
                  </span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
                <div className="mx-5 border-b border-gray-100" />
              </div>
            ))}

            <div className="mt-4 mb-2 px-5">
              <button
                onClick={onSubmit}
                className="w-full rounded-[12px] bg-[#808cf8] py-[7px] text-[14px] font-bold text-white transition-opacity hover:opacity-90"
              >
                신고 제출
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
