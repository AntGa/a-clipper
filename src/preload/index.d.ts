import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      openFolder: () => Promise<string[]>
      openFiles: () => Promise<string[]>
      getThumbnail: (filePath: string) => Promise<string>
    }
  }
}
