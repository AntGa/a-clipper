import { useEffect, useState } from 'react'

interface ClipCardProps {
  path: string
  onRemove: (path: string) => void
}

function fileName(path: string): string {
  return path.split(/[\\/]/).pop() ?? path
}

type ThumbnailState = { status: 'loading' } | { status: 'done'; url: string } | { status: 'error' }

function useThumbnail(filePath: string): ThumbnailState {
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

export default function ClipCard({ path, onRemove }: ClipCardProps): React.JSX.Element {
  const name = fileName(path)
  const thumb = useThumbnail(path)

  return (
    <div className="bg-neutral-800 rounded-lg overflow-hidden flex flex-col group">
      <div className="w-full aspect-video bg-neutral-700 relative">
        {thumb.status === 'done' && (
          <img src={thumb.url} alt={name} className="w-full h-full object-cover" />
        )}
        {thumb.status === 'loading' && (
          <div className="w-full h-full flex items-center justify-center text-neutral-600 text-3xl animate-pulse">
            🎬
          </div>
        )}
        {thumb.status === 'error' && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-neutral-600">
            <span className="text-2xl">🎥</span>
            <span className="text-xs">No preview</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <p className="text-sm text-neutral-200 font-medium truncate" title={name}>
          {name}
        </p>
        <button
          onClick={() => onRemove(path)}
          className="text-neutral-600 hover:text-red-400 transition-colors shrink-0 text-xl leading-none"
          title="Remove"
        >
          ×
        </button>
      </div>
    </div>
  )
}
