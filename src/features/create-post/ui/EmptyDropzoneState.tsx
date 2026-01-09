import type { ComponentPropsWithRef, HTMLAttributes } from 'react'

import { Button } from '@/shared/ui/button'
import { ImagePlus } from 'lucide-react'

type EmptyDropzoneStateProps = {
  getRootProps: (
    props?: HTMLAttributes<HTMLElement>
  ) => HTMLAttributes<HTMLElement>
  getInputProps: (
    props?: ComponentPropsWithRef<'input'>
  ) => ComponentPropsWithRef<'input'>
  openFileDialog: () => void
  isDragging: boolean
}

export function EmptyDropzoneState({
  getRootProps,
  getInputProps,
  openFileDialog,
  isDragging,
}: EmptyDropzoneStateProps) {
  return (
    <div
      {...getRootProps({
        className: [
          'flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center',
          isDragging ? 'bg-zinc-50' : '',
        ].join(' '),
      })}
    >
      <ImagePlus className="size-10" />

      <p className="text-lg font-medium">
        사진과 동영상을 여기에 끌어다 놓으세요
      </p>

      <input {...getInputProps({ className: 'hidden' })} />

      <Button
        type="button"
        variant="outline"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          openFileDialog()
        }}
      >
        컴퓨터에서 선택
      </Button>
    </div>
  )
}
