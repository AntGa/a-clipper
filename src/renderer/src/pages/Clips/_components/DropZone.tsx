import { useState, useCallback } from 'react'

interface DropZoneProps {
  onFiles: (paths: string[]) => void
}

export default function DropZone({ onFiles }: DropZoneProps): React.JSX.Element {
  const [dragging, setDragging] = useState(false)

  const handleOpenFolder = async (): Promise<void> => {
    const paths = await window.api.openFolder()
    if (paths.length) onFiles(paths)
  }

  const handleOpenFiles = async (): Promise<void> => {
    const paths = await window.api.openFiles()
    if (paths.length) onFiles(paths)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const videoExts = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v']
      const paths = Array.from(e.dataTransfer.files)
        .filter((f) => videoExts.some((ext) => f.name.toLowerCase().endsWith(ext)))
        .map((f) => f.path)
      if (paths.length) onFiles(paths)
    },
    [onFiles]
  )

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center gap-4 transition-colors ${
        dragging
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-neutral-600 hover:border-neutral-500'
      }`}
    >
      <div className="text-5xl">🎬</div>
      <div className="text-center">
        <p className="text-neutral-200 font-semibold text-lg">Drop videos here</p>
        <p className="text-neutral-500 text-sm mt-1">or choose how to add clips below</p>
      </div>
      <div className="flex gap-3 mt-2">
        <button
          onClick={handleOpenFolder}
          className="px-5 py-2.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Open Folder
        </button>
        <button
          onClick={handleOpenFiles}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Select Videos
        </button>
      </div>
      <p className="text-neutral-600 text-xs">MP4, MOV, AVI, MKV, WEBM supported</p>
    </div>
  )
}
