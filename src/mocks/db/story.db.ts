export interface MockStory {
  storyId: number
  userId: number
  imageUrl: string
  createdAt: string
  viewCount: number
}

export const nextStoryId = { value: 6 }

export const stories: MockStory[] = [
  {
    storyId: 1,
    userId: 1,
    imageUrl: 'https://picsum.photos/400/600?random=1',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    viewCount: 15,
  },
  {
    storyId: 2,
    userId: 1,
    imageUrl: 'https://picsum.photos/400/600?random=2',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    viewCount: 8,
  },
  {
    storyId: 3,
    userId: 2,
    imageUrl: 'https://picsum.photos/400/600?random=3',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    viewCount: 0,
  },
  {
    storyId: 4,
    userId: 3,
    imageUrl: 'https://picsum.photos/400/600?random=4',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    viewCount: 0,
  },
  {
    storyId: 5,
    userId: 4,
    imageUrl: 'https://picsum.photos/400/600?random=5',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    viewCount: 0,
  },
]
