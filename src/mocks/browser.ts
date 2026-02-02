import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

worker.start({
  onUnhandledRequest(req, print) {
    const url = new URL(req.url)

    if (
      url.hostname.includes('picsum.photos') ||
      url.hostname.includes('pravatar.cc')
    ) {
      return
    }

    if (
      !url.pathname.startsWith('/api') &&
      url.origin === window.location.origin
    ) {
      return
    }

    if (url.pathname === '/login' || url.pathname.startsWith('/p/')) {
      return
    }

    print.warning()
  },
})
