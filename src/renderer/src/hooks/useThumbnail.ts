import { useEffect, useState } from 'react'

type ThumbnailState = { status: 'loading' } | { status: 'done'; url: string } | { status: 'error' }

export function useThumbnail(filePath: string): ThumbnailState {
  const [state, setState] = useState<ThumbnailState>({ status: 'loading' })

  useEffect(() => {
    setState({ status: 'loading' })
    window.api
      .getThumbnail(filePath)
      .then((url) => setState({ status: 'done', url }))
      .catch(() => setState({ status: 'error' }))
  }, [filePath])

  return state
}
