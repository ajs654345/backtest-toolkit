
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { exec } from 'child_process';

let mainWindow: BrowserWindow | null = null;

const isDevelopment = process.env.NODE_ENV !== 'production';

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  if (isDevelopment) {
    // En desarrollo, espera a que el servidor de Vite esté listo
    await new Promise(resolve => setTimeout(resolve, 2000));
    await mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Configurar IPC handlers
ipcMain.handle('execute-mt4', async (_, config) => {
  try {
    const mt4Path = 'C:\\Users\\arodr\\AppData\\Roaming\\Darwinex MT4\\terminal.exe';
    console.log('Intentando ejecutar MT4 desde:', mt4Path);
    console.log('Configuración:', config);

    exec(`"${mt4Path}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error al ejecutar MT4:', error);
        return { success: false, error: error.message };
      }
      console.log('MT4 ejecutado correctamente');
      if (stderr) console.error('Error:', stderr);
    });

    return { success: true };
  } catch (error) {
    console.error('Error en execute-mt4:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
});
