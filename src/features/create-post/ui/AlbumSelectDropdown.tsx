import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Button } from '@/shared/ui/button'
import { useCurrentUserId } from '@/shared/auth/useCurrentUser'
import { useUserAlbumsQuery } from '@/entities/album/model/hooks/useUserAlbumsQuery'
import {
  useAlbumDropdownState,
  NO_ALBUM_VALUE,
  ADD_ALBUM_VALUE,
} from '@/features/create-post/model/hooks/useAlbumDropdownState'
import { useAlbumAdd } from '@/features/create-post/model/hooks/useAlbumAdd'
import { useAlbumEdit } from '@/features/create-post/model/hooks/useAlbumEdit'
import { AlbumItem } from '@/features/create-post/ui/AlbumItem'
import { AlbumEditItem } from '@/features/create-post/ui/AlbumEditItem'
import { AlbumAddItem } from '@/features/create-post/ui/AlbumAddItem'

type AlbumSelectDropdownProps = {
  selectedAlbumId: number
  onSelect: (albumId: number) => void
}

export function AlbumSelectDropdown({
  selectedAlbumId,
  onSelect,
}: AlbumSelectDropdownProps) {
  const currentUserId = useCurrentUserId()
  const { data: albums, isLoading } = useUserAlbumsQuery({
    userId: currentUserId ?? 0,
    enabled: currentUserId !== null,
  })

  const {
    state,
    addInputRef,
    editInputRef,
    handleValueChange,
    handleAddStart,
    handleAddCancel,
    handleAddTitleChange,
    handleEditStart,
    handleEditCancel,
    handleEditTitleChange,
    handleOpenChange: handleOpenChangeBase,
    handleAddComplete,
    handleEditComplete,
  } = useAlbumDropdownState({
    initialSelectedAlbumId: selectedAlbumId,
    onSelect,
  })

  const {
    createAlbumMutation,
    handleCreate,
    handleKeyDown: handleAddKeyDown,
    handleKeyUp: handleAddKeyUp,
  } = useAlbumAdd({
    newAlbumTitle: state.newAlbumTitle,
    onComplete: handleAddComplete,
    onCancel: handleAddCancel,
    onError: (title) => {
      handleAddStart()
      handleAddTitleChange(title)
    },
  })

  const {
    updateAlbumTitleMutation,
    handleUpdate: handleUpdateAlbum,
    handleKeyDown: handleEditKeyDown,
  } = useAlbumEdit({
    albumId: state.editingAlbumId,
    editingTitle: state.editingAlbumTitle,
    onComplete: handleEditComplete,
  })

  const handleOpenChange = (open: boolean) => {
    if (
      !open &&
      (state.isAddingAlbum ||
        state.editingAlbumId !== null ||
        createAlbumMutation.isPending ||
        updateAlbumTitleMutation.isPending)
    ) {
      return
    }
    handleOpenChangeBase(open)
  }

  const handleEditClick = (e: React.MouseEvent, albumId: number) => {
    e.stopPropagation()
    const album = albums?.find((a) => a.albumId === albumId)
    if (album) {
      handleEditStart(albumId, album.title)
    }
  }

  const displayText =
    selectedAlbumId === -1
      ? '앨범 없음'
      : (albums?.find((album) => album.albumId === selectedAlbumId)?.title ??
        '앨범 없음')

  return (
    <DropdownMenu open={state.isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 w-full justify-start border border-zinc-200 px-4 py-5 text-sm font-normal text-black"
        >
          <span className="truncate">{displayText}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-80 border-none bg-white p-0 shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
      >
        <DropdownMenuRadioGroup
          value={state.value}
          onValueChange={handleValueChange}
        >
          <DropdownMenuRadioItem
            value={NO_ALBUM_VALUE}
            className="border-none px-4 py-2.5 text-sm text-black hover:bg-zinc-50 data-[state=checked]:bg-zinc-50"
          >
            앨범 없음
          </DropdownMenuRadioItem>

          {isLoading ? (
            <div className="px-4 py-2.5 text-sm text-zinc-400">로딩 중...</div>
          ) : (
            albums
              ?.filter((album) => album.albumId !== -1)
              .map((album) => {
                const isEditing = state.editingAlbumId === album.albumId

                return isEditing ? (
                  <AlbumEditItem
                    key={album.albumId}
                    title={state.editingAlbumTitle}
                    inputRef={editInputRef}
                    isPending={updateAlbumTitleMutation.isPending}
                    onTitleChange={handleEditTitleChange}
                    onUpdate={handleUpdateAlbum}
                    onCancel={handleEditCancel}
                    onKeyDown={(e) => handleEditKeyDown(e, handleEditCancel)}
                  />
                ) : (
                  <AlbumItem
                    key={album.albumId}
                    albumId={album.albumId}
                    title={album.title}
                    onSelect={() => handleValueChange(String(album.albumId))}
                    onEdit={(e) => handleEditClick(e, album.albumId)}
                  />
                )
              })
          )}

          {state.isAddingAlbum ? (
            <AlbumAddItem
              title={state.newAlbumTitle}
              inputRef={addInputRef}
              isPending={createAlbumMutation.isPending}
              onTitleChange={handleAddTitleChange}
              onCreate={handleCreate}
              onCancel={handleAddCancel}
              onKeyDown={handleAddKeyDown}
              onKeyUp={handleAddKeyUp}
            />
          ) : (
            <>
              <div className="h-px w-full bg-zinc-200" />
              <DropdownMenuRadioItem
                value={ADD_ALBUM_VALUE}
                className="cursor-pointer border-none px-4 py-2.5 text-sm font-medium text-blue-500 hover:bg-zinc-50"
                onSelect={(e) => {
                  e.preventDefault()
                  handleValueChange(ADD_ALBUM_VALUE)
                }}
              >
                앨범 추가
              </DropdownMenuRadioItem>
            </>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
