import { postHandlers } from './handlers/post'
import { commentHandlers } from './handlers/comment'
import { albumHandlers } from './handlers/album'
import { feedHandlers } from './handlers/feed'
import { followHandlers } from './handlers/follow'
import { testHandlers } from './handlers/test'
import { authHandlers } from './handlers/auth'

export const handlers = [
  ...authHandlers,
  ...postHandlers,
  ...commentHandlers,
  ...albumHandlers,
  ...feedHandlers,
  ...followHandlers,
  ...testHandlers,
]
