import { Button } from '@/shared/ui/button'
import { DialogClose, DialogTitle } from '@/shared/ui/dialog'
import { XIcon } from 'lucide-react'

type CreateModalHeaderProps = {
  isUploaded: boolean
  onNext?: () => void
}

export function CreateModalHeader({
  isUploaded,
  onNext,
}: CreateModalHeaderProps) {
  return (
    <header className="relative flex h-auto items-center justify-center px-12 py-6">
      <DialogTitle className="text-base font-semibold">
        새 게시물 만들기
      </DialogTitle>

      {isUploaded ? (
        <Button
          type="button"
          variant="ghost"
          className="absolute top-1/2 right-4 -translate-y-1/2"
          onClick={onNext ?? (() => {})}
        >
          다음으로
        </Button>
      ) : (
        <DialogClose asChild>
          <Button
            type="button"
            variant="ghost"
            className="absolute top-1/2 right-4 -translate-y-1/2"
          >
            <XIcon className="size-5" />
          </Button>
        </DialogClose>
      )}
    </header>
  )
}
