export type Album = {
  id: number
  title: string
}

export const albums: Album[] = [
  {
    id: 1,
    title: '여행 사진',
  },
  {
    id: 2,
    title: '맛집 기록',
  },
]

export const nextAlbumId = { value: 3 }
