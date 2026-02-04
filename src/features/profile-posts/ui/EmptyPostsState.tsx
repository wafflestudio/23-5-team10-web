import { Camera } from 'lucide-react'

import { useCreatePostModalStore } from '@/features/create-post/model/store'

type EmptyPostsStateProps = {
  isMe: boolean
}

export function EmptyPostsState({ isMe }: EmptyPostsStateProps) {
  const openCreatePost = useCreatePostModalStore((state) => state.open)

  if (!isMe) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex size-20 items-center justify-center rounded-full border-2 border-black">
          <Camera className="size-10" strokeWidth={1} />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold">게시물 없음</h2>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="flex size-20 items-center justify-center rounded-full border-2 border-black">
        <Camera className="size-10" strokeWidth={1} />
      </div>
      <h2 className="mt-6 text-3xl font-extrabold">사진 공유</h2>
      <p className="mt-3 text-sm text-gray-500">
        사진을 공유하면 회원님의 프로필에 표시됩니다.
      </p>
      <button
        type="button"
        onClick={openCreatePost}
        className="mt-6 text-sm font-semibold text-[#0095f6] hover:text-[#00376b]"
      >
        첫 사진 공유하기
      </button>
    </div>
  )
}
