import { createFileRoute } from '@tanstack/react-router'

import { useQuery } from '@tanstack/react-query'
import { getTest } from '@/shared/api/test'

export const Route = createFileRoute('/_app/test')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['test'],
    queryFn: getTest,
    retry: false,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return <div>Data: {JSON.stringify(data)}</div>
}
