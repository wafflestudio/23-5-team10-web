import { postHandlers } from './handlers/post'
import { commentHandlers } from './handlers/comment'
import { feedHandlers } from './handlers/feed'
import { testHandlers } from './handlers/test'

export const handlers = [
  ...postHandlers,
  ...commentHandlers,
  ...feedHandlers,
  ...testHandlers,
]
