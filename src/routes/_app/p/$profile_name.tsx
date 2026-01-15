import { createFileRoute } from '@tanstack/react-router'
import PostDetail from '@/components/post/PostDetail'

export const Route = createFileRoute('/_app/p/$profile_name')({
  component: PostDetail,
})
