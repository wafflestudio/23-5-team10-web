import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/explore')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/explore"!</div>
}
