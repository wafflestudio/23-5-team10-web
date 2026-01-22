import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import PostDetail from '@/components/post/PostDetail'

export const Route = createFileRoute('/_app/p/$post_id')({
  validateSearch: z.object({
    returnToPath: z.string().optional(),
    returnToSearch: z.record(z.string(), z.unknown()).optional(),
  }),
  component: PostDetail,
})
