const LOCALE_KO_KR = 'ko-KR'

export function numberFormat(value: number, locale: string = LOCALE_KO_KR) {
  return value.toLocaleString(locale)
}
