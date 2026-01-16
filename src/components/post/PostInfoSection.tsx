export default function PostInfoSection() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-gray-200 p-4">
        <div className="h-8 w-8 rounded-full bg-gray-200" />
        <div className="text-sm font-semibold text-black">username</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4 flex gap-3">
          <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200" />
          <div className="text-sm text-black">
            <span className="mr-2 font-semibold">username</span>
            게시물 본문 내용이 들어가는 자리입니다.
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="mb-2 flex gap-4 text-black">
          <div className="h-6 w-6 rounded-sm border-2 border-black" />
          <div className="h-6 w-6 rounded-sm border-2 border-black" />
        </div>
        <div className="text-sm font-semibold text-black">좋아요 0개</div>
      </div>
    </div>
  )
}
