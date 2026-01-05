import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$profile_name/saved')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Saved stories for "/$profile_name"!</div>
}
