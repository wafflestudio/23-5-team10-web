import { createFileRoute } from '@tanstack/react-router'

import { ExplorePage } from '@/pages/ExplorePage'

export const Route = createFileRoute('/_app/explore')({
  component: ExplorePage,
})
