import { http, HttpResponse } from 'msw'
import { posts } from '../db/post.db'

export const postHandlers = [
  http.get('/api/v1/posts/:postId', ({ params }) => {
    const { postId } = params
    const post = posts.find((p) => p.id === postId)

    if (!post) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json({
      success: true,
      data: post,
    })
  }),
]
