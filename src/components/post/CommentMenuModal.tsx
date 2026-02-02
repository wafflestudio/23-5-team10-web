import { useState, useEffect } from 'react'
import { useAuthStore } from '@/shared/auth/authStore'
import ReportModal from './ReportModal'

interface CommentMenuModalProps {
  onClose: () => void
  onDelete?: () => void
  onHide: () => void
  authorId: number
  nickname: string
}

export default function CommentMenuModal({
  onClose,
  onDelete,
  onHide,
  authorId,
  nickname,
}: CommentMenuModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const { user } = useAuthStore()
  const isMine = user?.id === authorId

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  if (isReportOpen) {
    return (
      <ReportModal
        onClose={onClose}
        onHideComment={onHide}
        nickname={nickname}
      />
    )
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/50 transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-[560px] overflow-hidden rounded-[24px] bg-white transition-all duration-200 ease-out ${
          isVisible ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col text-center">
          {isMine ? (
            <button
              onClick={onDelete}
              className="w-full border-b border-gray-200 py-4 text-[14px] font-bold text-[#ED4956] active:bg-gray-100"
            >
              삭제
            </button>
          ) : (
            <button
              onClick={() => setIsReportOpen(true)}
              className="w-full border-b border-gray-200 py-4 text-[14px] font-bold text-[#ED4956] active:bg-gray-100"
            >
              신고
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full py-4 text-[14px] font-normal text-black active:bg-gray-100"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  )
}
