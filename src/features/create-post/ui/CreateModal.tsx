import { useRef } from 'react'

import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/shared/ui/dialog'
import { ImagePlus, XIcon } from 'lucide-react'

type CreateModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateModal({ open, onOpenChange }: CreateModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex aspect-square flex-col gap-0 rounded-4xl bg-white p-0 sm:max-w-xl"
      >
        <header className="relative flex h-auto items-center justify-center px-12 py-6">
          <DialogTitle className="text-base font-semibold">
            새 게시물 만들기
          </DialogTitle>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="absolute top-1/2 right-4 -translate-y-1/2"
            >
              <XIcon className="size-5" />
            </Button>
          </DialogClose>
        </header>
        <div className="h-px w-full bg-zinc-200" />

        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
          <ImagePlus className="size-10" />

          <p className="text-lg font-medium">
            사진과 동영상을 여기에 끌어다 놓으세요
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            컴퓨터에서 선택
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
