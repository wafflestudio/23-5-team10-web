export const generateRandomId = (base: string) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const numbers = '0123456789'

  const cleanBase = base.replace(/[^a-zA-Z0-9._]/g, '').toLowerCase() || 'user'

  const getRand = (src: string, len: number) =>
    Array.from(
      { length: len },
      () => src[Math.floor(Math.random() * src.length)]
    ).join('')

  const patterns = [
    (b: string) => b.slice(0, Math.max(3, b.length - 2)) + getRand(numbers, 2),
    (b: string) => b.slice(0, 8) + '_' + getRand(chars, 2),
    (b: string) =>
      b.length > 5 ? b.slice(2) + getRand(numbers, 2) : b + getRand(numbers, 3),
    (b: string) => b.slice(0, 10) + '.' + getRand(numbers, 2),
    (b: string) => 'the.' + b.slice(0, 10),
    (b: string) => b.slice(0, 5) + '_' + b.slice(-3) + getRand(numbers, 1),
    (b: string) => (b.length > 8 ? b.slice(0, 6) : b + '_id'),
    (b: string) => getRand(numbers, 2) + b.slice(0, 10),
    (b: string) => b.replace(/[aeiou]/g, '').slice(0, 8) + getRand(numbers, 2),
    (b: string) => b.slice(0, 12) + '._.',
  ]

  const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)]
  let result = selectedPattern(cleanBase)

  const randLen = Math.random()
  if (randLen > 0.8) result = result.slice(0, 6)
  else if (randLen > 0.4) result = result.slice(0, 12)
  else result = result.slice(0, 18)

  while (result.includes('..')) {
    result = result.replace('..', `.${getRand(numbers, 1)}`)
  }

  if (/^[._]/.test(result)) {
    result = result.replace(/^[._]/, getRand(numbers, 1))
  }

  if (/[._]$/.test(result)) {
    result = result.replace(/[._]$/, getRand(numbers, 1))
  }

  return result
}
