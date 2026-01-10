import { createFileRoute } from '@tanstack/react-router'

import { ProfileContentContainer } from '@/widgets/profile-layout'

export const Route = createFileRoute('/_app/$profile_name/saved')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ProfileContentContainer className="py-6">저장됨</ProfileContentContainer>
  )
}
