import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/me')({
  component: RouteComponent,
})

// TODO: add redirect after getting user data
function RouteComponent() {
  return <div>Hello "/me"!</div>
}
