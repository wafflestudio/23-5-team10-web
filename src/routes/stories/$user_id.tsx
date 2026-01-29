import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/stories/$user_id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/stories/$user_id"!</div>
}
