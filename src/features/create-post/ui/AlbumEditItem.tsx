import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Check, Trash2, X } from 'lucide-react'
import { DeleteAlbumDialog } from './DeleteAlbumDialog'

type AlbumEditItemProps = {
  title: string
  inputRef: React.RefObject<HTMLInputElement | null>
  isPending: boolean
  onTitleChange: (title: string) => void
  onUpdate: () => void
  onCancel: () => void
  onDelete: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function AlbumEditItem({
  title,
  inputRef,
  isPending,
  onTitleChange,
  onUpdate,
  onCancel,
  onDelete,
  onKeyDown,
}: AlbumEditItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <>
      <div className="flex items-center gap-1.5 px-4 py-2.5">
        <Input
          ref={inputRef}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="앨범 제목 입력..."
          maxLength={50}
          className="h-8 flex-1 border-none bg-zinc-50 text-sm focus-visible:ring-0"
          disabled={isPending}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 border-none hover:bg-zinc-100"
          onClick={onCancel}
          disabled={isPending}
        >
          <X className="size-4 text-zinc-600" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 border-none hover:bg-zinc-100"
          onClick={onUpdate}
          disabled={!title.trim() || isPending}
        >
          <Check className="size-4 text-blue-500" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 border-none hover:bg-red-50"
          onClick={() => setShowDeleteDialog(true)}
          disabled={isPending}
        >
          <Trash2 className="size-4 text-red-500" />
        </Button>
      </div>

      <DeleteAlbumDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDelete={onDelete}
      />
    </>
  )
}
