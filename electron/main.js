
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

  // Manejador para comandos MT4
  ipcMain.handle('mt4-command', async (event, command) => {
    console.log('Comando MT4 recibido:', command);
    
    // Aquí implementarías la lógica real para ejecutar los comandos de MT4
    // Por ahora, simplemente devolvemos un resultado simulado
    return { success: true, message: 'Comando ejecutado correctamente' };
  });

  // Manejador para resultados MT4
  ipcMain.handle('mt4-result', async () => {
    // Simulación de resultado
    return { data: 'Backtesting completado' };
  });

  // Manejadores para Excel
  ipcMain.handle('generate-excel', async (event, params) => {
    console.log('Generando Excel:', params);
    return { success: true };
  });

  ipcMain.handle('update-excel', async (event, params) => {
    console.log('Actualizando Excel:', params);
    return { success: true };
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
