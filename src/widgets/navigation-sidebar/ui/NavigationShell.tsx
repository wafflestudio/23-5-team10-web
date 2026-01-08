import { NavigationSidebar } from './DesktopSidebar'
import { MobileBottomNavigation } from './MobileBottomSidebar'
import { useIsMobile } from '@/shared/lib/hooks/use-mobile'
import { useCallback, useState } from 'react'
import { CreateModal } from '@/features/create-post/ui/CreateModal'

export function NavigationShell() {
  const isMobile = useIsMobile()
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const openCreate = useCallback(() => setIsCreateOpen(true), [])

  return (
    <>
      <CreateModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      {isMobile ? (
        <MobileBottomNavigation onCreateClick={openCreate} />
      ) : (
        <NavigationSidebar onCreateClick={openCreate} />
      )}
    </>
  )
}
