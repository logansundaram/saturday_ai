import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import { getSystemMetrics } from './metrics'

const isDev = !app.isPackaged

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    backgroundColor: '#1e1e1e',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  const metricsInterval = setInterval(async () => {
    try {
      const metrics = await getSystemMetrics()
      if (!win.isDestroyed()) win.webContents.send('system-metrics', metrics)
    } catch {
      // best-effort
    }
  }, 1000)

  win.on('closed', () => clearInterval(metricsInterval))
}

app.whenReady().then(createWindow)

ipcMain.handle('get-system-metrics', () => getSystemMetrics())

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
