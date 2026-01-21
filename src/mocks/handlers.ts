import { postHandlers } from './handlers/post'
import { commentHandlers } from './handlers/comment'
import { albumHandlers } from './handlers/album'

export const handlers = [...postHandlers, ...commentHandlers, ...albumHandlers]
