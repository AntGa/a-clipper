import { useEffect, useState } from 'react'

let cachedPort: number | null = null

export function useVideoUrl(filePath: string | null): string | null {
  const [port, setPort] = useState<number | null>(cachedPort)

  useEffect(() => {
    if (cachedPort) return
    window.api.getVideoPort().then((p) => {
      cachedPort = p
      setPort(p)
    })
  }, [])

  if (!port || !filePath) return null
  return `http://127.0.0.1:${port}/video?path=${encodeURIComponent(filePath)}`
}
