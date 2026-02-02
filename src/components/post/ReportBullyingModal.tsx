import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { ReportType } from './ReportCompleteModal'

interface ReportBullyingModalProps {
  onClose: () => void
  onBack: () => void
  onNext: (step: 'age_check' | 'target_select') => void
  onSubmit: (type: ReportType) => void
}

const BULLYING_REASONS = [
  '나체 이미지를 공유하거나 공유하겠다는 위협',
  '따돌림 또는 괴롭힘',
  '스팸',
]

export default function ReportBullyingModal({
  onClose,
  onBack,
  onNext,
  onSubmit,
}: ReportBullyingModalProps) {
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
              어떤 유형의 따돌림 또는 원치 않는 연락인가요?
            </h3>
          </div>

          <div className="mx-5 border-b border-gray-100" />

          <div className="flex flex-col pb-[14px]">
            {BULLYING_REASONS.map((reason) => (
              <div key={reason}>
                <button
                  onClick={() => {
                    if (
                      reason === '나체 이미지를 공유하거나 공유하겠다는 위협'
                    ) {
                      onNext('age_check')
                    } else if (reason === '따돌림 또는 괴롭힘') {
                      onNext('target_select')
                    } else if (reason === '스팸') {
                      onSubmit('spam')
                    } else {
                      onSubmit('default')
                    }
                  }}
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
                onClick={() => onSubmit('default')}
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
