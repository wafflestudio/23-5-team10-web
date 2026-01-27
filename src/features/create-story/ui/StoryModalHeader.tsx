import { Button } from '@/shared/ui/button'
import { DialogClose, DialogTitle } from '@/shared/ui/dialog'
import { ChevronLeft, XIcon } from 'lucide-react'

type StoryModalHeaderProps = {
  isUploaded: boolean
  onBack?: () => void
  onShare?: () => void
}

export function StoryModalHeader({
  isUploaded,
  onBack,
  onShare,
}: StoryModalHeaderProps) {
  return (
    <header className="relative flex items-center justify-center px-12 py-6">
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

      {isUploaded ? (
        <DialogTitle className="sr-only">새 스토리 만들기</DialogTitle>
      ) : (
        <DialogTitle className="text-base font-semibold">
          새 스토리 만들기
        </DialogTitle>
      )}

      {isUploaded ? (
        <Button
          type="button"
          variant="ghost"
          className="absolute top-1/2 right-4 -translate-y-1/2"
          onClick={onShare}
        >
          공유하기
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
