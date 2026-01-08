import { NavigationSidebar } from './DesktopSidebar'
import { MobileBottomNavigation } from './MobileBottomSidebar'
import { useIsMobile } from '@/shared/lib/hooks/use-mobile'

export function NavigationShell() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileBottomNavigation /> : <NavigationSidebar />
}
