import { useClipsStore } from '@renderer/store/clips'
import DropZone from './_components/DropZone'
import ClipCard from './_components/ClipCard'

export default function Clips(): React.JSX.Element {
  const { clips, addClips, removeClip, clearClips } = useClipsStore()

  const readyCount = clips.filter((c) => c.status === 'ready').length

  return (
    <div className="h-full flex flex-col p-6 gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Clips</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {clips.length > 0
              ? `${clips.length} clip${clips.length !== 1 ? 's' : ''} — ${readyCount} ready`
              : 'No clips loaded'}
          </p>
        </div>
        {clips.length > 0 && (
          <button
            onClick={clearClips}
            className="text-sm text-neutral-500 hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <DropZone onFiles={addClips} />

      {clips.length > 0 && (
        <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 overflow-y-auto">
          {clips.map((clip) => (
            <ClipCard key={clip.id} clip={clip} onRemove={() => removeClip(clip.id)} />
          ))}
        </div>
      )}
    </div>
  )
}
