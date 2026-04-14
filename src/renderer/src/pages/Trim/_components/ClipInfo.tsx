import { Clip } from '@renderer/types/clip'
import { useClipsStore } from '@renderer/store/clips'
import { useSettingsStore } from '@renderer/store/settings'

interface ClipInfoProps {
  clip: Clip
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function shortPath(folder: string): string {
  return folder.split(/[\\/]/).slice(-2).join('/')
}

export default function ClipInfo({ clip }: ClipInfoProps): React.JSX.Element {
  const { updateClip, markReady, markPending } = useClipsStore()
  const { outputFolder: globalFolder, setOutputFolder } = useSettingsStore()

  const toggleReady = () => {
    if (clip.status === 'ready') markPending(clip.id)
    else markReady(clip.id)
  }

  const pickGlobalFolder = async () => {
    const folder = await window.api.selectFolder()
    if (folder) setOutputFolder(folder)
  }

  const pickClipFolder = async () => {
    const folder = await window.api.selectFolder()
    if (folder) updateClip(clip.id, { outputFolder: folder })
  }

  const clearClipFolder = () => updateClip(clip.id, { outputFolder: null })

  const effectiveFolder = clip.outputFolder ?? globalFolder

  return (
    <div className="flex flex-col gap-6 p-5 h-full overflow-y-auto scrollbar-hide">
      {/* Title */}
      <div>
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">Title</p>
        <input
          type="text"
          value={clip.title}
          onChange={(e) => updateClip(clip.id, { title: e.target.value })}
          className="w-full bg-neutral-700 text-white text-sm px-3 py-2 rounded-lg border border-neutral-600 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Info */}
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

      {/* Output folder */}
      <div>
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
          Output Folder
        </p>

        {/* Global folder */}
        <div className="flex flex-col gap-1 mb-3">
          <p className="text-xs text-neutral-600">Global default</p>
          <button
            onClick={pickGlobalFolder}
            className="w-full text-left px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition-colors text-xs"
          >
            {globalFolder ? (
              <span className="text-neutral-300" title={globalFolder}>
                📁 {shortPath(globalFolder)}
              </span>
            ) : (
              <span className="text-neutral-500">Click to set global folder…</span>
            )}
          </button>
        </div>

        {/* Per-clip override */}
        <div className="flex flex-col gap-1">
          <p className="text-xs text-neutral-600">
            This clip{' '}
            {clip.outputFolder ? (
              <button onClick={clearClipFolder} className="text-red-500 hover:text-red-400 underline">
                (clear override)
              </button>
            ) : (
              <span className="text-neutral-600">— using global</span>
            )}
          </p>
          <button
            onClick={pickClipFolder}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-xs border ${
              clip.outputFolder
                ? 'bg-blue-600/20 border-blue-500/50 hover:bg-blue-600/30'
                : 'bg-neutral-700 border-transparent hover:bg-neutral-600'
            }`}
          >
            {clip.outputFolder ? (
              <span className="text-blue-300" title={clip.outputFolder}>
                📁 {shortPath(clip.outputFolder)}
              </span>
            ) : (
              <span className="text-neutral-500">Override for this clip…</span>
            )}
          </button>
        </div>

        {/* Effective output */}
        {effectiveFolder && (
          <p className="text-xs text-neutral-600 mt-2 truncate" title={effectiveFolder}>
            Will export to: <span className="text-neutral-500">{shortPath(effectiveFolder)}</span>
          </p>
        )}
      </div>

      {/* Mark ready */}
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
