export interface MockRecentSearch {
  searchId: number
  userId: number
}

export const recentSearchDb: MockRecentSearch[] = []

let nextSearchId = 1

export function getNextSearchId(): number {
  return nextSearchId++
}
