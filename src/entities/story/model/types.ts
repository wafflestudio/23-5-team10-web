export interface Story {
  id: number
  userId: string
  imageUrl: string
  createdAt: string
  expiresAt?: string
  viewCount?: number
}

export interface StoryFeedItem {
  userId: string
  nickname: string
  profileImageUrl: string | null
  hasUnseenStory: boolean
  stories: Story[]
}

export interface StoryResponse<T> {
  isSuccess: boolean
  code: string
  message: string
  data: T
}

export interface UserStoriesData {
  hasUnseenStory: boolean
  stories: Story[]
}
