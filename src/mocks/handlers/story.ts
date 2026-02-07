import { http, HttpResponse } from 'msw'
import { z } from 'zod'
import { users } from '../db/user.db'
import { stories, nextStoryId } from '../db/story.db'
import { MOCK_USER_ID } from '../db/session.db'
import { ApiResponseSchema } from '@/entities/feed/model/schema'

const StoryFeedItemSchema = z.object({
  userId: z.string(),
  nickname: z.string(),
  profileImageUrl: z.string().nullable(),
  hasUnseenStory: z.boolean(),
  stories: z.array(
    z.object({
      id: z.number(),
      userId: z.string(),
      imageUrl: z.string(),
      createdAt: z.string(),
      viewCount: z.number().optional(),
    })
  ),
})

const CreateStoryRequestSchema = z.object({
  imageUrl: z.string().min(1),
})

export const storyHandlers = [
  http.post('*/api/v1/stories', async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 5000))
    const json = await request.json().catch(() => null)
    const result = CreateStoryRequestSchema.safeParse(json)

    if (!result.success) {
      return HttpResponse.json(
        {
          code: '400',
          message: '잘못된 요청입니다.',
          data: 0,
          isSuccess: false,
        },
        { status: 400 }
      )
    }

    const { imageUrl } = result.data
    const storyId = nextStoryId.value++
    stories.push({
      storyId,
      userId: MOCK_USER_ID,
      imageUrl,
      createdAt: new Date().toISOString(),
      viewCount: 0,
    })

    return HttpResponse.json({
      code: '200',
      message: '요청에 성공하였습니다.',
      isSuccess: true,
    })
  }),

  http.get('*/api/v1/stories/feed', () => {
    const storyFeedItems = users
      .map((user) => {
        const userStories = stories
          .filter((s) => s.userId === user.userId)
          .map((s) => ({
            id: s.storyId,
            userId: String(s.userId),
            imageUrl: s.imageUrl,
            createdAt: s.createdAt,
            viewCount: s.viewCount,
          }))

        if (userStories.length === 0) return null

        return StoryFeedItemSchema.parse({
          userId: String(user.userId),
          nickname: user.nickname,
          profileImageUrl: user.profileImageUrl,
          hasUnseenStory: Math.random() > 0.5,
          stories: userStories,
        })
      })
      .filter(
        (item): item is z.infer<typeof StoryFeedItemSchema> => item !== null
      )

    const responseBody = ApiResponseSchema(StoryFeedItemSchema.array()).parse({
      code: '200',
      message: '요청에 성공하였습니다.',
      data: storyFeedItems,
      isSuccess: true,
    })

    return HttpResponse.json(responseBody)
  }),

  http.delete('*/api/v1/stories/:storyId', ({ params }) => {
    const { storyId } = params
    const id = Number(storyId)

    const index = stories.findIndex((s) => s.storyId === id)
    if (index !== -1) {
      stories.splice(index, 1)
    }

    return HttpResponse.json({
      code: '200',
      message: '요청에 성공하였습니다.',
      isSuccess: true,
    })
  }),

  http.get('*/api/v1/stories/user/:userId', ({ params }) => {
    const { userId: userIdParam } = params
    const userId = Number(userIdParam)

    const user = users.find((u) => u.userId === userId)
    if (!user) {
      return HttpResponse.json(
        {
          code: '404',
          message: '사용자를 찾을 수 없습니다.',
          isSuccess: false,
        },
        { status: 404 }
      )
    }

    const userStories = stories
      .filter((story) => story.userId === userId)
      .map((s) => ({
        id: s.storyId,
        userId: String(s.userId),
        imageUrl: s.imageUrl,
        createdAt: s.createdAt,
        viewCount: s.viewCount,
      }))

    const responseData = StoryFeedItemSchema.parse({
      userId: String(user.userId),
      nickname: user.nickname,
      profileImageUrl: user.profileImageUrl,
      hasUnseenStory: false,
      stories: userStories,
    })

    const responseBody = ApiResponseSchema(StoryFeedItemSchema).parse({
      code: '200',
      message: '요청에 성공하였습니다.',
      data: responseData,
      isSuccess: true,
    })

    return HttpResponse.json(responseBody)
  }),
]
