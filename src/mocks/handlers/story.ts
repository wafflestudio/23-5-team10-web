import { http, HttpResponse } from 'msw'
import { z } from 'zod'
import { users } from '../db/user.db'
import { stories, nextStoryId } from '../db/story.db'
import { MOCK_USER_ID } from '../db/session.db'
import { ApiResponseSchema } from '@/entities/feed/model/schema'

const StoryFeedItemSchema = z.object({
  userId: z.number(),
  nickname: z.string(),
  profileImageUrl: z.string().nullable(),
  hasUnseenStory: z.boolean(),
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

    const responseBody = {
      code: '200',
      message: '요청에 성공하였습니다.',
      isSuccess: true as const,
    }

    return HttpResponse.json(responseBody)
  }),
  http.get('*/api/v1/stories/feed', () => {
    const storyFeedItems = users.map((user) =>
      StoryFeedItemSchema.parse({
        userId: user.userId,
        nickname: user.nickname,
        profileImageUrl: user.profileImageUrl,
        hasUnseenStory: Math.random() > 0.5,
      })
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
    const storyId = Number(params.storyId)

    if (!Number.isInteger(storyId) || storyId < 1) {
      return HttpResponse.json(
        {
          code: '400',
          message: '유효하지 않은 경로 파라미터입니다.',
          isSuccess: false,
        },
        { status: 400 }
      )
    }

    const responseBody = {
      code: '200',
      message: '요청에 성공하였습니다.',
      isSuccess: true as const,
    }

    return HttpResponse.json(responseBody)
  }),
  http.get('*/api/v1/stories/user/:userId', ({ params }) => {
    const userId = Number(params.userId)

    if (!Number.isInteger(userId) || userId < 1) {
      return HttpResponse.json(
        {
          code: '400',
          message: '유효하지 않은 경로 파라미터입니다.',
          isSuccess: false,
        },
        { status: 400 }
      )
    }

    const userStories = stories.filter((story) => story.userId === userId)
    const isMyStory = userId === MOCK_USER_ID

    const StoryItemSchema = z.object({
      storyId: z.number(),
      imageUrl: z.string(),
      createdAt: z.string(),
      viewCount: z.number().nullable(),
    })

    const storyItems = userStories.map((story) =>
      StoryItemSchema.parse({
        storyId: story.storyId,
        imageUrl: story.imageUrl,
        createdAt: story.createdAt,
        viewCount: isMyStory ? story.viewCount : null,
      })
    )

    const responseBody = ApiResponseSchema(StoryItemSchema.array()).parse({
      code: '200',
      message: '요청에 성공하였습니다.',
      data: storyItems,
      isSuccess: true,
    })

    return HttpResponse.json(responseBody)
  }),
]
