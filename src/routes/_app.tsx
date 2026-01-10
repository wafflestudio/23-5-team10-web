import { createFileRoute, Outlet } from '@tanstack/react-router'

import { NavigationShell } from '@/widgets/navigation-sidebar/ui/NavigationShell'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <NavigationShell />
      <Outlet />
    </>
  )
}
