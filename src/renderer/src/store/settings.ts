import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
  outputFolder: string | null
  setOutputFolder: (folder: string | null) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      outputFolder: null,
      setOutputFolder: (folder) => set({ outputFolder: folder }),
    }),
    { name: 'a-clipper-settings' }
  )
)
