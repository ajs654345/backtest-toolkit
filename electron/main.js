
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const os = require('os');
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
      filters: [{ name: 'Robot Files', extensions: ['ex4', 'mq4', 'set'] }],
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

  // Obtener la ruta de documentos del usuario
  ipcMain.handle('get-documents-path', () => {
    return path.join(os.homedir(), 'Documents', 'MT4_Backtest_Results');
  });

  // Asegurar que un directorio existe
  ipcMain.handle('ensure-directory', async (event, { path: dirPath }) => {
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      return { success: true };
    } catch (error) {
      console.error('Error al crear directorio:', error);
      return { error: error.message };
    }
  });

  // Abrir el explorador de archivos en una ruta determinada
  ipcMain.handle('open-file-explorer', async (event, { path: dirPath }) => {
    try {
      if (process.platform === 'win32') {
        exec(`explorer "${dirPath}"`);
      } else if (process.platform === 'darwin') {
        exec(`open "${dirPath}"`);
      } else {
        exec(`xdg-open "${dirPath}"`);
      }
      return { success: true };
    } catch (error) {
      console.error('Error al abrir explorador:', error);
      return { error: error.message };
    }
  });

  // Detectar instalaciones de MT4
  ipcMain.handle('get-mt4-terminals', async () => {
    try {
      const terminals = [];
      
      // Rutas comunes donde MT4 podría estar instalado en Windows
      const commonPaths = [
        path.join(os.homedir(), 'AppData', 'Roaming', 'MetaQuotes', 'Terminal'),
        'C:\\Program Files\\MetaTrader 4',
        'C:\\Program Files (x86)\\MetaTrader 4',
        path.join(os.homedir(), 'AppData', 'Roaming', 'Darwinex MT4')
      ];
      
      // Buscar en rutas comunes
      for (const basePath of commonPaths) {
        if (fs.existsSync(basePath)) {
          if (basePath.includes('Terminal')) {
            // Para la estructura de MetaQuotes, buscar subdirectorios (ID de terminal)
            const dirs = fs.readdirSync(basePath);
            for (const dir of dirs) {
              const terminalPath = path.join(basePath, dir, 'terminal.exe');
              if (fs.existsSync(terminalPath)) {
                terminals.push(terminalPath);
              }
            }
          } else {
            // Para instalaciones directas
            const terminalPath = path.join(basePath, 'terminal.exe');
            if (fs.existsSync(terminalPath)) {
              terminals.push(terminalPath);
            }
          }
        }
      }
      
      // Para desarrollo/pruebas, si no se encontraron terminales, devolver algunos ejemplos
      if (terminals.length === 0 && isDev) {
        return { 
          data: [
            'C:\\Program Files\\Darwinex MT4\\terminal.exe',
            'C:\\Program Files\\MetaTrader 4\\terminal.exe',
            'C:\\Users\\Usuario\\AppData\\Roaming\\MetaQuotes\\Terminal\\XXXXXXXXXXXXXXXX\\terminal.exe'
          ]
        };
      }
      
      return { data: terminals };
    } catch (error) {
      console.error('Error al detectar terminales MT4:', error);
      return { error: error.message };
    }
  });

  // Manejador para comandos MT4
  ipcMain.handle('mt4-command', async (event, command) => {
    console.log('Comando MT4 recibido:', command);
    
    try {
      // Verificar que el comando tenga los campos necesarios
      if (!command.robot || !command.symbol || !command.terminal) {
        throw new Error('Comando incompleto: se requiere robot, símbolo y terminal');
      }
      
      // Verificar que el terminal exista
      if (!fs.existsSync(command.terminal)) {
        throw new Error(`Terminal no encontrado: ${command.terminal}`);
      }
      
      // Construir comando para MT4
      // Nota: Esta es una implementación simplificada. La real dependería de cómo
      // integrarse con MT4 y podría requerir comunicación adicional
      const mt4Args = [
        `/config:tester.ini`,
        `/symbol:${command.symbol}`,
        `/ea:${command.robot}`,
        `/period:M1`,
        `/model:${command.mode === 'tick' ? '1' : command.mode === 'price' ? '2' : '0'}`,
        `/fromdate:${new Date(command.from).toISOString().split('T')[0]}`,
        `/todate:${new Date(command.to).toISOString().split('T')[0]}`,
        `/report:${path.join(command.outputPath, `${command.robot}_${command.symbol}.htm`)}`
      ].join(' ');
      
      // Ejecutar MT4 con los argumentos
      console.log(`Ejecutando: "${command.terminal}" ${mt4Args}`);
      
      // En una implementación real, aquí ejecutaríamos MT4 y esperaríamos su finalización
      // Por ahora, simulamos el resultado después de un retraso
      setTimeout(() => {
        mainWindow?.webContents.send('progress-update', {
          progress: 100,
          current: 1,
          total: 1,
          robot: command.robot,
          pair: command.symbol
        });
        
        mainWindow?.webContents.send('mt4-result', {
          success: true,
          robot: command.robot,
          symbol: command.symbol,
          report: path.join(command.outputPath, `${command.robot}_${command.symbol}.htm`)
        });
      }, 2000);
      
      return { success: true, message: 'Comando enviado a MT4' };
    } catch (error) {
      console.error('Error al ejecutar comando MT4:', error);
      return { error: error.message };
    }
  });

  // Manejador para resultados MT4
  ipcMain.handle('mt4-result', async () => {
    // Simulación de resultado
    return { data: 'Backtesting completado', success: true };
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
