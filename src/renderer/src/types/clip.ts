export interface Clip {
  // Identity
  id: string
  path: string

  // Display
  title: string        // editable, defaults to filename without extension

  // Edits
  duration: number | null  // null until ffprobe reads it
  trimStart: number        // seconds, default 0
  trimEnd: number | null   // null until duration known, then defaults to duration
  volume: number           // 0.0 = muted, 1.0 = original, 2.0 = double

  // Output
  outputFolder: string | null  // null = use global output folder from settings

  // Workflow state
  status: 'pending' | 'ready' | 'processing' | 'done' | 'error'
  errorMessage?: string
  outputPath?: string  // set after processing

  // Optional — only filled in if user chooses YouTube upload
  youtube?: {
    description: string
    tags: string[]
    visibility: 'public' | 'private' | 'unlisted'
  }
}
