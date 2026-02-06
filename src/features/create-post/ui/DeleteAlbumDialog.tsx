import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/ui/dialog'

type DeleteAlbumDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: () => void
}

export function DeleteAlbumDialog({
  open,
  onOpenChange,
  onDelete,
}: DeleteAlbumDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-70"
        className="z-70 w-[min(92vw,520px)] gap-0 overflow-hidden rounded-3xl bg-white p-0"
      >
        <div className="px-8 pt-10 pb-8 text-center">
          <DialogTitle className="text-2xl leading-tight font-semibold">
            앨범을 삭제하시겠어요?
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-zinc-500">
            앨범에 포함된 게시글은 삭제되지 않으며, '앨범 없음' 상태로
            변경됩니다.
          </DialogDescription>
        </div>

        <div className="h-px w-full bg-zinc-200" />

        <button
          type="button"
          className="w-full px-6 py-5 text-center text-base font-semibold text-red-500 hover:bg-zinc-50"
          onClick={onDelete}
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
