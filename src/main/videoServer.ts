import { createServer, IncomingMessage, ServerResponse } from 'http'
import { createReadStream, statSync } from 'fs'
import { extname } from 'path'

const MIME: Record<string, string> = {
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.avi': 'video/x-msvideo',
  '.mkv': 'video/x-matroska',
  '.webm': 'video/webm',
  '.m4v': 'video/mp4',
}

function handler(req: IncomingMessage, res: ServerResponse): void {
  const url = new URL(req.url ?? '/', `http://localhost`)
  const filePath = decodeURIComponent(url.searchParams.get('path') ?? '')

  if (!filePath) {
    res.writeHead(400)
    res.end('Missing path')
    return
  }

  let stat
  try {
    stat = statSync(filePath)
  } catch {
    res.writeHead(404)
    res.end('Not found')
    return
  }

  const fileSize = stat.size
  const mimeType = MIME[extname(filePath).toLowerCase()] ?? 'video/mp4'
  const rangeHeader = req.headers['range']

  const corsHeaders = { 'Access-Control-Allow-Origin': '*' }

  if (rangeHeader) {
    const [startStr, endStr] = rangeHeader.replace('bytes=', '').split('-')
    const start = parseInt(startStr, 10)
    const end = endStr ? parseInt(endStr, 10) : fileSize - 1
    const chunkSize = end - start + 1

    res.writeHead(206, {
      ...corsHeaders,
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': mimeType,
    })
    createReadStream(filePath, { start, end }).pipe(res)
  } else {
    res.writeHead(200, {
      ...corsHeaders,
      'Content-Length': fileSize,
      'Content-Type': mimeType,
      'Accept-Ranges': 'bytes',
    })
    createReadStream(filePath).pipe(res)
  }
}

export function startVideoServer(): Promise<number> {
  return new Promise((resolve) => {
    const server = createServer(handler)
    // Port 0 = OS picks a random available port
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as { port: number }
      console.log(`[video-server] listening on http://127.0.0.1:${port}`)
      resolve(port)
    })
  })
}
