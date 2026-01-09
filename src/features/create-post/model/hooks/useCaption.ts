import { useCallback, useState } from 'react'

type UseCaptionParams = {
  maxLength: number
  initialValue?: string
}

export function useCaption({ maxLength, initialValue = '' }: UseCaptionParams) {
  const [caption, setCaption] = useState(initialValue)

  const captionLength = caption.length

  const setNextCaption = useCallback(
    (next: string) => {
      setCaption(next.slice(0, maxLength))
    },
    [maxLength]
  )

  return {
    caption,
    setCaption: setNextCaption,
    captionLength,
    maxLength,
  }
}
