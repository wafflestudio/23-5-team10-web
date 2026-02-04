import { NavigationSidebar } from './DesktopSidebar'
import { MobileBottomNavigation } from './MobileBottomSidebar'
import { useIsMobile } from '@/shared/lib/hooks/use-mobile'
import { useCallback, useState } from 'react'
import { CreateModal } from '@/features/create-post/ui/CreateModal'
import { CreateStoryModal } from '@/features/create-story/ui/CreateStoryModal'
import { useCreatePostModalStore } from '@/features/create-post/model/store'

export function NavigationShell() {
  const isMobile = useIsMobile()
  const { isOpen: isCreatePostOpen, setOpen: setIsCreatePostOpen } =
    useCreatePostModalStore()
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false)

  const openCreatePost = useCallback(
    () => setIsCreatePostOpen(true),
    [setIsCreatePostOpen]
  )
  const openCreateStory = useCallback(() => setIsCreateStoryOpen(true), [])

  return (
    <>
      <CreateModal open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen} />
      <CreateStoryModal
        open={isCreateStoryOpen}
        onOpenChange={setIsCreateStoryOpen}
      />
      {isMobile ? (
        <MobileBottomNavigation
          onCreatePostClick={openCreatePost}
          onCreateStoryClick={openCreateStory}
        />
      ) : (
        <NavigationSidebar
          onCreatePostClick={openCreatePost}
          onCreateStoryClick={openCreateStory}
        />
      )}
    </>
  )
}
