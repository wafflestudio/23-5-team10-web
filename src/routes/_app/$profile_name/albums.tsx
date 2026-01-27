import { createFileRoute } from '@tanstack/react-router'

import { ContentContainer } from '@/widgets/profile-layout'

export const Route = createFileRoute('/_app/$profile_name/albums')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ContentContainer className="py-6">
      <div />
    </ContentContainer>
  )
}
