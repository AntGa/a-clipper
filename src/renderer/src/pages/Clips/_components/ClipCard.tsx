interface ClipCardProps {
  path: string
  onRemove: (path: string) => void
}

function fileName(path: string): string {
  return path.split(/[\\/]/).pop() ?? path
}

export default function ClipCard({ path, onRemove }: ClipCardProps): React.JSX.Element {
  const name = fileName(path)

  return (
    <div className="bg-neutral-800 rounded-lg p-4 flex flex-col gap-3 group relative">
      {/* Thumbnail placeholder */}
      <div className="w-full aspect-video bg-neutral-700 rounded-md flex items-center justify-center text-3xl">
        🎥
      </div>

      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-neutral-200 font-medium truncate" title={name}>
          {name}
        </p>
        <button
          onClick={() => onRemove(path)}
          className="text-neutral-600 hover:text-red-400 transition-colors shrink-0 text-lg leading-none"
          title="Remove"
        >
          ×
        </button>
      </div>
    </div>
  )
}
