import { useEffect, useState } from 'react'
import { Clip } from '@renderer/types/clip'
import { useClipsStore } from '@renderer/store/clips'

interface ClipCardProps {
  clip: Clip
  onRemove: () => void
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

const statusStyles: Record<Clip['status'], string> = {
  pending: 'bg-neutral-600 text-neutral-300',
  ready: 'bg-green-600 text-white',
  processing: 'bg-yellow-600 text-white',
  done: 'bg-blue-600 text-white',
  error: 'bg-red-600 text-white',
}

export default function ClipCard({ clip, onRemove }: ClipCardProps): React.JSX.Element {
  const { markReady, markPending } = useClipsStore()
  const thumb = useThumbnail(clip.path)

  const toggleReady = () => {
    if (clip.status === 'ready') markPending(clip.id)
    else markReady(clip.id)
  }

  return (
    <div className="bg-neutral-800 rounded-lg overflow-hidden flex flex-col group">
      {/* Thumbnail */}
      <div className="w-full aspect-video bg-neutral-700 relative">
        {thumb.status === 'done' && (
          <img src={thumb.url} alt={clip.title} className="w-full h-full object-cover" />
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

        {/* Status badge */}
        <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyles[clip.status]}`}>
          {clip.status}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 px-3 py-2.5">
        <p className="text-sm text-neutral-200 font-medium truncate" title={clip.title}>
          {clip.title}
        </p>
        <div className="flex items-center justify-between">
          <button
            onClick={toggleReady}
            className={`text-xs font-medium px-3 py-1 rounded-md transition-colors ${
              clip.status === 'ready'
                ? 'bg-green-600/20 text-green-400 hover:bg-red-600/20 hover:text-red-400'
                : 'bg-neutral-700 text-neutral-400 hover:bg-green-600/20 hover:text-green-400'
            }`}
          >
            {clip.status === 'ready' ? 'Unmark' : 'Mark ready'}
          </button>
          <button
            onClick={onRemove}
            className="text-neutral-600 hover:text-red-400 transition-colors text-xl leading-none"
            title="Remove"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
