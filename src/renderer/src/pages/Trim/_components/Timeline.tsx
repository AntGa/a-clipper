import { useRef, useCallback } from 'react'

interface TimelineProps {
  duration: number
  trimStart: number
  trimEnd: number
  currentTime: number
  onTrimChange: (start: number, end: number) => void
  onSeek: (time: number) => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function Timeline({
  duration,
  trimStart,
  trimEnd,
  currentTime,
  onTrimChange,
  onSeek,
}: TimelineProps): React.JSX.Element {
  const trackRef = useRef<HTMLDivElement>(null)

  const timeAtX = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return 0
      const rect = trackRef.current.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      return ratio * duration
    },
    [duration]
  )

  const startDrag = useCallback(
    (e: React.MouseEvent, handle: 'start' | 'end') => {
      e.preventDefault()
      const onMove = (ev: MouseEvent) => {
        const t = timeAtX(ev.clientX)
        if (handle === 'start') {
          onTrimChange(Math.min(t, trimEnd - 0.5), trimEnd)
        } else {
          onTrimChange(trimStart, Math.max(t, trimStart + 0.5))
        }
      }
      const onUp = () => {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    [timeAtX, trimStart, trimEnd, onTrimChange]
  )

  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      // Only seek if not clicking a handle
      if ((e.target as HTMLElement).dataset.handle) return
      onSeek(timeAtX(e.clientX))
    },
    [timeAtX, onSeek]
  )

  const toPercent = (t: number) => `${(t / duration) * 100}%`

  return (
    <div className="flex flex-col gap-2 px-4">
      {/* Track */}
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        className="relative h-10 bg-neutral-700 rounded-lg cursor-pointer select-none"
      >
        {/* Trimmed region */}
        <div
          className="absolute top-0 h-full bg-blue-600/40 rounded"
          style={{ left: toPercent(trimStart), width: toPercent(trimEnd - trimStart) }}
        />

        {/* Playhead */}
        <div
          className="absolute top-0 h-full w-0.5 bg-white z-10 pointer-events-none"
          style={{ left: toPercent(currentTime) }}
        />

        {/* Start handle */}
        <div
          data-handle="start"
          onMouseDown={(e) => startDrag(e, 'start')}
          className="absolute top-0 h-full w-3 bg-blue-500 rounded-l cursor-ew-resize z-20 flex items-center justify-center hover:bg-blue-400"
          style={{ left: toPercent(trimStart) }}
        >
          <div className="w-0.5 h-4 bg-white/60 rounded pointer-events-none" />
        </div>

        {/* End handle */}
        <div
          data-handle="end"
          onMouseDown={(e) => startDrag(e, 'end')}
          className="absolute top-0 h-full w-3 bg-blue-500 rounded-r cursor-ew-resize z-20 flex items-center justify-center hover:bg-blue-400"
          style={{ left: `calc(${toPercent(trimEnd)} - 0.75rem)` }}
        >
          <div className="w-0.5 h-4 bg-white/60 rounded pointer-events-none" />
        </div>
      </div>

      {/* Time labels */}
      <div className="relative h-4 text-xs text-neutral-500 select-none">
        <span className="absolute" style={{ left: toPercent(trimStart) }}>
          {formatTime(trimStart)}
        </span>
        <span className="absolute" style={{ left: toPercent(currentTime), transform: 'translateX(-50%)' }}>
          {formatTime(currentTime)}
        </span>
        <span className="absolute" style={{ left: toPercent(trimEnd), transform: 'translateX(-100%)' }}>
          {formatTime(trimEnd)}
        </span>
        <span className="absolute right-0 text-neutral-600">{formatTime(duration)}</span>
      </div>
    </div>
  )
}
