interface CommentMenuModalProps {
  onClose: () => void
  onDelete?: () => void
  isMine: boolean
}

export default function CommentMenuModal({
  onClose,
  onDelete,
  isMine,
}: CommentMenuModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] overflow-hidden rounded-[24px] bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col text-center">
          {isMine ? (
            <button
              onClick={onDelete}
              className="w-full border-b border-gray-200 py-3 text-[14px] font-bold text-[#ED4956] active:bg-gray-100"
            >
              삭제
            </button>
          ) : (
            <button className="w-full border-b border-gray-200 py-3 text-[14px] font-bold text-[#ED4956] active:bg-gray-100">
              신고
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full py-3 text-[14px] font-normal text-black active:bg-gray-100"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  )
}
