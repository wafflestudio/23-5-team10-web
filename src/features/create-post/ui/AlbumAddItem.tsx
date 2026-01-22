import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Check, X } from 'lucide-react'

type AlbumAddItemProps = {
  title: string
  inputRef: React.RefObject<HTMLInputElement | null>
  isPending: boolean
  onTitleChange: (title: string) => void
  onCreate: () => void
  onCancel: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function AlbumAddItem({
  title,
  inputRef,
  isPending,
  onTitleChange,
  onCreate,
  onCancel,
  onKeyDown,
  onKeyUp,
}: AlbumAddItemProps) {
  return (
    <div className="flex items-center gap-1.5 px-4 py-2.5">
      <Input
        ref={inputRef}
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        placeholder="앨범 제목 입력..."
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
        onClick={onCreate}
        disabled={!title.trim() || isPending}
      >
        <Check className="size-4 text-blue-500" />
      </Button>
    </div>
  )
}
