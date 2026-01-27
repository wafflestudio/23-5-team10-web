import type { ComponentPropsWithRef, HTMLAttributes } from 'react'

import { Button } from '@/shared/ui/button'
import { ImagePlus } from 'lucide-react'

type EmptyStoryDropzoneStateProps = {
  getRootProps: (
    props?: HTMLAttributes<HTMLElement>
  ) => HTMLAttributes<HTMLElement>
  getInputProps: (
    props?: ComponentPropsWithRef<'input'>
  ) => ComponentPropsWithRef<'input'>
  openFileDialog: () => void
  isDragging: boolean
}

export function EmptyStoryDropzoneState({
  getRootProps,
  getInputProps,
  openFileDialog,
  isDragging,
}: EmptyStoryDropzoneStateProps) {
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

      <p className="text-lg font-medium break-keep">
        스토리에 올릴 사진을 여기에 끌어다 놓으세요
      </p>

      <input {...getInputProps({ className: 'hidden' })} />

      <Button
        type="button"
        className="bg-gray-200"
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
