import { postHandlers } from './handlers/post'
import { testHandlers } from './handlers/test'

export const handlers = [...postHandlers, ...testHandlers]
