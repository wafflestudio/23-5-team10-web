import { http, HttpResponse } from 'msw'
import { follows } from '../db/follow.db'
import { MOCK_USER_ID } from '../db/session.db'
import type {
  DeleteFollowResponse,
  FollowActionResponse,
} from '../types/follow'
import { toFollowUser } from '../utils/toFollowUser'

export const followHandlers = [
  http.post('*/api/v1/follows/:toUserId', ({ params }) => {
    const toUserId = Number(params.toUserId)
    const fromUserId = MOCK_USER_ID

    const index = follows.findIndex(
      (f) => f.fromUserId === fromUserId && f.toUserId === toUserId
    )

    if (index !== -1) {
      follows.splice(index, 1)
    } else {
      follows.push({
        fromUserId,
        toUserId,
      })
    }

    const response: FollowActionResponse = {
      isSuccess: true,
      code: '200',
      message: '요청에 성공하였습니다.',
      data: undefined,
    }

    return HttpResponse.json(response)
  }),
  http.get('*/api/v1/follows/:userId/following', ({ params }) => {
    const userId = Number(params.userId)

    const followingUserIds = follows
      .filter((f) => f.fromUserId === userId)
      .map((f) => f.toUserId)

    const data = followingUserIds.map(toFollowUser)

    return HttpResponse.json({
      isSuccess: true,
      code: '200',
      message: '요청에 성공하였습니다.',
      data,
    })
  }),
  http.get('*/api/v1/follows/:userId/follower', ({ params }) => {
    const userId = Number(params.userId)

    const followerUserIds = follows
      .filter((f) => f.toUserId === userId)
      .map((f) => f.fromUserId)

    const data = followerUserIds.map(toFollowUser)

    return HttpResponse.json({
      isSuccess: true,
      code: '200',
      message: '요청에 성공하였습니다.',
      data,
    })
  }),
  http.delete('*/api/v1/follows/followers/:followerId', ({ params }) => {
    const followerId = Number(params.followerId)
    const myUserId = MOCK_USER_ID

    const index = follows.findIndex(
      (f) => f.fromUserId === followerId && f.toUserId === myUserId
    )

    if (index !== -1) {
      follows.splice(index, 1)
    }

    const response: DeleteFollowResponse = {
      isSuccess: true,
      code: '200',
      message: '요청에 성공하였습니다.',
      data: undefined,
    }

    return HttpResponse.json(response)
  }),
]
