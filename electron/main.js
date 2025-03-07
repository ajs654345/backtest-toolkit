
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const url = require('url');

// Detectar modo desarrollo
const isDev = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

// Mantener una referencia global al objeto window
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
    autoHideMenuBar: false,
    title: 'Backtesting Toolkit'
  });

  // Configurar la URL basada en el entorno
  const startUrl = isDev 
    ? 'http://localhost:8080' 
    : url.format({
        pathname: path.join(__dirname, '../dist/index.html'),
        protocol: 'file:',
        slashes: true
      });
  
  console.log('Cargando aplicación desde:', startUrl);
  
  // Cargar la aplicación
  mainWindow.loadURL(startUrl);
  
  // Abrir DevTools en desarrollo y manejar errores
  if (isDev) {
    mainWindow.webContents.openDevTools();
    console.log('DevTools abierto en modo desarrollo');
  }

  // Manejar errores de carga
  mainWindow.webContents.on('did-fail-load', () => {
    console.log('Falló la carga, intentando nuevamente...');
    // Esperar un momento y volver a intentar
    setTimeout(() => {
      if (!mainWindow.isDestroyed()) {
        mainWindow.loadURL(startUrl);
      }
    }, 1000);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Crear ventana cuando la aplicación esté lista
app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Configurar los manejadores de IPC
  setupIPCHandlers();
});

function setupIPCHandlers() {
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
    // Aquí implementarías la lógica real para ejecutar el comando
    return { success: true, message: 'Comando ejecutado correctamente' };
  });

  // Manejador para resultados MT4
  ipcMain.handle('mt4-result', async () => {
    // Simular resultado exitoso para desarrollo
    return { success: true, data: 'Backtesting completado' };
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

  // Manejador para obtener terminales MT4
  ipcMain.handle('get-mt4-terminals', async () => {
    // Simulación de terminales para desarrollo
    return { success: true, data: [
      'C:\\Program Files\\Darwinex MT4\\terminal.exe',
      'C:\\Program Files\\MetaTrader 4\\terminal.exe',
      'C:\\Users\\Usuario\\AppData\\Roaming\\MetaQuotes\\Terminal\\1B80A8D8FC5F405C891BF1E1E5185D92\\terminal.exe'
    ]};
  });

  // Manejador para crear directorios
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

  // Manejador para obtener la ruta de documentos
  ipcMain.handle('get-documents-path', async () => {
    try {
      const documentsPath = app.getPath('documents');
      return documentsPath;
    } catch (error) {
      console.error('Error al obtener ruta de documentos:', error);
      return 'C:/MT4_Backtest_Results';
    }
  });

  // Manejador para eventos de progreso
  ipcMain.on('progress-update', (event, data) => {
    if (mainWindow) {
      mainWindow.webContents.send('progress-update', data);
    }
  });
}

// Salir de la aplicación cuando todas las ventanas estén cerradas (excepto en macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Configurar manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
});
