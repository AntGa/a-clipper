import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      openFolder: () => Promise<string[]>
      openFiles: () => Promise<string[]>
      selectFolder: () => Promise<string | null>
      getThumbnail: (filePath: string) => Promise<string>
      getDuration: (filePath: string) => Promise<number>
      getVideoPort: () => Promise<number>
    }
  }
}
