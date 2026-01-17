import { postHandlers } from './handlers/post'
import { commentHandlers } from './handlers/comment'

export const handlers = [...postHandlers, ...commentHandlers]
