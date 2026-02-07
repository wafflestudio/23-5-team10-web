import { useCurrentUser } from '@/shared/auth/useCurrentUser'

interface StoryOptionsModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string | number
  onDelete?: () => void
  onReport?: () => void
  onAccountInfo?: () => void
}

export function StoryOptionsModal({
  isOpen,
  onClose,
  userId,
  onDelete,
  onReport,
  onAccountInfo,
}: StoryOptionsModalProps) {
  const { data: me } = useCurrentUser()

  if (!isOpen) return null

  const isMine =
    me?.userId !== undefined && String(me.userId) === String(userId)

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[400px] overflow-hidden rounded-xl bg-white text-center text-[14px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
          {isMine ? (
            <button
              onClick={onDelete}
              className="w-full border-b border-gray-200 py-3.5 font-bold text-[#ed4956] active:bg-gray-50"
            >
              삭제
            </button>
          ) : (
            <>
              <button
                onClick={onReport}
                className="w-full border-b border-gray-200 py-3.5 font-bold text-[#ed4956] active:bg-gray-50"
              >
                신고
              </button>
              <button
                onClick={onAccountInfo}
                className="w-full border-b border-gray-200 py-3.5 active:bg-gray-50"
              >
                이 계정 정보
              </button>
            </>
          )}
          <button onClick={onClose} className="w-full py-3.5 active:bg-gray-50">
            취소
          </button>
        </div>
      </div>
    </div>
  )
}
