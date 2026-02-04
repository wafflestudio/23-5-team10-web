import { toast } from 'sonner'

import { Button } from '@/shared/ui/button'
import { DialogClose, DialogTitle } from '@/shared/ui/dialog'
import { ChevronLeft, Loader2, XIcon } from 'lucide-react'

type CreateModalHeaderProps = {
  isUploaded: boolean
  step?: 'select' | 'details'
  title?: string
  onBack?: () => void
  onNext?: () => void
  onShare?: () => void
  isShareDisabled?: boolean
  isUploading?: boolean
  isUploadError?: boolean
  isSharing?: boolean
  isShareSuccess?: boolean
}

export function CreateModalHeader({
  isUploaded,
  step = 'select',
  title,
  onBack,
  onNext,
  onShare,
  isShareDisabled,
  isUploading,
  isUploadError,
  isSharing,
  isShareSuccess,
}: CreateModalHeaderProps) {
  const isDetails = isUploaded && step === 'details'

  const getDisplayTitle = () => {
    if (isSharing) return '공유 중...'
    if (isShareSuccess) return '게시물이 공유됨'
    return title || '새 게시물 만들기'
  }

  const showBackButton = isUploaded && !isSharing && !isShareSuccess
  const showCloseButton = !isUploaded || isSharing || isShareSuccess
  const showActionButton = isUploaded && !isSharing && !isShareSuccess

  return (
    <header className="relative flex h-auto items-center justify-center px-12 py-6">
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

      <DialogTitle className="text-base font-semibold">
        {getDisplayTitle()}
      </DialogTitle>

      {showActionButton ? (
        <Button
          type="button"
          variant="ghost"
          className="absolute top-1/2 right-4 -translate-y-1/2"
          onClick={
            isDetails
              ? onShare
              : () => {
                  if (isUploadError) {
                    toast.error(
                      '이미지 업로드에 실패했습니다. 다시 시도해주세요.'
                    )
                    return
                  }
                  if (isUploading) return
                  onNext?.()
                }
          }
          disabled={isDetails ? isShareDisabled : isUploading}
        >
          {isUploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : isDetails ? (
            '공유하기'
          ) : (
            '다음으로'
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
