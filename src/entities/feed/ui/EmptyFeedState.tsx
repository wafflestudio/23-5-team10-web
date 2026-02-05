import { Users } from 'lucide-react'

export function EmptyFeedState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="flex size-20 items-center justify-center rounded-full border-2 border-black">
        <Users className="size-10" strokeWidth={1} />
      </div>
      <h2 className="mt-6 text-3xl font-extrabold">피드가 비어 있습니다</h2>
      <p className="mt-3 text-center text-sm text-gray-500">
        다른 사람들을 팔로우하면 팔로우한 사람들의 게시물이
        <br />
        여기에 표시됩니다.
      </p>
    </div>
  )
}
