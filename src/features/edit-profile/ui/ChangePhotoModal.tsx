import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'

type ChangePhotoModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: () => void
  onDelete: () => void
}

export function ChangePhotoModal({
  open,
  onOpenChange,
  onUpload,
  onDelete,
}: ChangePhotoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md gap-0 rounded-2xl bg-white p-0"
        showCloseButton={false}
      >
        <DialogHeader className="border-b border-gray-200 p-6">
          <DialogTitle className="text-center text-xl font-semibold">
            프로필 사진 바꾸기
          </DialogTitle>
        </DialogHeader>

        <button
          type="button"
          className="w-full cursor-pointer border-b border-gray-200 py-4 text-center text-base font-semibold text-blue-500"
          onClick={() => {
            onUpload()
            onOpenChange(false)
          }}
        >
          사진 업로드
        </button>

        <button
          type="button"
          className="w-full cursor-pointer border-b border-gray-200 py-4 text-center text-base font-semibold text-red-500"
          onClick={() => {
            onDelete()
            onOpenChange(false)
          }}
        >
          현재 사진 삭제
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
