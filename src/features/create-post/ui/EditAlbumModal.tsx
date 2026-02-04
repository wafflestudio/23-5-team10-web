import { useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { useUpdateAlbumTitleMutation } from '@/entities/album/model/hooks/useUpdateAlbumTitleMutation'
import { instance } from '@/shared/api/ky'
import { toast } from 'sonner'

interface EditAlbumModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  albumId: number
  initialTitle: string
}

export function EditAlbumModal({
  open,
  onOpenChange,
  albumId,
  initialTitle,
}: EditAlbumModalProps) {
  const [title, setTitle] = useState(initialTitle)
  const updateAlbum = useUpdateAlbumTitleMutation()

  const handleUpdate = useCallback(() => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle || trimmedTitle === initialTitle) {
      onOpenChange(false)
      return
    }

    updateAlbum.mutate(
      {
        albumId,
        payload: { title: trimmedTitle },
      },
      {
        onSuccess: () => {
          toast.success('앨범 제목이 수정되었습니다.')
          onOpenChange(false)
        },
        onError: () => {
          toast.error('앨범 제목 수정에 실패했습니다.')
        },
      }
    )
  }, [albumId, title, initialTitle, onOpenChange, updateAlbum])

  const handleDelete = useCallback(async () => {
    if (!confirm('앨범을 삭제하시겠습니까?')) return
    try {
      const res = await instance
        .delete(`api/v1/albums/${albumId}`)
        .json<{ isSuccess: boolean }>()
      if (res.isSuccess) {
        toast.success('앨범이 삭제되었습니다.')
        onOpenChange(false)
        window.location.reload()
      }
    } catch {
      toast.error('앨범 삭제에 실패했습니다.')
    }
  }, [albumId, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[130] max-w-[400px] overflow-hidden rounded-xl p-0">
        <DialogHeader className="flex-row items-center justify-between space-y-0 border-b px-4 py-3">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-auto p-0 font-normal text-black hover:bg-transparent"
          >
            취소
          </Button>
          <DialogTitle className="text-base font-semibold">
            정보 수정
          </DialogTitle>
          <Button
            variant="ghost"
            onClick={handleUpdate}
            disabled={updateAlbum.isPending}
            className="h-auto p-0 font-semibold text-sky-500 hover:bg-transparent hover:text-sky-600 disabled:opacity-50"
          >
            완료
          </Button>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 p-4">
          <div className="h-20 w-20 rounded-full border border-zinc-200 bg-zinc-100" />
          <div className="w-full space-y-1.5">
            <label className="px-1 text-xs font-semibold text-zinc-500">
              제목
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-none bg-zinc-50 text-base focus-visible:ring-0"
              placeholder="앨범 제목"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUpdate()
              }}
            />
          </div>
        </div>

        <div className="border-t">
          <Button
            variant="ghost"
            onClick={handleDelete}
            className="h-auto w-full rounded-none py-4 font-semibold text-red-500 hover:bg-zinc-50 hover:text-red-600"
          >
            앨범 삭제
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
