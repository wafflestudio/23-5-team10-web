import { postHandlers } from './handlers/post'
import { commentHandlers } from './handlers/comment'
import { albumHandlers } from './handlers/album'
import { feedHandlers } from './handlers/feed'
import { followHandlers } from './handlers/follow'
import { testHandlers } from './handlers/test'
import { authHandlers } from './handlers/auth'
import { imageHandlers } from './handlers/images'
import { storyHandlers } from './handlers/story'
import { userHandlers } from './handlers/user'
import { searchHandlers } from './handlers/search'

export const handlers = [
  ...authHandlers,
  ...postHandlers,
  ...commentHandlers,
  ...albumHandlers,
  ...feedHandlers,
  ...followHandlers,
  ...imageHandlers,
  ...storyHandlers,
  ...userHandlers,
  ...searchHandlers,
  ...testHandlers,
]
