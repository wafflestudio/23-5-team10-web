import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/$profile_name')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <div>Hello "/$profile_name"!</div>
      <Outlet />
    </div>
  )
}
