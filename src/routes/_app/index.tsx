import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { HomePage } from '@/pages/HomePage'

export const Route = createFileRoute('/_app/')({
  validateSearch: z.object({
    page: z.coerce.number().int().positive().optional().default(1),
  }),
  component: HomePage,
})
