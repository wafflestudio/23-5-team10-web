import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Providers } from '@/app/providers/Providers'

export const Route = createRootRoute({
  component: () => (
    <div>
      <Providers>
        <Outlet />
      </Providers>
      {import.meta.env.DEV ? <TanStackRouterDevtools /> : null}
    </div>
  ),
})
