import { createFileRoute } from '@tanstack/react-router'
import { ProfileEditPage } from '@/pages/ProfileEditPage'

export const Route = createFileRoute('/_app/accounts/edit/')({
  component: ProfileEditPage,
})
