import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  openFolder: (): Promise<string[]> => ipcRenderer.invoke('dialog:openFolder'),
  openFiles: (): Promise<string[]> => ipcRenderer.invoke('dialog:openFiles'),
  selectFolder: (): Promise<string | null> => ipcRenderer.invoke('dialog:selectFolder'),
  getThumbnail: (filePath: string): Promise<string> => ipcRenderer.invoke('ffmpeg:thumbnail', filePath),
  getDuration: (filePath: string): Promise<number> => ipcRenderer.invoke('ffmpeg:duration', filePath),
  getVideoPort: (): Promise<number> => ipcRenderer.invoke('video:port'),
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
