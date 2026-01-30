export interface MockUser {
  userId: number
  nickname: string
  profileImageUrl: string | null
  name: string | null
  bio: string | null
}

export const users: MockUser[] = [
  {
    userId: 1,
    nickname: 'me_1',
    profileImageUrl: null,
    name: 'Me',
    bio: '안녕하세요, 저는 테스터입니다.',
  },
  {
    userId: 2,
    nickname: 'alice.w',
    profileImageUrl: 'https://picsum.photos/200',
    name: 'Alice',
    bio: 'Hello, I am Alice.',
  },
  {
    userId: 3,
    nickname: 'bob.photo',
    profileImageUrl: 'https://picsum.photos/200',
    name: 'Bob',
    bio: 'Photography enthusiast.',
  },
  {
    userId: 4,
    nickname: 'charlie.art',
    profileImageUrl: 'https://picsum.photos/200',
    name: 'Charlie',
    bio: 'Art and design.',
  },
  {
    userId: 5,
    nickname: 'the.celebrity',
    profileImageUrl: 'https://picsum.photos/200',
    name: 'Celebrity',
    bio: 'Public figure.',
  },
]
