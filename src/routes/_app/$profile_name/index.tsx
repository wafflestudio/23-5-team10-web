import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/$profile_name/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>게시물</div>
}
