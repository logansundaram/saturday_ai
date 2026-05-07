import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('saturday', {
  getSystemMetrics: () => ipcRenderer.invoke('get-system-metrics'),

  onSystemMetrics: (callback: (metrics: unknown) => void) => {
    const handler = (_: Electron.IpcRendererEvent, data: unknown) => callback(data)
    ipcRenderer.on('system-metrics', handler)
    return () => ipcRenderer.removeListener('system-metrics', handler)
  },
})
