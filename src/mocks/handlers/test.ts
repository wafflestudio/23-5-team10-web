import { http, HttpResponse } from 'msw'

export const testHandlers = [
  http.get('*/actuator/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),
]
