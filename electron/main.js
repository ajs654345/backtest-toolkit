
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = require('electron-is-dev');

// Mantener una referencia global al objeto window
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
    autoHideMenuBar: false,
    title: 'Backtesting Toolkit'
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Manejador para seleccionar carpeta de salida
  ipcMain.handle('select-directory', async () => {
    if (!mainWindow) return { canceled: true };
    
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      title: 'Seleccionar carpeta de salida'
    });
    
    return result;
  });

  // Manejador para seleccionar archivos de robot
  ipcMain.handle('select-files', async () => {
    if (!mainWindow) return { canceled: true };
    
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Robot Files', extensions: ['ex4', 'mq4'] }],
      title: 'Seleccionar archivos de robot'
    });
    
    return result;
  });

  // Manejador para seleccionar archivo Excel existente
  ipcMain.handle('select-excel', async () => {
    if (!mainWindow) return { canceled: true };
    
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }],
      title: 'Seleccionar archivo Excel'
    });
    
    return result;
  });

  // Implementación real para handlers
  ipcMain.handle('mt4-command', async (event, command) => {
    console.log('Comando MT4 recibido:', command);
    return { success: true, message: 'Comando ejecutado correctamente' };
  });

  ipcMain.handle('mt4-result', async () => {
    return { data: 'Backtesting completado' };
  });

  ipcMain.handle('generate-excel', async (event, params) => {
    console.log('Generando Excel:', params);
    return { success: true };
  });

  ipcMain.handle('update-excel', async (event, params) => {
    console.log('Actualizando Excel:', params);
    return { success: true };
  });

  ipcMain.handle('get-mt4-terminals', async () => {
    // Simulación de terminales para desarrollo
    return { data: [
      'C:\\Program Files\\Darwinex MT4\\terminal.exe',
      'C:\\Program Files\\MetaTrader 4\\terminal.exe',
      'C:\\Users\\Usuario\\AppData\\Roaming\\MetaQuotes\\Terminal\\1B80A8D8FC5F405C891BF1E1E5185D92\\terminal.exe'
    ]};
  });

  ipcMain.handle('ensure-directory', async (event, { path }) => {
    try {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  });

  ipcMain.handle('get-documents-path', async () => {
    return app.getPath('documents');
  });

  // Manejador para eventos de progreso
  ipcMain.on('progress-update', (event, data) => {
    if (mainWindow) {
      mainWindow.webContents.send('progress-update', data);
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
