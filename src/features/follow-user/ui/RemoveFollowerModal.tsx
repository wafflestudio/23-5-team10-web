import { Dialog, DialogContent } from '@/shared/ui/dialog'
import { DefaultProfileImage } from '@/shared/ui/default-profile-image'

type RemoveFollowerModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  nickname: string
  profileImageUrl: string | null
  onConfirm: () => void
  isPending?: boolean
}

export function RemoveFollowerModal({
  open,
  onOpenChange,
  nickname,
  profileImageUrl,
  onConfirm,
  isPending = false,
}: RemoveFollowerModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-w-sm flex-col items-center gap-0 rounded-2xl border-none bg-white p-0"
      >
        <div className="flex flex-col items-center px-8 py-6">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={`${nickname} 프로필 이미지`}
              className="size-20 rounded-full object-cover"
            />
          ) : (
            <DefaultProfileImage className="size-20" />
          )}
          <h2 className="mt-4 text-center text-lg font-semibold">
            팔로워를 삭제하시겠어요?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            {nickname}님은 회원님의 팔로워 리스트에서 삭제된 사실을 알 수
            없습니다.
          </p>
        </div>

        <div className="w-full border-t border-gray-200">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="w-full py-3 text-sm font-semibold text-[#ed4956] hover:bg-gray-50 disabled:opacity-50"
          >
            삭제
          </button>
        </div>

        <div className="w-full border-t border-gray-200">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="w-full rounded-b-2xl py-3 text-sm text-gray-900 hover:bg-gray-50 disabled:opacity-50"
          >
            취소
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
