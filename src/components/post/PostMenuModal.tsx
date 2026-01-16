interface PostMenuModalProps {
  onClose: () => void
}

export default function PostMenuModal({ onClose }: PostMenuModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div
        className="w-full max-w-[550px] overflow-hidden rounded-[32px] bg-white text-center text-[14px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="w-full border-b border-gray-200 py-3 font-bold text-red-500 transition-colors active:bg-gray-100">
          신고
        </button>
        <button className="w-full border-b border-gray-200 py-3 font-bold text-red-500 transition-colors active:bg-gray-100">
          팔로우 취소
        </button>
        <button className="w-full border-b border-gray-200 py-3 transition-colors active:bg-gray-100">
          게시물로 이동
        </button>
        <button className="w-full border-b border-gray-200 py-3 transition-colors active:bg-gray-100">
          공유 대상...
        </button>
        <button className="w-full border-b border-gray-200 py-3 transition-colors active:bg-gray-100">
          링크 복사
        </button>
        <button className="w-full border-b border-gray-200 py-3 transition-colors active:bg-gray-100">
          퍼가기
        </button>
        <button className="w-full border-b border-gray-200 py-3 transition-colors active:bg-gray-100">
          이 계정 정보
        </button>
        <button
          onClick={onClose}
          className="w-full py-3 transition-colors active:bg-gray-100"
        >
          취소
        </button>
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  )
}
