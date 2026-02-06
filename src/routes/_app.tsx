import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { NavigationShell } from '@/widgets/navigation-sidebar/ui/NavigationShell'

export const Route = createFileRoute('/_app')({
  beforeLoad: ({ location }) => {
    const isOAuthPath = location.pathname.startsWith('/oauth')
    const token = localStorage.getItem('accessToken')

    if (!isOAuthPath && !token) {
      throw redirect({ to: '/login' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { pathname } = window.location

  if (pathname.startsWith('/oauth')) {
    return <Outlet />
  }

  return (
    <>
      <NavigationShell />
      <Outlet />
    </>
  )
}
