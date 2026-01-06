import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/p/$profile_name')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/p/$profile_name"!</div>
}
