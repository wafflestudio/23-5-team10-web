export interface MockUser {
  userId: number
  nickname: string
  profileImageUrl: string
  name: string
}

export const users: MockUser[] = [
  {
    userId: 1,
    nickname: 'me_1',
    profileImageUrl: 'https://picsum.photos/200',
    name: 'Me',
  },
  {
    userId: 2,
    nickname: 'alice.w',
    profileImageUrl: 'https://picsum.photos/200',
    name: 'Alice',
  },
  {
    userId: 3,
    nickname: 'bob.photo',
    profileImageUrl: 'https://picsum.photos/200',
    name: 'Bob',
  },
  {
    userId: 4,
    nickname: 'charlie.art',
    profileImageUrl: 'https://picsum.photos/200',
    name: 'Charlie',
  },
  {
    userId: 5,
    nickname: 'the.celebrity',
    profileImageUrl: 'https://picsum.photos/200',
    name: 'Celebrity',
  },
]
