import { useState } from 'react'
import DropZone from './_components/DropZone'
import ClipCard from './_components/ClipCard'

export default function Clips(): React.JSX.Element {
  const [clips, setClips] = useState<string[]>([])

  const handleFiles = (paths: string[]): void => {
    setClips((prev) => {
      const existing = new Set(prev)
      const newPaths = paths.filter((p) => !existing.has(p))
      return [...prev, ...newPaths]
    })
  }

  const handleRemove = (path: string): void => {
    setClips((prev) => prev.filter((p) => p !== path))
  }

  return (
    <div className="h-full flex flex-col p-6 gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Clips</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {clips.length > 0 ? `${clips.length} clip${clips.length !== 1 ? 's' : ''} loaded` : 'No clips loaded'}
          </p>
        </div>
        {clips.length > 0 && (
          <button
            onClick={() => setClips([])}
            className="text-sm text-neutral-500 hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <DropZone onFiles={handleFiles} />

      {clips.length > 0 && (
        <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 overflow-y-auto">
          {clips.map((path) => (
            <ClipCard key={path} path={path} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  )
}
