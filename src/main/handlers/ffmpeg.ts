import { ipcMain, app } from 'electron'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'
import ffprobePath from 'ffprobe-static'
import { join } from 'path'
import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'fs'
import { createHash } from 'crypto'

ffmpeg.setFfmpegPath(ffmpegPath!)
ffmpeg.setFfprobePath(ffprobePath.path)

ipcMain.handle('ffmpeg:duration', (_, filePath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err)
      resolve(metadata.format.duration ?? 0)
    })
  })
})

const thumbDir = join(app.getPath('temp'), 'a-clipper-thumbs')
if (!existsSync(thumbDir)) mkdirSync(thumbDir, { recursive: true })

const TTL_DAYS = 7

function clearExpiredThumbnails(): void {
  const cutoff = Date.now() - TTL_DAYS * 24 * 60 * 60 * 1000
  for (const file of readdirSync(thumbDir)) {
    const filePath = join(thumbDir, file)
    const { mtimeMs } = statSync(filePath)
    if (mtimeMs < cutoff) {
      unlinkSync(filePath)
      console.log('[thumbnail] expired, deleted:', file)
    }
  }
}

clearExpiredThumbnails()

// Simple concurrency limiter — max 3 FFmpeg processes at a time
function makeLimit(concurrency: number) {
  let active = 0
  const queue: (() => void)[] = []
  return function limit<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const run = () => {
        active++
        fn().then(resolve, reject).finally(() => {
          active--
          if (queue.length > 0) queue.shift()!()
        })
      }
      if (active < concurrency) run()
      else queue.push(run)
    })
  }
}

const limit = makeLimit(3)

function generateThumbnail(filePath: string, thumbPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tryAt = (timestamp: number, fallback?: number): void => {
      ffmpeg(filePath)
        .screenshots({
          timestamps: [timestamp],
          filename: `${createHash('md5').update(filePath).digest('hex')}.jpg`,
          folder: thumbDir,
          size: '640x?'
        })
        .on('end', () => resolve())
        .on('error', (err) => {
          if (fallback !== undefined) {
            tryAt(fallback)
          } else {
            reject(err)
          }
        })
    }
    tryAt(1, 0)
  })
}

ipcMain.handle('ffmpeg:thumbnail', async (_, filePath: string): Promise<string> => {
  const hash = createHash('md5').update(filePath).digest('hex')
  const thumbPath = join(thumbDir, `${hash}.jpg`)
  const toUrl = (p: string) => `localfile:///${p.replace(/\\/g, '/')}`

  if (existsSync(thumbPath)) {
    return toUrl(thumbPath)
  }

  try {
    await limit(() => generateThumbnail(filePath, thumbPath))
    return toUrl(thumbPath)
  } catch (err) {
    console.error('[thumbnail] failed:', err)
    throw err
  }
})
