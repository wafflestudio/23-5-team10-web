import { MAX_CAPTION_LENGTH } from '@/features/create-post/constants'
import { useCaption } from '@/features/create-post/model/hooks/useCaption'

type PostDetailsPaneProps = {
  profileName: string
  profileImageUrl?: string
}

export function PostDetailsPane({
  profileName,
  profileImageUrl,
}: PostDetailsPaneProps) {
  const { caption, setCaption, captionLength, maxLength } = useCaption({
    maxLength: MAX_CAPTION_LENGTH,
  })

  return (
    <aside className="flex h-full w-full flex-col border-l border-zinc-200 bg-white">
      <div className="flex items-center gap-3 px-4 py-4">
        <div className="h-7 w-7 overflow-hidden rounded-full bg-zinc-200">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={`${profileName} 프로필 사진`}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <div className="text-sm font-semibold">{profileName}</div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="문구 입력..."
          maxLength={maxLength}
          className="min-h-0 flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-zinc-400"
        />

        <div className="mt-2 text-right text-xs text-zinc-400">
          {captionLength}/{maxLength}
        </div>
      </div>
    </aside>
  )
}
