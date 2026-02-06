import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/$userId/$')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/$userId',
      params: { userId: params.userId },
    })
  },
})
