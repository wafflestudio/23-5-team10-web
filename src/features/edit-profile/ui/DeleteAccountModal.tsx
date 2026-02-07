import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'

type DeleteAccountModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteAccountModal({
  open,
  onOpenChange,
  onConfirm,
}: DeleteAccountModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md gap-0 rounded-2xl bg-white p-0"
        showCloseButton={false}
      >
        <DialogHeader className="border-b border-gray-200 p-6">
          <DialogTitle className="text-center text-xl font-semibold">
            회원 탈퇴
          </DialogTitle>
          <DialogDescription className="pt-2 text-center text-sm text-gray-500">
            탈퇴하면 게시물, 댓글, 좋아요 등 모든 데이터가 삭제되며 복구할 수
            없습니다. 정말 탈퇴하시겠어요?
          </DialogDescription>
        </DialogHeader>

        <button
          type="button"
          className="w-full cursor-pointer border-b border-gray-200 py-4 text-center text-base font-semibold text-red-500"
          onClick={() => {
            onConfirm()
            onOpenChange(false)
          }}
        >
          탈퇴하기
        </button>

        <button
          type="button"
          className="w-full cursor-pointer py-4 text-center text-base text-gray-900"
          onClick={() => onOpenChange(false)}
        >
          취소
        </button>
      </DialogContent>
    </Dialog>
  )
}
