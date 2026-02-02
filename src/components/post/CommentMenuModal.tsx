import { useState, useEffect } from 'react'
import { useCurrentUser } from '@/shared/auth/useCurrentUser'
import ReportModal from './ReportModal'

type CommentMenuModalProps = {
  onClose: () => void
  onDelete?: () => void
  onEdit?: () => void
  onHide: () => void
  authorId: number
  nickname: string
}

export default function CommentMenuModal({
  onClose,
  onDelete,
  onEdit,
  onHide,
  authorId,
  nickname,
}: CommentMenuModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const { data: currentUser } = useCurrentUser()
  const isMine = currentUser?.userId === authorId

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
        className={`w-full max-w-[400px] overflow-hidden rounded-[12px] bg-white transition-all duration-200 ease-out ${
          isVisible ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col text-center">
          {isMine ? (
            <>
              <button
                onClick={onDelete}
                className="w-full border-b border-gray-200 py-3.5 text-[14px] font-bold text-[#ED4956] active:bg-gray-100"
              >
                삭제
              </button>
              <button
                onClick={onEdit}
                className="w-full border-b border-gray-200 py-3.5 text-[14px] font-normal text-black active:bg-gray-100"
              >
                수정
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsReportOpen(true)}
              className="w-full border-b border-gray-200 py-3.5 text-[14px] font-bold text-[#ED4956] active:bg-gray-100"
            >
              신고
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full py-3.5 text-[14px] font-normal text-black active:bg-gray-100"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  )
}
