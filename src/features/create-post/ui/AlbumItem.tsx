import { Button } from '@/shared/ui/button'
import { DropdownMenuRadioItem } from '@/shared/ui/dropdown-menu'
import { Pencil } from 'lucide-react'

type AlbumItemProps = {
  albumId: number
  title: string
  onSelect: () => void
  onEdit: (e: React.MouseEvent) => void
}

export function AlbumItem({
  albumId,
  title,
  onSelect,
  onEdit,
}: AlbumItemProps) {
  return (
    <DropdownMenuRadioItem
      value={String(albumId)}
      className="group border-none px-4 py-2.5 text-sm text-black hover:bg-zinc-50 data-[state=checked]:bg-zinc-100"
      onSelect={onSelect}
    >
      <span className="flex-1">{title}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 border-none opacity-0 transition-opacity group-hover:opacity-100 hover:bg-zinc-100"
        onClick={onEdit}
      >
        <Pencil className="size-3.5 text-zinc-600" />
      </Button>
    </DropdownMenuRadioItem>
  )
}
