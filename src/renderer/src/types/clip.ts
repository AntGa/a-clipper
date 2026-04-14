export interface Clip {
  // Identity
  id: string
  path: string

  // Display
  title: string        // editable, defaults to filename without extension

  // Edits
  trimStart: number    // seconds, default 0
  trimEnd: number | null  // null = full duration (unknown until inspected)
  muted: boolean

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
