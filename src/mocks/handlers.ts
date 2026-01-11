import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get(`${import.meta.env.VITE_API_URL}/posts/:postId`, ({ params }) => {
    const { postId } = params

    return HttpResponse.json({
      id: postId,
      content: 'MSW로 만든 가짜 게시글입니다.',
      image_urls: [
        'https://picsum.photos/id/10/600/600',
        'https://picsum.photos/id/11/600/600',
      ],
      author: {
        id: 1,
        username: 'test_user',
        profile_image: 'https://picsum.photos/id/64/150/150',
      },
    })
  }),
]
