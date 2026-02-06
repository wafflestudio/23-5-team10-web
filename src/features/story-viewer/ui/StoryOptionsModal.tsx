interface StoryOptionsModalProps {
  isOpen: boolean
  onClose: () => void
  isMine: boolean
  onDelete?: () => void
  onReport?: () => void
  onAccountInfo?: () => void
}

export function StoryOptionsModal({
  isOpen,
  onClose,
  isMine,
  onDelete,
  onReport,
  onAccountInfo,
}: StoryOptionsModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[400px] overflow-hidden rounded-xl bg-white text-center text-[14px]"
        onClick={(e) => e.stopPropagation()}
      >
        {isMine ? (
          <>
            <button
              onClick={onDelete}
              className="w-full border-b border-gray-200 py-3.5 font-bold text-[#ed4956] active:bg-gray-50"
            >
              삭제
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onReport}
              className="w-full border-b border-gray-200 py-3.5 font-bold text-[#ed4956] active:bg-gray-50"
            >
              신고
            </button>
          </>
        )}
        <button
          onClick={onAccountInfo}
          className="w-full border-b border-gray-200 py-3.5 active:bg-gray-50"
        >
          이 계정 정보
        </button>
        <button onClick={onClose} className="w-full py-3.5 active:bg-gray-50">
          취소
        </button>
      </div>
    </div>
  )
}
