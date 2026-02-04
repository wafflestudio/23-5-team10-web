import { useActionState, useCallback, useRef, useEffect } from 'react'

const NO_ALBUM_VALUE = 'no-album'
const ADD_ALBUM_VALUE = 'add-album'

type AlbumDropdownAction =
  | { type: 'value_change'; value: string }
  | { type: 'add_start' }
  | { type: 'add_cancel' }
  | { type: 'add_title_change'; title: string }
  | { type: 'edit_start'; albumId: number; title: string }
  | { type: 'edit_cancel' }
  | { type: 'edit_title_change'; title: string }
  | { type: 'open_change'; open: boolean }
  | { type: 'reset_edit' }
  | { type: 'sync_initial_value'; albumId: number }

type AlbumDropdownState = {
  value: string
  isAddingAlbum: boolean
  newAlbumTitle: string
  editingAlbumId: number | null
  editingAlbumTitle: string
  isOpen: boolean
}

const INITIAL_STATE: AlbumDropdownState = {
  value: NO_ALBUM_VALUE,
  isAddingAlbum: false,
  newAlbumTitle: '',
  editingAlbumId: null,
  editingAlbumTitle: '',
  isOpen: false,
}

function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`)
}

type UseAlbumDropdownStateArgs = {
  initialSelectedAlbumId: number
  onSelect: (albumId: number) => void
}

export function useAlbumDropdownState({
  initialSelectedAlbumId,
  onSelect,
}: UseAlbumDropdownStateArgs) {
  const initialState: AlbumDropdownState = {
    ...INITIAL_STATE,
    value:
      initialSelectedAlbumId === -1
        ? NO_ALBUM_VALUE
        : String(initialSelectedAlbumId),
  }

  const [state, dispatch] = useActionState<
    AlbumDropdownState,
    AlbumDropdownAction
  >((prev, action) => {
    switch (action.type) {
      case 'value_change': {
        if (prev.editingAlbumId !== null || prev.isAddingAlbum) {
          return prev
        }

        const newState = { ...prev, value: action.value }

        if (action.value === NO_ALBUM_VALUE) {
          onSelect(-1)
          return { ...newState, isOpen: false }
        } else if (action.value === ADD_ALBUM_VALUE) {
          return {
            ...newState,
            isAddingAlbum: true,
            newAlbumTitle: '',
            isOpen: true,
          }
        } else {
          const albumId = Number(action.value)
          if (!Number.isNaN(albumId)) {
            onSelect(albumId)
          }
          return { ...newState, isOpen: false }
        }
      }

      case 'add_start':
        return {
          ...prev,
          isAddingAlbum: true,
          newAlbumTitle: '',
          isOpen: true,
        }

      case 'add_cancel':
        return {
          ...prev,
          isAddingAlbum: false,
          newAlbumTitle: '',
          value:
            initialSelectedAlbumId === -1
              ? NO_ALBUM_VALUE
              : String(initialSelectedAlbumId),
        }

      case 'add_title_change':
        return {
          ...prev,
          newAlbumTitle: action.title,
        }

      case 'edit_start':
        return {
          ...prev,
          editingAlbumId: action.albumId,
          editingAlbumTitle: action.title,
          isOpen: true,
        }

      case 'edit_cancel':
        return {
          ...prev,
          editingAlbumId: null,
          editingAlbumTitle: '',
        }

      case 'edit_title_change':
        return {
          ...prev,
          editingAlbumTitle: action.title,
        }

      case 'open_change': {
        if (
          !action.open &&
          (prev.isAddingAlbum || prev.editingAlbumId !== null)
        ) {
          return prev
        }

        const newState = { ...prev, isOpen: action.open }

        if (!action.open) {
          return {
            ...newState,
            editingAlbumId: null,
            editingAlbumTitle: '',
            isAddingAlbum: false,
          }
        }

        return newState
      }

      case 'reset_edit':
        return {
          ...prev,
          editingAlbumId: null,
          editingAlbumTitle: '',
        }

      case 'sync_initial_value':
        return {
          ...prev,
          value:
            action.albumId === -1 ? NO_ALBUM_VALUE : String(action.albumId),
        }

      default:
        return assertNever(action)
    }
  }, initialState)

  const addInputRef = useRef<HTMLInputElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    dispatch({ type: 'sync_initial_value', albumId: initialSelectedAlbumId })
  }, [initialSelectedAlbumId])

  useEffect(() => {
    if (state.isAddingAlbum && addInputRef.current) {
      addInputRef.current.focus()
    }
  }, [state.isAddingAlbum])

  useEffect(() => {
    if (state.editingAlbumId !== null && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [state.editingAlbumId])

  const handleValueChange = useCallback(
    (newValue: string) => {
      dispatch({ type: 'value_change', value: newValue })
    },
    [dispatch]
  )

  const handleAddStart = useCallback(() => {
    dispatch({ type: 'add_start' })
  }, [dispatch])

  const handleAddCancel = useCallback(() => {
    dispatch({ type: 'add_cancel' })
  }, [dispatch])

  const handleAddTitleChange = useCallback(
    (title: string) => {
      dispatch({ type: 'add_title_change', title })
    },
    [dispatch]
  )

  const handleEditStart = useCallback(
    (albumId: number, title: string) => {
      dispatch({ type: 'edit_start', albumId, title })
    },
    [dispatch]
  )

  const handleEditCancel = useCallback(() => {
    dispatch({ type: 'edit_cancel' })
  }, [dispatch])

  const handleEditTitleChange = useCallback(
    (title: string) => {
      dispatch({ type: 'edit_title_change', title })
    },
    [dispatch]
  )

  const handleOpenChange = useCallback(
    (open: boolean) => {
      dispatch({ type: 'open_change', open })
    },
    [dispatch]
  )

  const handleAddComplete = useCallback(() => {
    dispatch({ type: 'add_cancel' })
  }, [dispatch])

  const handleEditComplete = useCallback(() => {
    dispatch({ type: 'reset_edit' })
  }, [dispatch])

  return {
    state,
    addInputRef,
    editInputRef,
    handleValueChange,
    handleAddStart,
    handleAddCancel,
    handleAddTitleChange,
    handleEditStart,
    handleEditCancel,
    handleEditTitleChange,
    handleOpenChange,
    handleAddComplete,
    handleEditComplete,
  }
}

export { NO_ALBUM_VALUE, ADD_ALBUM_VALUE }
