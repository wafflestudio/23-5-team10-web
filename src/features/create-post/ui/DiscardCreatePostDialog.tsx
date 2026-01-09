import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/ui/dialog'

type DiscardCreatePostDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDiscard: () => void
}

export function DiscardCreatePostDialog({
  open,
  onOpenChange,
  onDiscard,
}: DiscardCreatePostDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-[60]"
        className="z-60 w-[min(92vw,520px)] gap-0 overflow-hidden rounded-3xl bg-white p-0"
      >
        <div className="px-8 pt-10 pb-8 text-center">
          <DialogTitle className="text-2xl leading-tight font-semibold">
            게시물을 삭제하시겠어요?
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-zinc-500">
            지금 나가면 수정 내용이 저장되지 않습니다.
          </DialogDescription>
        </div>

        <div className="h-px w-full bg-zinc-200" />

        <button
          type="button"
          className="w-full px-6 py-5 text-center text-base font-semibold text-red-500 hover:bg-zinc-50"
          onClick={onDiscard}
        >
          삭제
        </button>

        <div className="h-px w-full bg-zinc-200" />

        <button
          type="button"
          className="w-full px-6 py-5 text-center text-base font-medium hover:bg-zinc-50"
          onClick={() => onOpenChange(false)}
        >
          취소
        </button>
      </DialogContent>
    </Dialog>
  )
}
