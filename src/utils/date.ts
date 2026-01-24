export const formatRelativeTime = (dateString: string) => {
  const now = new Date()
  const past = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)
  const seconds = diffInSeconds < 0 ? 0 : diffInSeconds

  if (seconds < 60) return `${seconds}초`
  const diffInMinutes = Math.floor(seconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes}분`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}시간`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}일`
  const diffInWeeks = Math.floor(diffInDays / 7)
  return `${diffInWeeks}주`
}
