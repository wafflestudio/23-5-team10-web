import { useCallback, useState } from 'react'
import type {
  ComponentPropsWithRef,
  HTMLAttributes,
  MutableRefObject,
  ReactNode,
} from 'react'

type RejectedFile = {
  file: File
  reason: string
}

type DropzoneApi = {
  getRootProps: (
    props?: HTMLAttributes<HTMLElement>
  ) => HTMLAttributes<HTMLElement>
  getInputProps: (
    props?: ComponentPropsWithRef<'input'>
  ) => ComponentPropsWithRef<'input'>
  openFileDialog: () => void
  isDragging: boolean
  isDisabled: boolean
}

type DropzoneProps = {
  onDropFiles: (files: File[]) => void
  onReject?: (rejected: RejectedFile[]) => void
  accept?: string
  multiple?: boolean
  disabled?: boolean
  maxSizeBytes?: number
  validateFile?: (file: File) => { ok: true } | { ok: false; reason: string }
  children: (api: DropzoneApi) => ReactNode
}

function composeEventHandlers<E>(
  theirs: ((event: E) => void) | undefined,
  ours: (event: E) => void
) {
  return (event: E) => {
    theirs?.(event)
    if ((event as unknown as { defaultPrevented?: boolean }).defaultPrevented)
      return
    ours(event)
  }
}

function isFileAccepted(file: File, accept: string | undefined) {
  if (!accept) return true

  const tokens = accept
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  if (tokens.length === 0) return true

  const fileName = file.name.toLowerCase()
  const fileType = file.type

  return tokens.some((token) => {
    if (token === '*/*') return true
    if (token.startsWith('.')) return fileName.endsWith(token.toLowerCase())
    if (token.endsWith('/*')) {
      const prefix = token.slice(0, token.length - 1)
      return fileType.startsWith(prefix)
    }
    return fileType === token
  })
}

export function Dropzone({
  onDropFiles,
  onReject,
  accept = 'image/*',
  multiple = true,
  disabled = false,
  maxSizeBytes,
  validateFile,
  children,
}: DropzoneProps) {
  const [inputEl, setInputEl] = useState<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const isDisabled = disabled

  const openFileDialog = useCallback(() => {
    if (isDisabled) return
    inputEl?.click()
  }, [inputEl, isDisabled])

  const handleFiles = useCallback(
    (fileList: FileList | null | undefined) => {
      if (isDisabled) return

      const rawFiles = fileList ? Array.from(fileList) : []
      if (rawFiles.length === 0) return

      const accepted: File[] = []
      const rejected: RejectedFile[] = []

      for (const file of rawFiles) {
        if (!isFileAccepted(file, accept)) {
          rejected.push({ file, reason: '지원하지 않는 파일 형식입니다.' })
          continue
        }

        if (typeof maxSizeBytes === 'number' && file.size > maxSizeBytes) {
          rejected.push({ file, reason: '파일 용량이 너무 큽니다.' })
          continue
        }

        if (validateFile) {
          const result = validateFile(file)
          if (!result.ok) {
            rejected.push({ file, reason: result.reason })
            continue
          }
        }

        accepted.push(file)
      }

      if (rejected.length > 0) onReject?.(rejected)
      if (accepted.length > 0) onDropFiles(accepted)
    },
    [accept, isDisabled, maxSizeBytes, onDropFiles, onReject, validateFile]
  )

  const getRootProps: DropzoneApi['getRootProps'] = useCallback(
    (props = {}) => {
      const onDragEnter = composeEventHandlers(props.onDragEnter, (event) => {
        if (isDisabled) return
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(true)
      })

      const onDragOver = composeEventHandlers(props.onDragOver, (event) => {
        if (isDisabled) return
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(true)
      })

      const onDragLeave = composeEventHandlers(props.onDragLeave, (event) => {
        if (isDisabled) return
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(false)
      })

      const onDrop = composeEventHandlers(props.onDrop, (event) => {
        if (isDisabled) return
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(false)
        handleFiles(event.dataTransfer?.files)
      })

      const onClick = composeEventHandlers(props.onClick, () => {
        openFileDialog()
      })

      const onKeyDown = composeEventHandlers(props.onKeyDown, (event) => {
        if (isDisabled) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          openFileDialog()
        }
      })

      return {
        ...props,
        role: props.role ?? 'button',
        tabIndex: props.tabIndex ?? (isDisabled ? -1 : 0),
        'aria-disabled': isDisabled || undefined,
        onDragEnter,
        onDragOver,
        onDragLeave,
        onDrop,
        onClick,
        onKeyDown,
      }
    },
    [handleFiles, isDisabled, openFileDialog]
  )

  const getInputProps: DropzoneApi['getInputProps'] = useCallback(
    (props = {}) => {
      const onChange = composeEventHandlers(props.onChange, (event) => {
        handleFiles(event.currentTarget.files)
        event.currentTarget.value = ''
      })

      return {
        ...props,
        ref: (node: HTMLInputElement | null) => {
          setInputEl(node)

          const consumerRef = props.ref
          if (!consumerRef) return
          if (typeof consumerRef === 'function') consumerRef(node)
          else
            (consumerRef as MutableRefObject<HTMLInputElement | null>).current =
              node
        },
        type: 'file',
        accept,
        multiple,
        disabled: isDisabled,
        onChange,
      }
    },
    [accept, handleFiles, isDisabled, multiple]
  )

  return children({
    getRootProps,
    getInputProps,
    openFileDialog,
    isDragging,
    isDisabled,
  })
}
