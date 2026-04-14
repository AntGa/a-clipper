import { Clip } from '@renderer/types/clip'
import { useClipsStore } from '@renderer/store/clips'

interface ClipInfoProps {
  clip: Clip
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function ClipInfo({ clip }: ClipInfoProps): React.JSX.Element {
  const { updateClip, markReady, markPending } = useClipsStore()

  const toggleReady = () => {
    if (clip.status === 'ready') markPending(clip.id)
    else markReady(clip.id)
  }

  return (
    <div className="flex flex-col gap-6 p-5 h-full">
      <div>
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">Title</p>
        <input
          type="text"
          value={clip.title}
          onChange={(e) => updateClip(clip.id, { title: e.target.value })}
          className="w-full bg-neutral-700 text-white text-sm px-3 py-2 rounded-lg border border-neutral-600 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">Info</p>
        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Duration</span>
            <span className="text-neutral-300">
              {clip.duration != null ? formatTime(clip.duration) : '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Trim</span>
            <span className="text-neutral-300">
              {clip.trimEnd != null
                ? `${formatTime(clip.trimStart)} → ${formatTime(clip.trimEnd)}`
                : '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Volume</span>
            <span className="text-neutral-300">{Math.round(clip.volume * 100)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Status</span>
            <span className={clip.status === 'ready' ? 'text-green-400' : 'text-neutral-400'}>
              {clip.status}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <button
          onClick={toggleReady}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            clip.status === 'ready'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-neutral-700 hover:bg-green-600 text-neutral-300 hover:text-white'
          }`}
        >
          {clip.status === 'ready' ? '✓ Ready' : 'Mark as Ready'}
        </button>
      </div>
    </div>
  )
}
