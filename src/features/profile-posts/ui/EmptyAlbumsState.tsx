import { Images } from 'lucide-react'

type EmptyAlbumsStateProps = {
  isMe: boolean
}

export function EmptyAlbumsState({ isMe }: EmptyAlbumsStateProps) {
  if (!isMe) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex size-20 items-center justify-center rounded-full border-2 border-black">
          <Images className="size-10" strokeWidth={1} />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold">앨범 없음</h2>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="flex size-20 items-center justify-center rounded-full border-2 border-black">
        <Images className="size-10" strokeWidth={1} />
      </div>
      <h2 className="mt-6 text-3xl font-extrabold">앨범</h2>
      <p className="mt-3 text-sm text-gray-500">
        게시물을 앨범으로 정리해보세요.
        <br />
        게시물 작성 시 앨범을 선택할 수 있습니다.
      </p>
    </div>
  )
}
