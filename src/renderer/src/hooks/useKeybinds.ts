import { useEffect } from 'react'
import { KeybindAction, useKeybindsStore } from '@renderer/store/keybinds'

type Handlers = Partial<Record<KeybindAction, () => void>>

export function useKeybinds(handlers: Handlers): void {
  const { keybinds } = useKeybindsStore()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      for (const [action, handler] of Object.entries(handlers) as [KeybindAction, () => void][]) {
        if (e.code === keybinds[action]) {
          e.preventDefault()
          handler()
          return
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [keybinds, handlers])
}
