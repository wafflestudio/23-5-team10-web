import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'

type ProfileEditCardProps = {
  avatarUrl?: string | null
  nickname: string
  name?: string | null
  onChangePhotoClick: () => void
}

export function ProfileEditCard({
  avatarUrl,
  nickname,
  name,
  onChangePhotoClick,
}: ProfileEditCardProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-gray-100 p-4">
      <div className="flex items-center gap-4">
        <Avatar
          className="size-14 cursor-pointer text-gray-500"
          onClick={onChangePhotoClick}
        >
          <AvatarImage src={avatarUrl ?? undefined} alt={nickname} />
          <AvatarFallback>{nickname.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">{nickname}</span>
          {name && <span className="text-sm text-gray-500">{name}</span>}
        </div>
      </div>
      <Button
        type="button"
        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
        onClick={onChangePhotoClick}
      >
        사진 변경
      </Button>
    </div>
  )
}
