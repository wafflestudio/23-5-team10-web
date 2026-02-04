import { Bookmark } from 'lucide-react'

export function EmptyBookmarksState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="flex size-20 items-center justify-center rounded-full border-2 border-black">
        <Bookmark className="size-10" strokeWidth={1} />
      </div>
      <h2 className="mt-6 text-3xl font-extrabold">저장 기능을 소개합니다</h2>
      <p className="mt-3 text-center text-sm text-gray-500">
        다시 보고 싶은 사진과 동영상을 저장하세요. 저장한 내용은
        <br />
        회원님만 볼 수 있습니다.
      </p>
    </div>
  )
}
