import { Button } from '@/shared/ui/button'
import { DialogClose, DialogTitle } from '@/shared/ui/dialog'
import { ChevronLeft, XIcon } from 'lucide-react'

type CreateModalHeaderProps = {
  isUploaded: boolean
  step?: 'select' | 'details'
  onBack?: () => void
  onNext?: () => void
  onShare?: () => void
}

export function CreateModalHeader({
  isUploaded,
  step = 'select',
  onBack,
  onNext,
  onShare,
}: CreateModalHeaderProps) {
  const isDetails = isUploaded && step === 'details'

  return (
    <header className="relative flex h-auto items-center justify-center px-12 py-6">
      {isUploaded ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="이전"
          className="absolute top-1/2 left-4 -translate-y-1/2"
          onClick={onBack}
        >
          <ChevronLeft className="size-5" />
        </Button>
      ) : null}

      <DialogTitle className="text-base font-semibold">
        새 게시물 만들기
      </DialogTitle>

      {isUploaded ? (
        <Button
          type="button"
          variant="ghost"
          className="absolute top-1/2 right-4 -translate-y-1/2"
          onClick={isDetails ? onShare : onNext}
        >
          {isDetails ? '공유하기' : '다음으로'}
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
