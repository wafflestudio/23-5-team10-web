import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/stories/$profile_name/$story_id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/stories/$profile_name/$story_id"!</div>
}
