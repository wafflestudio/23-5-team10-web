import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { NavigationShell } from '@/widgets/navigation-sidebar/ui/NavigationShell'

export const Route = createFileRoute('/_app')({
  beforeLoad: () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      throw redirect({ to: '/login' })
    }
  },
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
