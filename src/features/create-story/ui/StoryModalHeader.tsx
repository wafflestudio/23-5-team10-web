import { Button } from '@/shared/ui/button'
import { DialogClose, DialogTitle } from '@/shared/ui/dialog'
import { ChevronLeft, Loader2, XIcon } from 'lucide-react'

type StoryModalHeaderProps = {
  isUploaded: boolean
  onBack?: () => void
  onShare?: () => void
  isShareDisabled?: boolean
  isUploading?: boolean
  isSharing?: boolean
  isShareSuccess?: boolean
}

export function StoryModalHeader({
  isUploaded,
  onBack,
  onShare,
  isShareDisabled,
  isUploading,
  isSharing,
  isShareSuccess,
}: StoryModalHeaderProps) {
  const getTitle = () => {
    if (isSharing) return '공유 중...'
    if (isShareSuccess) return '스토리가 공유됨'
    return '새 스토리 만들기'
  }

  const showBackButton = isUploaded && !isSharing && !isShareSuccess
  const showCloseButton = !isUploaded || isSharing || isShareSuccess
  const showActionButton = isUploaded && !isSharing && !isShareSuccess
  const showTitle = !isUploaded || isSharing || isShareSuccess

  return (
    <header className="relative flex items-center justify-center px-12 py-6">
      {showBackButton ? (
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

      {showTitle ? (
        <DialogTitle className="text-base font-semibold">
          {getTitle()}
        </DialogTitle>
      ) : (
        <DialogTitle className="sr-only">{getTitle()}</DialogTitle>
      )}

      {showActionButton ? (
        <Button
          type="button"
          variant="ghost"
          className="absolute top-1/2 right-4 -translate-y-1/2"
          onClick={onShare}
          disabled={isShareDisabled}
        >
          {isUploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            '공유하기'
          )}
        </Button>
      ) : showCloseButton ? (
        <DialogClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="닫기"
            className="absolute top-1/2 right-4 -translate-y-1/2"
          >
            <XIcon className="size-5" />
          </Button>
        </DialogClose>
      ) : null}
    </header>
  )
}
