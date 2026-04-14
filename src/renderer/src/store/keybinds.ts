import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type KeybindAction =
  | 'playPause'
  | 'setIn'
  | 'setOut'
  | 'skipBack'
  | 'skipForward'

export const DEFAULT_KEYBINDS: Record<KeybindAction, string> = {
  playPause: 'Space',
  setIn: 'KeyI',
  setOut: 'KeyO',
  skipBack: 'ArrowLeft',
  skipForward: 'ArrowRight',
}

export const KEYBIND_LABELS: Record<KeybindAction, string> = {
  playPause: 'Play / Pause',
  setIn: 'Set In Point',
  setOut: 'Set Out Point',
  skipBack: 'Skip Back 5s',
  skipForward: 'Skip Forward 5s',
}

interface KeybindsStore {
  keybinds: Record<KeybindAction, string>
  setKeybind: (action: KeybindAction, code: string) => void
  resetKeybinds: () => void
}

export const useKeybindsStore = create<KeybindsStore>()(
  persist(
    (set) => ({
      keybinds: { ...DEFAULT_KEYBINDS },
      setKeybind: (action, code) =>
        set((state) => ({ keybinds: { ...state.keybinds, [action]: code } })),
      resetKeybinds: () => set({ keybinds: { ...DEFAULT_KEYBINDS } }),
    }),
    { name: 'a-clipper-keybinds' }
  )
)
