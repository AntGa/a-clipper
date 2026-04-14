import { create } from 'zustand'
import { Clip } from '@renderer/types/clip'

function pathToTitle(path: string): string {
  const file = path.split(/[\\/]/).pop() ?? path
  return file.replace(/\.[^/.]+$/, '')
}

function createClip(path: string): Clip {
  return {
    id: crypto.randomUUID(),
    path,
    title: pathToTitle(path),
    trimStart: 0,
    trimEnd: null,
    muted: false,
    status: 'pending',
  }
}

interface ClipsStore {
  clips: Clip[]
  addClips: (paths: string[]) => void
  removeClip: (id: string) => void
  clearClips: () => void
  updateClip: (id: string, changes: Partial<Clip>) => void
  markReady: (id: string) => void
  markPending: (id: string) => void
}

export const useClipsStore = create<ClipsStore>((set) => ({
  clips: [],

  addClips: (paths) =>
    set((state) => {
      const existing = new Set(state.clips.map((c) => c.path))
      const newClips = paths.filter((p) => !existing.has(p)).map(createClip)
      return { clips: [...state.clips, ...newClips] }
    }),

  removeClip: (id) =>
    set((state) => ({ clips: state.clips.filter((c) => c.id !== id) })),

  clearClips: () => set({ clips: [] }),

  updateClip: (id, changes) =>
    set((state) => ({
      clips: state.clips.map((c) => (c.id === id ? { ...c, ...changes } : c)),
    })),

  markReady: (id) =>
    set((state) => ({
      clips: state.clips.map((c) => (c.id === id ? { ...c, status: 'ready' } : c)),
    })),

  markPending: (id) =>
    set((state) => ({
      clips: state.clips.map((c) => (c.id === id ? { ...c, status: 'pending' } : c)),
    })),
}))
