import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/$profile_name/saved')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>저장됨</div>
}
