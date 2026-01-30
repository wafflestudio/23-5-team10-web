import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/ui/dialog'

type ClearSearchHistoryDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClear: () => void
}

export function ClearSearchHistoryDialog({
  open,
  onOpenChange,
  onClear,
}: ClearSearchHistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-[60]"
        className="z-60 w-[min(92vw,520px)] gap-0 overflow-hidden rounded-3xl bg-white p-0"
      >
        <div className="px-8 pt-10 pb-8 text-center">
          <DialogTitle className="text-2xl leading-tight font-semibold">
            검색 내역을 지우시겠어요?
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-zinc-500">
            이 작업을 취소할 수 없습니다. 검색 내역을 지워도 검색한 계정이 추천
            결과로 계속 표시될 수 있습니다.
          </DialogDescription>
        </div>

        <div className="h-px w-full bg-zinc-200" />

        <button
          type="button"
          className="w-full px-6 py-5 text-center text-base font-semibold text-red-500 hover:bg-zinc-50"
          onClick={onClear}
        >
          모두 지우기
        </button>

        <div className="h-px w-full bg-zinc-200" />

        <button
          type="button"
          className="w-full px-6 py-5 text-center text-base font-medium hover:bg-zinc-50"
          onClick={() => onOpenChange(false)}
        >
          나중에 하기
        </button>
      </DialogContent>
    </Dialog>
  )
}
