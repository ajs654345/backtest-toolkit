import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { executeBacktest } from '../src/utils/mt4Handler';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
    autoHideMenuBar: true,
    title: 'Backtesting Toolkit'
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:8080');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Configurar manejadores IPC
  ipcMain.handle('execute-backtest', async (_, config) => {
    try {
      const result = await executeBacktest(config);
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido durante el backtesting' 
      };
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});