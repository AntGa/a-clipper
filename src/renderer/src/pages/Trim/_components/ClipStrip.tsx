import { Clip } from '@renderer/types/clip'

interface ClipStripProps {
  clips: Clip[]
  selectedId: string | null
  onSelect: (clip: Clip) => void
}

function StripCard({
  clip,
  selected,
  onSelect,
}: {
  clip: Clip
  selected: boolean
  onSelect: () => void
}): React.JSX.Element {
  return (
    <button
      onClick={onSelect}
      className={`shrink-0 w-36 rounded-lg overflow-hidden border-2 transition-colors text-left ${
        selected ? 'border-blue-500' : 'border-transparent hover:border-neutral-600'
      }`}
    >
      <div className="w-full aspect-video bg-neutral-700 flex items-center justify-center text-xl">
        🎬
      </div>
      <div className="px-2 py-1.5 bg-neutral-800">
        <p className="text-xs text-neutral-300 truncate">{clip.title}</p>
      </div>
    </button>
  )
}

export default function ClipStrip({ clips, selectedId, onSelect }: ClipStripProps): React.JSX.Element {
  const pending = clips.filter((c) => c.status === 'pending')
  const ready = clips.filter((c) => c.status === 'ready')

  return (
    <div className="border-t border-neutral-700 bg-neutral-900 px-6 py-4 flex flex-col gap-3 shrink-0">
      {pending.length > 0 && (
        <div className="flex items-start gap-4">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest pt-2 w-16 shrink-0">
            Pending
          </span>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {pending.map((clip) => (
              <StripCard
                key={clip.id}
                clip={clip}
                selected={clip.id === selectedId}
                onSelect={() => onSelect(clip)}
              />
            ))}
          </div>
        </div>
      )}

      {ready.length > 0 && (
        <div className="flex items-start gap-4">
          <span className="text-xs font-semibold text-green-600 uppercase tracking-widest pt-2 w-16 shrink-0">
            Ready
          </span>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {ready.map((clip) => (
              <StripCard
                key={clip.id}
                clip={clip}
                selected={clip.id === selectedId}
                onSelect={() => onSelect(clip)}
              />
            ))}
          </div>
        </div>
      )}

      {clips.length === 0 && (
        <p className="text-sm text-neutral-600">No clips loaded — add some on the Clips page.</p>
      )}
    </div>
  )
}
