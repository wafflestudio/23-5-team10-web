import { MAX_CAPTION_LENGTH } from '@/features/create-post/constants'
import { AlbumSelectDropdown } from '@/features/create-post/ui/AlbumSelectDropdown'

type PostDetailsPaneProps = {
  profileName: string
  profileImageUrl?: string
  caption: string
  onCaptionChange: (caption: string) => void
  selectedAlbumId: number
  onAlbumSelect: (albumId: number) => void
}

export function PostDetailsPane({
  profileName,
  profileImageUrl,
  caption,
  onCaptionChange,
  selectedAlbumId,
  onAlbumSelect,
}: PostDetailsPaneProps) {
  const captionLength = caption.length
  const maxLength = MAX_CAPTION_LENGTH

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
        <div className="mb-4">
          <AlbumSelectDropdown
            selectedAlbumId={selectedAlbumId}
            onSelect={onAlbumSelect}
          />
        </div>

        <textarea
          value={caption}
          onChange={(e) => onCaptionChange(e.target.value.slice(0, maxLength))}
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
