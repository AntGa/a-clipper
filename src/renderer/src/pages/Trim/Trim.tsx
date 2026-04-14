import { useEffect, useRef, useState } from 'react'
import { useClipsStore } from '@renderer/store/clips'
import { Clip } from '@renderer/types/clip'
import Timeline from './_components/Timeline'
import ClipInfo from './_components/ClipInfo'
import ClipStrip from './_components/ClipStrip'
import { useVideoUrl } from '@renderer/hooks/useVideoUrl'

export default function Trim(): React.JSX.Element {
  const { clips, updateClip } = useClipsStore()
  const [selectedId, setSelectedId] = useState<string | null>(clips[0]?.id ?? null)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const clip = clips.find((c) => c.id === selectedId) ?? null
  const videoUrl = useVideoUrl(clip?.path ?? null)

  // Load duration when clip changes
  useEffect(() => {
    if (!clip) return
    if (clip.duration != null) return
    window.api.getDuration(clip.path).then((duration) => {
      updateClip(clip.id, { duration, trimEnd: clip.trimEnd ?? duration })
    })
  }, [clip?.id])

  // Sync video playback state
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onTime = () => setCurrentTime(video.currentTime)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    video.addEventListener('timeupdate', onTime)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    return () => {
      video.removeEventListener('timeupdate', onTime)
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
    }
  }, [selectedId])

  const handleSelect = (c: Clip) => {
    setSelectedId(c.id)
    setCurrentTime(0)
    setIsPlaying(false)
  }

  const handleSeek = (time: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = time
    setCurrentTime(time)
  }

  const handleTrimChange = (start: number, end: number) => {
    if (!clip) return
    updateClip(clip.id, { trimStart: start, trimEnd: end })
  }

  const handleSetIn = () => {
    if (!clip || !videoRef.current) return
    const t = videoRef.current.currentTime
    updateClip(clip.id, { trimStart: Math.min(t, (clip.trimEnd ?? clip.duration ?? t) - 0.5) })
  }

  const handleSetOut = () => {
    if (!clip || !videoRef.current) return
    const t = videoRef.current.currentTime
    updateClip(clip.id, { trimEnd: Math.max(t, clip.trimStart + 0.5) })
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) video.pause()
    else video.play()
  }

  const skip = (seconds: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, clip?.duration ?? 0))
  }

  return (
    <div className="h-full flex flex-col">
      {/* Main editor area */}
      <div className="flex flex-1 min-h-0">
        {/* Left: video + timeline + controls */}
        <div className="flex-1 flex flex-col gap-4 p-5 min-w-0">
          {clip ? (
            <>
              {/* Video */}
              <div className="flex-1 bg-black rounded-xl overflow-hidden flex items-center justify-center min-h-0">
                <video
                  ref={videoRef}
                  src={videoUrl ?? undefined}
                  className="max-h-full max-w-full"
                  onEnded={() => setIsPlaying(false)}
                />
              </div>

              {/* Timeline */}
              {clip.duration != null && clip.trimEnd != null && (
                <Timeline
                  duration={clip.duration}
                  trimStart={clip.trimStart}
                  trimEnd={clip.trimEnd}
                  currentTime={currentTime}
                  onTrimChange={handleTrimChange}
                  onSeek={handleSeek}
                />
              )}

              {/* Controls */}
              <div className="flex items-center gap-4 px-4">
                {/* Playback */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => skip(-5)}
                    className="w-9 h-9 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-sm transition-colors flex items-center justify-center"
                  >
                    ⏪
                  </button>
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center justify-center text-lg"
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                  <button
                    onClick={() => skip(5)}
                    className="w-9 h-9 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-sm transition-colors flex items-center justify-center"
                  >
                    ⏩
                  </button>
                </div>

                <div className="w-px h-6 bg-neutral-700" />

                {/* In/Out */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSetIn}
                    className="px-3 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-semibold transition-colors"
                  >
                    Set In
                  </button>
                  <button
                    onClick={handleSetOut}
                    className="px-3 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-semibold transition-colors"
                  >
                    Set Out
                  </button>
                </div>

                <div className="w-px h-6 bg-neutral-700" />

                {/* Volume */}
                <div className="flex items-center gap-2 flex-1 max-w-48">
                  <button
                    onClick={() => updateClip(clip.id, { volume: clip.volume === 0 ? 1 : 0 })}
                    className="text-neutral-400 hover:text-white transition-colors text-lg"
                    title={clip.volume === 0 ? 'Unmute' : 'Mute'}
                  >
                    {clip.volume === 0 ? '🔇' : clip.volume < 0.5 ? '🔉' : '🔊'}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={2}
                    step={0.01}
                    value={clip.volume}
                    onChange={(e) => updateClip(clip.id, { volume: parseFloat(e.target.value) })}
                    className="flex-1 accent-blue-500"
                  />
                  <span className="text-xs text-neutral-400 w-10 text-right">
                    {Math.round(clip.volume * 100)}%
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-600">
              <p>Select a clip below to start editing</p>
            </div>
          )}
        </div>

        {/* Right: clip info */}
        <div className="w-64 border-l border-neutral-700 shrink-0">
          {clip ? (
            <ClipInfo clip={clip} />
          ) : (
            <div className="p-5 text-sm text-neutral-600">No clip selected</div>
          )}
        </div>
      </div>

      {/* Bottom: clip strip */}
      <ClipStrip clips={clips} selectedId={selectedId} onSelect={handleSelect} />
    </div>
  )
}
